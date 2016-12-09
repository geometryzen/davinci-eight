import { Color } from './Color';
import { ColorFacet } from '../facets/ColorFacet';
import ContextManager from './ContextManager';
import { Drawable } from './Drawable';
import { Geometric3 } from '../math/Geometric3';
import { Geometry } from './Geometry';
import { Material } from './Material';
import AbstractMesh from '../core/AbstractMesh';
import Matrix4 from '../math/Matrix4';
import { ModelFacet } from '../facets/ModelFacet';
import notSupported from '../i18n/notSupported';
import Texture from './Texture';
import TextureFacet from '../facets/TextureFacet';

const COLOR_FACET_NAME = 'color';
const TEXTURE_FACET_NAME = 'image';
const MODEL_FACET_NAME = 'model';

/**
 * The standard pairing of a Geometry and a Material.
 */
export class Mesh<G extends Geometry, M extends Material> extends Drawable<G, M> implements AbstractMesh<G, M> {
    /**
     * Initializes this Mesh with a ColorFacet ('color'), a TextureFacet ('image'), and a ModelFacet ('model').
     * 
     * @param geometry An optional Geometry, which may be supplied later.
     * @param material An optional Material, which may be supplied later.
     * @param contextManager
     * @param levelUp The zero-based level of this instance in an inheritance hierarchy. 
     */
    constructor(geometry: G, material: M, contextManager: ContextManager, levelUp = 0) {
        super(geometry, material, contextManager, levelUp + 1);
        this.setLoggingName('Mesh');

        this.setFacet(COLOR_FACET_NAME, new ColorFacet());

        const textureFacet = new TextureFacet();
        this.setFacet(TEXTURE_FACET_NAME, textureFacet);
        textureFacet.release();

        this.setFacet(MODEL_FACET_NAME, new ModelFacet());
        if (levelUp === 0) {
            this.synchUp();
        }
    }

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
    get stress(): Matrix4 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            return facet.stress;
        }
        else {
            throw new Error(notSupported('stress').message);
        }
    }
    set stress(stress: Matrix4) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        if (facet) {
            facet.stress.copy(stress);
        }
        else {
            throw new Error(notSupported('stress').message);
        }
    }
}

export default Mesh;
