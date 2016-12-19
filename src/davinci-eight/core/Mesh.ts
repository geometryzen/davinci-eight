import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';
import { Color } from './Color';
import { ColorFacet } from '../facets/ColorFacet';
import ContextManager from './ContextManager';
import { Drawable } from './Drawable';
import { Geometric3 } from '../math/Geometric3';
import { Geometry } from './Geometry';
import { Material } from './Material';
import AbstractMesh from '../core/AbstractMesh';
import Matrix4 from '../math/Matrix4';
import MeshOptions from './MeshOptions';
import { ModelFacet } from '../facets/ModelFacet';
import notSupported from '../i18n/notSupported';
import quadVectorE3 from '../math/quadVectorE3';
import { R3 } from '../math/R3';
import Spinor3 from '../math/Spinor3';
import Texture from './Texture';
import TextureFacet from '../facets/TextureFacet';
import vec from '../math/R3';

const COLOR_FACET_NAME = 'color';
const TEXTURE_FACET_NAME = 'image';
const MODEL_FACET_NAME = 'model';

/**
 * The standard pairing of a Geometry and a Material.
 */
export class Mesh<G extends Geometry, M extends Material> extends Drawable<G, M> implements AbstractMesh<G, M> {
    /**
     * 
     */
    private currentAxis: Geometric3;
    /**
     * 
     */
    private currentMeridian: Geometric3;
    /**
     * 
     */
    private referenceAxis: R3;
    /**
     * 
     */
    private referenceMeridian: R3;
    /**
     * 
     */
    private axisChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;
    /**
     * 
     */
    private meridianChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;
    /**
     * 
     */
    private attitudeChangeHandler: (eventName: string, key: string, value: number, source: Geometric3) => void;
    /**
     * Scratch variable for intermediate calculation value.
     * This can probably be raised to a module level constant.
     */
    private canonicalScale = Matrix4.one();
    /**
     * The rotation matrix equivalent to the initial tilt spinor.
     */
    private K = Matrix4.one();
    /**
     * The (cached) inverse of K.
     */
    private Kinv = Matrix4.one();

    /**
     * Cached value that tells you whether the K matrix is unity.
     */
    private Kidentity = true;
    /**
     * Initializes this Mesh with a ColorFacet ('color'), a TextureFacet ('image'), and a ModelFacet ('model').
     * 
     * @param geometry An optional Geometry, which may be supplied later.
     * @param material An optional Material, which may be supplied later.
     * @param contextManager
     * @param options
     * @param levelUp The zero-based level of this instance in an inheritance hierarchy. 
     */
    constructor(geometry: G, material: M, contextManager: ContextManager, options: MeshOptions = {}, levelUp = 0) {
        super(geometry, material, contextManager, levelUp + 1);
        this.setLoggingName('Mesh');

        this.setFacet(COLOR_FACET_NAME, new ColorFacet());

        const textureFacet = new TextureFacet();
        this.setFacet(TEXTURE_FACET_NAME, textureFacet);
        textureFacet.release();

        this.setFacet(MODEL_FACET_NAME, new ModelFacet());

        this.referenceAxis = options.axis ? vec(options.axis.x, options.axis.y, options.axis.z) : canonicalAxis;
        this.referenceMeridian = options.meridian ? vec(options.meridian.x, options.meridian.y, options.meridian.z) : canonicalAxis;

        const tilt = Geometric3.rotorFromFrameToFrame([canonicalAxis, canonicalMeridian, canonicalAxis.cross(canonicalMeridian)], [this.referenceAxis, this.referenceMeridian, this.referenceAxis.cross(this.referenceMeridian)]);
        if (tilt && !Spinor3.isOne(tilt)) {
            this.Kidentity = false;
            this.K.rotation(tilt);
            this.Kinv.copy(this.K).inv();
        }

        this.currentAxis = Geometric3.fromVector(this.referenceAxis);
        this.currentMeridian = Geometric3.fromVector(this.referenceMeridian);

        /**
         * cascade flag prevents infinite recursion.
         */
        let cascade = true;
        this.axisChangeHandler = (eventName: string, key: string, value: number, axis: Geometric3) => {
            if (cascade) {
                cascade = false;

                this.R.rotorFromFrameToFrame([this.referenceAxis, this.referenceMeridian, this.referenceAxis.cross(this.referenceMeridian)], [this.currentAxis, this.currentMeridian, this.currentAxis.clone().cross(this.currentMeridian)]);
                this.currentMeridian.copyVector(this.referenceMeridian).rotate(this.R);

                const length = Math.sqrt(quadVectorE3(axis));
                const geometry = this.geometry;
                const mask = (typeof geometry.getScalingForAxis === 'function') ? geometry.getScalingForAxis() : 0;
                const x = (mask & 1) ? length : this.getScaleX();
                const y = (mask & 2) ? length : this.getScaleY();
                const z = (mask & 4) ? length : this.getScaleZ();
                this.setScale(x, y, z);
                geometry.release();

                cascade = true;
            }
        };
        this.meridianChangeHandler = (eventName: string, key: string, value: number, meridian: Geometric3) => {
            if (cascade) {
                cascade = false;

                this.R.rotorFromFrameToFrame([this.referenceAxis, this.referenceMeridian, this.referenceAxis.cross(this.referenceMeridian)], [this.currentAxis, this.currentMeridian, this.currentAxis.clone().cross(this.currentMeridian)]);
                this.currentAxis.copyVector(this.referenceAxis).rotate(this.R);

                const length = Math.sqrt(quadVectorE3(meridian));
                const geometry = this.geometry;
                const mask = (typeof geometry.getScalingForAxis === 'function') ? geometry.getScalingForAxis() : 0;
                const x = (mask & 1) ? length : this.getScaleX();
                const y = (mask & 2) ? length : this.getScaleY();
                const z = (mask & 4) ? length : this.getScaleZ();
                this.setScale(x, y, z);
                geometry.release();
                cascade = true;
            }
        };
        this.attitudeChangeHandler = (eventName: string, key: string, value: number, attitude: Geometric3) => {
            if (cascade) {
                cascade = false;
                this.currentAxis.copyVector(this.referenceAxis).rotate(this.R);
                this.currentMeridian.copyVector(this.referenceMeridian).rotate(this.R);
                cascade = true;
            }
        };

        this.currentAxis.on('change', this.axisChangeHandler);
        this.currentMeridian.on('change', this.meridianChangeHandler);
        this.R.on('change', this.attitudeChangeHandler);

        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this.currentAxis.off('change', this.axisChangeHandler);
        this.currentMeridian.off('change', this.meridianChangeHandler);
        this.R.off('change', this.attitudeChangeHandler);
        super.destructor(levelUp + 1);
    }

    /**
     * Deprecated. Please use the axis property instead.
     */
    get h() {
        return this.currentAxis;
    }
    set h(axis: Geometric3) {
        this.currentAxis.copyVector(axis);
    }

    /**
     *
     */
    get axis() {
        return this.currentAxis;
    }
    set axis(axis: Geometric3) {
        this.currentAxis.copyVector(axis);
    }

    /**
     * Attitude (spinor). This is an alias for the R property.
     */
    get attitude(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.R;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
    set attitude(spinor: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.R.copySpinor(spinor);
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }

    /**
     *
     */
    get meridian() {
        return this.currentMeridian;
    }
    set meridian(meridian: Geometric3) {
        this.currentMeridian.copyVector(meridian);
    }

    /**
     * Attitude (spinor). This is an alias for the attitude property.
     */
    get R(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.R;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
    set R(spinor: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.R.copySpinor(spinor);
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }

    /**
     * Color
     */
    get color(): Color {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME);
        if (facet) {
            return facet.color;
        }
        else {
            throw new Error(notSupported(COLOR_FACET_NAME).message);
        }
    }
    set color(color: Color) {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME);
        if (facet) {
            facet.color.copy(color);
        }
        else {
            throw new Error(notSupported(COLOR_FACET_NAME).message);
        }
    }

    /**
     * Texture (image).
     */
    get texture(): Texture {
        const facet = <TextureFacet>this.getFacet(TEXTURE_FACET_NAME);
        if (facet) {
            const texture = facet.texture;
            facet.release();
            return texture;
        }
        else {
            throw new Error(notSupported(TEXTURE_FACET_NAME).message);
        }
    }
    set texture(value: Texture) {
        const facet = <TextureFacet>this.getFacet(TEXTURE_FACET_NAME);
        if (facet) {
            facet.texture = value;
            facet.release();
        }
        else {
            throw new Error(notSupported(TEXTURE_FACET_NAME).message);
        }
    }

    /**
     * Position (vector). This is an alias for the position property.
     */
    get X(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.X;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
    set X(vector: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.X.copyVector(vector);
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }

    /**
     * Position (vector). This is an alias for the X property.
     */
    get position(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.X;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
    set position(vector: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.X.copyVector(vector);
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }

    /**
     * Stress (tensor)
     */
    private get stress(): Matrix4 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.stress;
        }
        else {
            throw new Error(notSupported('stress').message);
        }
    }
    private set stress(stress: Matrix4) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.stress.copy(stress);
        }
        else {
            throw new Error(notSupported('stress').message);
        }
    }

    private getScale(i: number, j: number): number {
        if (this.Kidentity) {
            const sMatrix = this.stress;
            return sMatrix.getElement(i, j);
        }
        else {
            const sMatrix = this.stress;
            const cMatrix = this.canonicalScale;
            cMatrix.copy(this.Kinv).mul(sMatrix).mul(this.K);
            return cMatrix.getElement(i, j);
        }
    }

    protected getScaleX(): number {
        return this.getScale(0, 0);
    }

    protected getScaleY(): number {
        return this.getScale(1, 1);
    }

    protected getScaleZ(): number {
        return this.getScale(2, 2);
    }

    /**
     * Implementations of setPrincipalScale are expected to call this method.
     */
    protected setScale(x: number, y: number, z: number): void {
        if (this.Kidentity) {
            const sMatrix = this.stress;
            const oldX = sMatrix.getElement(0, 0);
            const oldY = sMatrix.getElement(1, 1);
            const oldZ = sMatrix.getElement(2, 2);
            if (x !== oldX) {
                sMatrix.setElement(0, 0, x);
            }
            if (y !== oldY) {
                sMatrix.setElement(1, 1, y);
            }
            if (z !== oldZ) {
                sMatrix.setElement(2, 2, z);
            }
        }
        else {
            const sMatrix = this.stress;
            const cMatrix = this.canonicalScale;
            cMatrix.copy(this.Kinv).mul(sMatrix).mul(this.K);
            const oldX = cMatrix.getElement(0, 0);
            const oldY = cMatrix.getElement(1, 1);
            const oldZ = cMatrix.getElement(2, 2);
            let matrixChanged = false;
            if (x !== oldX) {
                cMatrix.setElement(0, 0, x);
                matrixChanged = true;
            }
            if (y !== oldY) {
                cMatrix.setElement(1, 1, y);
                matrixChanged = true;
            }
            if (z !== oldZ) {
                cMatrix.setElement(2, 2, z);
                matrixChanged = true;
            }
            if (matrixChanged) {
                sMatrix.copy(this.K).mul(cMatrix).mul(this.Kinv);
            }
        }
    }
}

export default Mesh;
