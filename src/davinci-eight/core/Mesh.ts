import Color from './Color';
import ColorFacet from '../facets/ColorFacet';
import Drawable from './Drawable'
import Geometry from './Geometry';
import Material from './Material';
import Matrix4 from '../math/Matrix4'
import ModelFacet from '../facets/ModelFacet';
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
     * @type Spinor3
     * @readOnly
     */
    get attitude(): Spinor3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            return facet.R
        }
        else {
            return void 0
        }
    }
    set attitude(unused) {
        throw new Error(readOnly('attitude').message)
    }

    /**
     * Color
     *
     * @property color
     * @type Color
     */
    get color() {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
        if (facet) {
            return facet.color
        }
        else {
            return void 0
        }
    }
    set color(color: Color) {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME)
        if (facet) {
            facet.color.copy(color)
        }
        else {
            // We should probably add a facet and set the color.
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
     * @type Vector3
     * @readOnly
     */
    get position(): Vector3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            return facet.X
        }
        else {
            return void 0
        }
    }
    set position(unused) {
        throw new Error(readOnly('position').message)
    }

    /**
     * Scale (vector)
     *
     * @property scale
     * @type Vector3
     * @readOnly
     */
    get scale(): Vector3 {
        const facet = <ModelFacet>this.getFacet(MODEL_FACET_NAME)
        if (facet) {
            return facet.scale
        }
        else {
            return void 0
        }
    }
    set scale(unused) {
        throw new Error(readOnly('scale').message)
    }
}
