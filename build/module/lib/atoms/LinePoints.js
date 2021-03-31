import { __extends } from "tslib";
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeLT } from '../checks/mustBeLT';
import { BeginMode } from '../core/BeginMode';
import { CurvePrimitive } from './CurvePrimitive';
import { elementsForCurve } from './elementsForCurve';
/**
 * @hidden
 */
var LinePoints = /** @class */ (function (_super) {
    __extends(LinePoints, _super);
    /**
     * @param uSegments
     */
    function LinePoints(uSegments) {
        var _this = _super.call(this, BeginMode.POINTS, uSegments, false) || this;
        _this.elements = elementsForCurve(uSegments, false);
        return _this;
    }
    /**
     *
     * @param uIndex An integer. 0 <= uIndex < uLength
     */
    LinePoints.prototype.vertex = function (uIndex) {
        mustBeInteger('uIndex', uIndex);
        mustBeGE('uIndex', uIndex, 0);
        mustBeLT('uIndex', uIndex, this.uLength);
        return this.vertices[uIndex];
    };
    return LinePoints;
}(CurvePrimitive));
export { LinePoints };
