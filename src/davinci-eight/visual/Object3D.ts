import Color from '../core/Color';
import ColorFacet from '../facets/ColorFacet';
import Geometry from '../core/Geometry';
import Material from '../core/Material';
import Mesh from '../core/Mesh'
import ModelFacet from '../facets/ModelFacet';
import readOnly from '../i18n/readOnly';
import Mat4R from '../math/Mat4R'

const COLOR_FACET_NAME = 'color'
const MODEL_FACET_NAME = 'model'

export default class Object3D extends Mesh {
    constructor(geometry: Geometry, material: Material, type = 'Object3D') {
        super(geometry, material, type)

        const modelFacet = new ModelFacet()
        this.setFacet(MODEL_FACET_NAME, modelFacet)

        const colorFacet = new ColorFacet()
        this.setFacet(COLOR_FACET_NAME, colorFacet)
    }

    public get modelFacet(): ModelFacet {
        return <ModelFacet>this.getFacet(MODEL_FACET_NAME)
    }
    public set modelFacet(unused: ModelFacet) {
        throw new Error(readOnly('modelFacet').message)
    }

    public get colorFacet(): ColorFacet {
        return <ColorFacet>this.getFacet(COLOR_FACET_NAME)
    }
    public set colorFacet(unused: ColorFacet) {
        throw new Error(readOnly('colorFacet').message)
    }

    get modelMatrix(): Mat4R {
        return this.modelFacet.matrix
    }
    set modelMatrix(unused: Mat4R) {
        throw new Error(readOnly('modelMatrix').message)
    }

    /**
     * Color
     *
     * @property color
     * @type Color
     */
    get color() {
        const facet = this.colorFacet
        if (facet) {
            return facet.color
        }
        else {
            return void 0
        }
    }
    set color(color: Color) {
        const facet = this.colorFacet
        if (facet) {
            facet.color.copy(color)
        }
        else {
            // We should probably add a facet and set the color.
        }
    }
}
