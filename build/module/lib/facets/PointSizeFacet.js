import { mustBeInteger } from '../checks/mustBeInteger';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
/**
 *
 */
var PointSizeFacet = (function () {
    /**
     *
     */
    function PointSizeFacet(pointSize) {
        if (pointSize === void 0) { pointSize = 2; }
        this.pointSize = mustBeInteger('pointSize', pointSize);
    }
    /**
     *
     */
    PointSizeFacet.prototype.setUniforms = function (visitor) {
        visitor.uniform1f(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, this.pointSize);
    };
    return PointSizeFacet;
}());
export { PointSizeFacet };
