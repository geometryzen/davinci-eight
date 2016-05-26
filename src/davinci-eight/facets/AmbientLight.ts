import {Color} from '../core/Color';
import AbstractColor from '../core/AbstractColor';
import {Facet} from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

const LOGGING_NAME = 'AmbientLight'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 *
 */
export class AmbientLight implements Facet {
    /**
     *
     */
    public color: Color;

    /**
     *
     */
    constructor(color: AbstractColor) {
        mustBeObject('color', color)
        // FIXME: Need some kind of locking for constants
        this.color = Color.white.clone()
        this.color.r = mustBeNumber('color.r', color.r)
        this.color.g = mustBeNumber('color.g', color.g)
        this.color.b = mustBeNumber('color.b', color.b)
    }

    getProperty(name: string): number[] {
        return void 0;
    }

    /**
     * @param name
     * @param value
     * @returns
     */
    setProperty(name: string, value: number[]): AmbientLight {
        mustBeString('name', name, contextBuilder)
        mustBeArray('value', value, contextBuilder)
        return this
    }

    /**
     * @param visitor
     * @returns
     */
    setUniforms(visitor: FacetVisitor): void {
        const color = this.color
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, color.r, color.g, color.b)
    }
}
