import Color from '../core/Color';
import ColorRGB from '../core/ColorRGB';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import Shareable from '../utils/Shareable';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

const LOGGING_NAME = 'AmbientLight'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 * @class AmbientLight
 * @extends Shareable
 */
export default class AmbientLight extends Shareable implements Facet {
    /**
     * @property color
     * @type {Color}
     */
    public color: Color;
    /**
     * Constructs a white light in the -e3 direction.
     * @class AmbientLight
     * @constructor
     */
    constructor(color: ColorRGB) {
        super('AmbientLight')
        mustBeObject('color', color)
        // FIXME: Need some kind of locking for constants
        this.color = Color.white.clone()
        this.color.r = mustBeNumber('color.r', color.r)
        this.color.g = mustBeNumber('color.g', color.g)
        this.color.b = mustBeNumber('color.b', color.b)
    }
    /**
     * @method destructor
     * @type {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }
    getProperty(name: string): number[] {
        return void 0;
    }

    /**
     * @method setProperty
     * @param name {string}
     * @param value {number[]}
     * @return {AmbientLight}
     * @chainable
     */
    setProperty(name: string, value: number[]): AmbientLight {
        mustBeString('name', name, contextBuilder);
        mustBeArray('value', value, contextBuilder);
        return this;
    }

    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @param [canvasId] {number}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor, canvasId?: number): void {
        var coords = [this.color.r, this.color.g, this.color.b]
        visitor.vector3(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, coords, canvasId)
    }
}
