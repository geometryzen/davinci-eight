import * as tslib_1 from "tslib";
import { CurvePrimitive } from './CurvePrimitive';
import { BeginMode } from '../core/BeginMode';
import { elementsForCurve } from './elementsForCurve';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeLT } from '../checks/mustBeLT';
var LineStrip = (function (_super) {
    tslib_1.__extends(LineStrip, _super);
    /**
     * @param uSegments
     */
    function LineStrip(uSegments) {
        var _this = _super.call(this, BeginMode.LINE_STRIP, uSegments, false) || this;
        // We are rendering a LINE_STRIP so the figure will not be closed.
        _this.elements = elementsForCurve(uSegments, false);
        return _this;
    }
    /**
     *
     * @param uIndex An integer. 0 <= uIndex < uLength
     */
    LineStrip.prototype.vertex = function (uIndex) {
        mustBeInteger('uIndex', uIndex);
        mustBeGE('uIndex', uIndex, 0);
        mustBeLT('uIndex', uIndex, this.uLength);
        return this.vertices[uIndex];
    };
    return LineStrip;
}(CurvePrimitive));
export { LineStrip };
