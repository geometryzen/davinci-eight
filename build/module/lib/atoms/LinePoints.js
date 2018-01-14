import * as tslib_1 from "tslib";
import { CurvePrimitive } from './CurvePrimitive';
import { BeginMode } from '../core/BeginMode';
import { elementsForCurve } from './elementsForCurve';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeLT } from '../checks/mustBeLT';
/**
 *
 */
var LinePoints = /** @class */ (function (_super) {
    tslib_1.__extends(LinePoints, _super);
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
