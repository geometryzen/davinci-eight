import { __extends } from "tslib";
import { BeginMode } from '../core/BeginMode';
import { Color } from '../core/Color';
import { GeometryArrays } from '../core/GeometryArrays';
import { GraphicsProgramSymbols as GPS } from '../core/GraphicsProgramSymbols';
import { Mesh } from '../core/Mesh';
import { SimplexMode } from '../geometries/SimplexMode';
import { Geometric3 } from '../math/Geometric3';
import { vec } from '../math/R3';
import { ds } from './Defaults';
import { materialFromOptions } from './materialFromOptions';
import { offsetFromOptions } from './offsetFromOptions';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { simplexModeFromOptions } from './simplexModeFromOptions';
import { tiltFromOptions } from './tiltFromOptions';
/**
 * @hidden
 */
var NOSE = [0, +1, 0];
/**
 * @hidden
 */
var LLEG = [-1, -1, 0];
/**
 * @hidden
 */
var RLEG = [+1, -1, 0];
/**
 * @hidden
 */
var TAIL = [0, -1, 0];
/**
 * @hidden
 */
var CENTER = [0, 0, 0];
/**
 * @hidden
 */
var LEFT = [-0.5, 0, 0];
/**
 * @hidden
 */
var canonicalAxis = vec(0, 0, 1);
/**
 * @hidden
 */
function concat(a, b) { return a.concat(b); }
/**
 * Transform a list of points by applying a tilt rotation and an offset translation.
 * @hidden
 */
function transform(xs, options) {
    if (options.tilt || options.offset) {
        var points = xs.map(function (coords) { return Geometric3.vector(coords[0], coords[1], coords[2]); });
        if (options.tilt) {
            points.forEach(function (point) {
                point.rotate(options.tilt);
            });
        }
        if (options.offset) {
            points.forEach(function (point) {
                point.addVector(options.offset);
            });
        }
        return points.map(function (point) { return [point.x, point.y, point.z]; });
    }
    else {
        return xs;
    }
}
/**
 * Creates the Turtle Primitive.
 * All points lie in the the plane z = 0.
 * The height and width of the triangle are centered on the origin (0, 0).
 * The height and width range from -1 to +1.
 * @hidden
 */
function primitive(options) {
    // The following points define lines by being taken in pairs.
    var values = transform([CENTER, LEFT, CENTER, TAIL, NOSE, LLEG, NOSE, RLEG, LLEG, RLEG], options).reduce(concat);
    var result = {
        mode: BeginMode.LINES,
        attributes: {}
    };
    result.attributes[GPS.ATTRIBUTE_POSITION] = { values: values, size: 3 };
    return result;
}
/**
 * The geometry of the Bug is static so we use the conventional
 * approach based upon GeometryArrays
 * @hidden
 */
var TurtleGeometry = /** @class */ (function (_super) {
    __extends(TurtleGeometry, _super);
    /**
     *
     */
    function TurtleGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'TurtleGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, primitive(options), options) || this;
        _this.setLoggingName('TurtleGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    TurtleGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('TurtleGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    TurtleGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return TurtleGeometry;
}(GeometryArrays));
/**
 * A 3D visual representation of a turtle.
 */
var Turtle = /** @class */ (function (_super) {
    __extends(Turtle, _super);
    /**
     * @param contextManager This will usually be provided by the `Engine`.
     * @param options
     * @param levelUp Leave as zero unless you are extending this class.
     */
    function Turtle(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: ds.axis, meridian: ds.meridian }, levelUp + 1) || this;
        _this.setLoggingName('Turtle');
        var geoOptions = { kind: 'TurtleGeometry' };
        geoOptions.tilt = tiltFromOptions(options, canonicalAxis);
        geoOptions.offset = offsetFromOptions(options);
        var geometry = new TurtleGeometry(contextManager, geoOptions);
        _this.geometry = geometry;
        geometry.release();
        var material = materialFromOptions(contextManager, simplexModeFromOptions(options, SimplexMode.LINE), options);
        _this.material = material;
        material.release();
        _this.height = 0.1;
        _this.width = 0.0618;
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     * @hidden
     */
    Turtle.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Turtle.prototype, "width", {
        get: function () {
            return this.getScaleX();
        },
        set: function (width) {
            var y = this.getScaleY();
            var z = this.getScaleZ();
            this.setScale(width, y, z);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Turtle.prototype, "height", {
        /**
         *
         */
        get: function () {
            return this.getScaleY();
        },
        set: function (height) {
            var x = this.getScaleX();
            var z = this.getScaleZ();
            this.setScale(x, height, z);
        },
        enumerable: false,
        configurable: true
    });
    return Turtle;
}(Mesh));
export { Turtle };
