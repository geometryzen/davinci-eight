import { AbstractMesh } from '../core/AbstractMesh';
import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';
import { ColorFacet } from '../facets/ColorFacet';
import { ModelFacet } from '../facets/ModelFacet';
import { TextureFacet } from '../facets/TextureFacet';
import { notSupported } from '../i18n/notSupported';
import { Geometric3 } from '../math/Geometric3';
import { Matrix4 } from '../math/Matrix4';
import { quadVectorE3 } from '../math/quadVectorE3';
import { R3, vectorCopy } from '../math/R3';
import { Spinor3 } from '../math/Spinor3';
import { VectorE3 } from '../math/VectorE3';
import { Color } from './Color';
import { ContextManager } from './ContextManager';
import { Drawable } from './Drawable';
import { Geometry } from './Geometry';
import { Material } from './Material';
import { MeshOptions } from './MeshOptions';
import { referenceAxis } from './referenceAxis';
import { referenceMeridian } from './referenceMeridian';
import { Texture } from './Texture';

/**
 * @hidden
 */
const COLOR_FACET_NAME = 'color';
/**
 * @hidden
 */
const TEXTURE_FACET_NAME = 'image';
/**
 * @hidden
 */
const MODEL_FACET_NAME = 'model';

/**
 * The standard pairing of a Geometry and a Material.
 * @hidden
 */
export class Mesh<G extends Geometry, M extends Material> extends Drawable<G, M> implements AbstractMesh<G, M> {
    /**
     * The reference frame axis.
     */
    public readonly referenceAxis: Readonly<R3>;
    /**
     * The reference frame meridian.
     */
    public readonly referenceMeridian: Readonly<R3>;
    /**
     * Scratch variable for intermediate calculation value.
     * This can probably be raised to a module level constant.
     */
    private readonly canonicalScale = Matrix4.one.clone();
    /**
     * The rotation matrix equivalent to the initial tilt spinor.
     */
    private readonly K: Matrix4;
    /**
     * The (cached) inverse of K.
     */
    private readonly Kinv: Matrix4;

    /**
     * Cached value that tells you whether the K matrix is unity.
     */
    private readonly Kidentity: boolean;
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

        this.referenceAxis = referenceAxis(options, canonicalAxis).direction();
        this.referenceMeridian = referenceMeridian(options, canonicalMeridian).rejectionFrom(this.referenceAxis).direction();

        const tilt = Geometric3.rotorFromFrameToFrame([canonicalAxis, canonicalMeridian, canonicalAxis.cross(canonicalMeridian)], [this.referenceAxis, this.referenceMeridian, this.referenceAxis.cross(this.referenceMeridian)]);
        if (tilt && !Spinor3.isOne(tilt)) {
            this.Kidentity = false;
            this.K = Matrix4.one.clone();
            this.K.rotation(tilt);
            this.Kinv = Matrix4.one.clone();
            this.Kinv.copy(this.K).inv();
        }
        else {
            this.Kidentity = true;
        }

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
        super.destructor(levelUp + 1);
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

    /**
     * Implementation of the axis (get) property.
     * Derived classes may overide to perform scaling.
     */
    protected getAxis(): Readonly<R3> {
        return this.referenceAxis.rotate(this.attitude);
    }

    /**
     * Implementation of the axis (set) property.
     * Derived classes may overide to perform scaling.
     */
    protected setAxis(axis: VectorE3): void {
        const squaredNorm = quadVectorE3(axis);
        if (squaredNorm > 0) {
            this.attitude.rotorFromDirections(this.referenceAxis, axis);
        }
        else {
            // The axis direction is undefined.
            this.attitude.one();
        }
    }

    /**
     * The current axis (unit vector) of the mesh.
     */
    public get axis(): VectorE3 {
        return this.getAxis();
    }
    public set axis(axis: VectorE3) {
        this.setAxis(axis);
    }

    protected getMeridian(): Readonly<R3> {
        return this.referenceMeridian.rotate(this.attitude);
    }

    /**
     * The current meridian (unit vector) of the mesh.
     */
    get meridian(): VectorE3 {
        return this.getMeridian();
    }
    set meridian(value: VectorE3) {
        const meridian = vectorCopy(value).rejectionFrom(this.axis).direction();
        const B = Geometric3.dualOfVector(this.axis);
        const R = Geometric3.rotorFromVectorToVector(this.meridian, meridian, B);
        this.attitude.mul2(R, this.attitude);
    }

    /**
     * The name of the uniform mat4 variable in the vertex shader that receives the model matrix value.
     * The default name is `uModel`.
     */
    get modelMatrixUniformName(): string {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.modelMatrixUniformName;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
    set modelMatrixUniformName(name: string) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.modelMatrixUniformName = name;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }

    /**
     * The name of the uniform mat3 variable in the vertex shader that receives the normal matrix value.
     * The default name is `uNormal`.
     */
    get normalMatrixUniformName(): string {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.normalMatrixUniformName;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
    set normalMatrixUniformName(name: string) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.normalMatrixUniformName = name;
        }
        else {
            throw new Error(notSupported(MODEL_FACET_NAME).message);
        }
    }
}
