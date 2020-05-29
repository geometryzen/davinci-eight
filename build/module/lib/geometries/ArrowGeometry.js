import { __extends } from "tslib";
import { arrowPrimitive } from './arrowPrimitive';
import { GeometryElements } from '../core/GeometryElements';
/**
 * <p>
 * A convenience class for creating an arrow.
 * </p>
 * <p>
 * The initial axis unit vector defaults to <b>e<b><sub>2</sub>
 * </p>
 * <p>
 * The cutLine unit vector defaults to <b>e<b><sub>3</sub>
 * </p>
 */
var ArrowGeometry = /** @class */ (function (_super) {
    __extends(ArrowGeometry, _super);
    /**
     *
     */
    function ArrowGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'ArrowGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, arrowPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('ArrowGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    ArrowGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('ArrowGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    ArrowGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return ArrowGeometry;
}(GeometryElements));
export { ArrowGeometry };
