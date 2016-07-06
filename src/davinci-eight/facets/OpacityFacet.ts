import {Facet} from '../core/Facet';
import {FacetVisitor} from '../core/FacetVisitor';
import mustBeArray from '../checks/mustBeArray';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeString from '../checks/mustBeString';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

const LOGGING_NAME = 'OpacityFacet'

function contextBuilder() {
    return LOGGING_NAME
}

/**
 *
 */
export class OpacityFacet implements Facet {

    /**
     *
     */
    public opacity: number;

    /**
     *
     */
    constructor(opacity = 1) {
        this.opacity = mustBeInteger('opacity', opacity)
    }

    getProperty(name: string): number[] {
        return void 0;
    }

    setProperty(name: string, value: number[]): OpacityFacet {
        mustBeString('name', name, contextBuilder);
        mustBeArray('value', value, contextBuilder);
        return this;
    }

    setUniforms(visitor: FacetVisitor): void {
        visitor.uniform1f(GraphicsProgramSymbols.UNIFORM_OPACITY, this.opacity);
    }
}
