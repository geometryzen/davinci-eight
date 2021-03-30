import { __extends } from "tslib";
import { reduce } from '../atoms/reduce';
import { GeometryElements } from '../core/GeometryElements';
import { Vector3 } from '../math/Vector3';
import { CylindricalShellBuilder } from '../shapes/CylindricalShellBuilder';
import { RingBuilder } from '../shapes/RingBuilder';
/**
 * @hidden
 */
var e2 = Vector3.vector(0, 1, 0);
/**
 * @hidden
 */
var e3 = Vector3.vector(0, 0, 1);
/**
 * Generates a Primitive from the specified options.
 * @hidden
 */
function hollowCylinderPrimitive(options) {
    if (options === void 0) { options = { kind: 'HollowCylinderGeometry' }; }
    var axis = (typeof options.axis === 'object') ? Vector3.copy(options.axis) : e2;
    var meridian = (typeof options.meridian === 'object') ? Vector3.copy(options.meridian).normalize() : e3;
    var outerRadius = (typeof options.outerRadius === 'number') ? options.outerRadius : 1.0;
    var innerRadius = (typeof options.innerRadius === 'number') ? options.innerRadius : 0.5;
    var sliceAngle = (typeof options.sliceAngle === 'number') ? options.sliceAngle : 2 * Math.PI;
    // Multiple builders each provide a Primitive.
    // A Primitive will typically correspond to one index buffer and several attribute buffers.
    // The Primitives are merged into a single Primitive for efficiency.
    var walls = new CylindricalShellBuilder();
    walls.height.copy(axis);
    walls.cutLine.copy(meridian).normalize().scale(outerRadius);
    walls.clockwise = true;
    walls.sliceAngle = sliceAngle;
    walls.offset.copy(axis).scale(-0.5);
    var outerWalls = walls.toPrimitive();
    walls.cutLine.normalize().scale(innerRadius);
    walls.convex = false;
    var innerWalls = walls.toPrimitive();
    var ring = new RingBuilder();
    ring.e.copy(axis).normalize();
    ring.cutLine.copy(meridian);
    ring.clockwise = true;
    ring.innerRadius = innerRadius;
    ring.outerRadius = outerRadius;
    ring.sliceAngle = sliceAngle;
    ring.offset.copy(axis).scale(0.5);
    var cap = ring.toPrimitive();
    ring.e.scale(-1);
    ring.clockwise = false;
    ring.offset.copy(axis).scale(-0.5);
    var base = ring.toPrimitive();
    return reduce([outerWalls, innerWalls, cap, base]);
}
/**
 *
 */
var HollowCylinderGeometry = /** @class */ (function (_super) {
    __extends(HollowCylinderGeometry, _super);
    /**
     *
     */
    function HollowCylinderGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'HollowCylinderGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, hollowCylinderPrimitive(options), {}, levelUp + 1) || this;
        _this.setLoggingName('HollowCylinderGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    HollowCylinderGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('HollowCylinderGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    HollowCylinderGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return HollowCylinderGeometry;
}(GeometryElements));
export { HollowCylinderGeometry };
