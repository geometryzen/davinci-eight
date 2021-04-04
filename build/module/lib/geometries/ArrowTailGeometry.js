import { __extends } from "tslib";
import { GeometryElements } from '../core/GeometryElements';
import { arrowTailPrimitive } from './arrowPrimitive';
/**
 * @hidden
 */
var ArrowTailGeometry = /** @class */ (function (_super) {
    __extends(ArrowTailGeometry, _super);
    /**
     *
     */
    function ArrowTailGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, arrowTailPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('ArrowTailGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    ArrowTailGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('ArrowTailGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    ArrowTailGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return ArrowTailGeometry;
}(GeometryElements));
export { ArrowTailGeometry };
