import { mustBeGE } from '../checks/mustBeGE';
import { mustBeLE } from '../checks/mustBeLE';
import { mustBeNumber } from '../checks/mustBeNumber';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
/**
 * @hidden
 */
var OpacityFacet = /** @class */ (function () {
    /**
     *
     */
    function OpacityFacet(opacity) {
        if (opacity === void 0) { opacity = 1; }
        mustBeNumber('opacity', opacity);
        mustBeGE('opacity', opacity, 0);
        mustBeLE('opacity', opacity, 1);
        this.opacity = opacity;
    }
    /**
     *
     */
    OpacityFacet.prototype.setUniforms = function (visitor) {
        visitor.uniform1f(GraphicsProgramSymbols.UNIFORM_OPACITY, this.opacity);
    };
    return OpacityFacet;
}());
export { OpacityFacet };
