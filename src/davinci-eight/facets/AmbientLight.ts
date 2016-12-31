import Color from '../core/Color';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

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
    constructor(color: { r: number; g: number; b: number }) {
        mustBeObject('color', color);
        // FIXME: Need some kind of locking for constants
        this.color = Color.white.clone();
        this.color.r = mustBeNumber('color.r', color.r);
        this.color.g = mustBeNumber('color.g', color.g);
        this.color.b = mustBeNumber('color.b', color.b);
    }

    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void {
        const color = this.color;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, color.r, color.g, color.b);
    }
}
