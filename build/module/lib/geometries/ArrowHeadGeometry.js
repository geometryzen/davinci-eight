import { __extends } from "tslib";
import { GeometryElements } from '../core/GeometryElements';
import { arrowHeadPrimitive } from './arrowPrimitive';
/**
 * @hidden
 */
var ArrowHeadGeometry = /** @class */ (function (_super) {
    __extends(ArrowHeadGeometry, _super);
    /**
     *
     */
    function ArrowHeadGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, arrowHeadPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('ArrowHeadGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    ArrowHeadGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('ArrowHeadGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    ArrowHeadGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return ArrowHeadGeometry;
}(GeometryElements));
export { ArrowHeadGeometry };
