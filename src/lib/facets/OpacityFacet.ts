import { mustBeGE } from "../checks/mustBeGE";
import { mustBeLE } from "../checks/mustBeLE";
import { mustBeNumber } from "../checks/mustBeNumber";
import { Facet } from "../core/Facet";
import { FacetVisitor } from "../core/FacetVisitor";
import { GraphicsProgramSymbols } from "../core/GraphicsProgramSymbols";

/**
 * @hidden
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
        mustBeNumber("opacity", opacity);
        mustBeGE("opacity", opacity, 0);
        mustBeLE("opacity", opacity, 1);
        this.opacity = opacity;
    }

    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void {
        visitor.uniform1f(GraphicsProgramSymbols.UNIFORM_OPACITY, this.opacity);
    }
}
