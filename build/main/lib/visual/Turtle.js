"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BeginMode_1 = require("../core/BeginMode");
var Color_1 = require("../core/Color");
var Defaults_1 = require("./Defaults");
var Geometric3_1 = require("../math/Geometric3");
var GeometryArrays_1 = require("../core/GeometryArrays");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var materialFromOptions_1 = require("./materialFromOptions");
var Mesh_1 = require("../core/Mesh");
var offsetFromOptions_1 = require("./offsetFromOptions");
var setAxisAndMeridian_1 = require("./setAxisAndMeridian");
var setColorOption_1 = require("./setColorOption");
var SimplexMode_1 = require("../geometries/SimplexMode");
var simplexModeFromOptions_1 = require("./simplexModeFromOptions");
var tiltFromOptions_1 = require("./tiltFromOptions");
var R3_1 = require("../math/R3");
var NOSE = [0, +1, 0];
var LLEG = [-1, -1, 0];
var RLEG = [+1, -1, 0];
var TAIL = [0, -1, 0];
var CENTER = [0, 0, 0];
var LEFT = [-0.5, 0, 0];
var canonicalAxis = R3_1.vec(0, 0, 1);
function concat(a, b) { return a.concat(b); }
/**
 * Transform a list of points by applying a tilt rotation and an offset translation.
 */
function transform(xs, options) {
    if (options.tilt || options.offset) {
        var points = xs.map(function (coords) { return Geometric3_1.Geometric3.vector(coords[0], coords[1], coords[2]); });
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
 */
function primitive(options) {
    var values = transform([CENTER, LEFT, CENTER, TAIL, NOSE, LLEG, NOSE, RLEG, LLEG, RLEG], options).reduce(concat);
    var result = {
        mode: BeginMode_1.BeginMode.LINES,
        attributes: {}
    };
    result.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = { values: values, size: 3 };
    return result;
}
/**
 * The geometry of the Bug is static so we use the conventional
 * approach based upon GeometryArrays
 */
var TurtleGeometry = (function (_super) {
    tslib_1.__extends(TurtleGeometry, _super);
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
}(GeometryArrays_1.GeometryArrays));
/**
 * A 3D visual representation of a turtle.
 */
var Turtle = (function (_super) {
    tslib_1.__extends(Turtle, _super);
    function Turtle(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: Defaults_1.ds.axis, meridian: Defaults_1.ds.meridian }, levelUp + 1) || this;
        _this.setLoggingName('Turtle');
        var geoOptions = { kind: 'TurtleGeometry' };
        geoOptions.tilt = tiltFromOptions_1.tiltFromOptions(options, canonicalAxis);
        geoOptions.offset = offsetFromOptions_1.offsetFromOptions(options);
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof TurtleGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new TurtleGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions_1.materialFromOptions(contextManager, simplexModeFromOptions_1.simplexModeFromOptions(options, SimplexMode_1.SimplexMode.LINE), options);
        _this.material = material;
        material.release();
        _this.height = 0.1;
        _this.width = 0.0618;
        setAxisAndMeridian_1.setAxisAndMeridian(_this, options);
        setColorOption_1.setColorOption(_this, options, Color_1.Color.gray);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
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
        enumerable: true,
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
        enumerable: true,
        configurable: true
    });
    return Turtle;
}(Mesh_1.Mesh));
exports.Turtle = Turtle;
