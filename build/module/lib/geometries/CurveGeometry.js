import { __extends } from "tslib";
import { GeometryElements } from '../core/GeometryElements';
import { curvePrimitive } from './curvePrimitive';
/**
 * A Geometry for representing functions of one scalar parameter.
 * @hidden
 */
var CurveGeometry = /** @class */ (function (_super) {
    __extends(CurveGeometry, _super);
    function CurveGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'CurveGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, curvePrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('CurveGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    CurveGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('CurveGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    CurveGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return CurveGeometry;
}(GeometryElements));
export { CurveGeometry };
