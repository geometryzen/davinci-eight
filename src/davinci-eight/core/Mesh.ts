import Color from './Color';
import ColorFacet from '../facets/ColorFacet';
import Drawable from './Drawable'
import Geometric3 from '../math/Geometric3'
import Geometry from './Geometry';
import Material from './Material';
import Matrix4 from '../math/Matrix4'
import ModelFacet from '../facets/ModelFacet';
import notSupported from '../i18n/notSupported'
import readOnly from '../i18n/readOnly';
import Spinor3 from '../math/Spinor3'
import Vector3 from '../math/Vector3'

const COLOR_FACET_NAME = 'color'
const MODEL_FACET_NAME = 'model'

/**
 * @module EIGHT
 * @submodule core
 */

// Mesh is designed to be equivalent to the Three.js Mesh in the sense that it assumes
// particlular facets that give the Drawable position, attitude, and color.
// The position and attitude are dimensionless, mutable, and readOnly quantities for performance.

/**
 * @class Mesh
 * @extends Drawable
 */
export default class Mesh extends Drawable {

    /**
     * @class Mesh
     * @constructor
     * @param geometry {Geometry}
     * @param material {Material}
     * @param [type = 'Mesh'] {string}
     */
    constructor(geometry: Geometry, material: Material, type = 'Mesh') {
        super(geometry, material, type)

        const modelFacet = new ModelFacet()
        this.setFacet(MODEL_FACET_NAME, modelFacet)

        const colorFacet = new ColorFacet()
        this.setFacet(COLOR_FACET_NAME, colorFacet)
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }

    /**
     * Attitude (spinor)
     *
     * @property attitude
     * @type Geometric3
     */
    get attitude(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            return facet.attitude
        }
        else {
            throw new Error(notSupported('attitude').message)
        }
    }
    set attitude(attitude: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            facet.attitude.copySpinor(attitude)
        }
        else {
            throw new Error(notSupported('attitude').message)
        }
    }

    /**
     * Color
     *
     * @property color
     * @type Color
     */
    get color(): Color {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
        if (facet) {
            return facet.color
        }
        else {
            throw new Error(notSupported('color').message)
        }
    }
    set color(color: Color) {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
        if (facet) {
            facet.color.copy(color)
        }
        else {
            throw new Error(notSupported('color').message)
        }
    }

    /**
     * The spinor that rotates the object from the frame
     * in which scaling is defined to the initial frame of the
     * object.
     *
     * @property deviation
     * @type Spinor3
     */
    get deviation(): Spinor3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            return facet.deviation
        }
        else {
            throw new Error(notSupported('deviation').message)
        }
    }
    set deviation(deviation: Spinor3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            facet.deviation.copy(deviation)
        }
        else {
            throw new Error(notSupported('deviation').message)
        }
    }

    /**
     * @property matrix
     * @type Matrix4
     * @readOnly
     */
    get matrix(): Matrix4 {
        return (<ModelFacet>this.getFacet(MODEL_FACET_NAME)).matrix
    }
    set matrix(unused: Matrix4) {
        throw new Error(readOnly('matrix').message)
    }

    /**
     * Position (vector)
     *
     * @property position
     * @type Geometric3
     */
    get position(): Geometric3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            return facet.position
        }
        else {
            throw new Error(notSupported('position').message)
        }
    }
    set position(position: Geometric3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            facet.position.copyVector(position)
        }
        else {
            throw new Error(notSupported('position').message)
        }
    }

    /**
     * Scale (vector)
     *
     * @property scale
     * @type Vector3
     */
    get scale(): Vector3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            return facet.scale
        }
        else {
            throw new Error(notSupported('scale').message)
        }
    }
    set scale(scale: Vector3) {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            facet.scale.copy(scale)
        }
        else {
            throw new Error(notSupported('scale').message)
        }
    }
}
