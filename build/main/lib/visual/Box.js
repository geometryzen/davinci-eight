"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
var tslib_1 = require("tslib");
var BoxGeometry_1 = require("../geometries/BoxGeometry");
var Color_1 = require("../core/Color");
var Defaults_1 = require("./Defaults");
var isDefined_1 = require("../checks/isDefined");
var geometryModeFromOptions_1 = require("./geometryModeFromOptions");
var materialFromOptions_1 = require("./materialFromOptions");
var Mesh_1 = require("../core/Mesh");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var referenceAxis_1 = require("../core/referenceAxis");
var referenceMeridian_1 = require("../core/referenceMeridian");
var setAxisAndMeridian_1 = require("./setAxisAndMeridian");
var setColorOption_1 = require("./setColorOption");
var setDeprecatedOptions_1 = require("./setDeprecatedOptions");
var SimplexMode_1 = require("../geometries/SimplexMode");
var simplexModeFromOptions_1 = require("./simplexModeFromOptions");
var spinorE3Object_1 = require("./spinorE3Object");
var vectorE3Object_1 = require("./vectorE3Object");
/**
 * A 3D visual representation of a box.
 */
var Box = /** @class */ (function (_super) {
    tslib_1.__extends(Box, _super);
    /**
     *
     */
    function Box(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction(), meridian: referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('Box');
        var geoOptions = { kind: 'BoxGeometry' };
        geoOptions.mode = geometryModeFromOptions_1.geometryModeFromOptions(options);
        geoOptions.offset = vectorE3Object_1.vectorE3Object(options.offset);
        geoOptions.tilt = spinorE3Object_1.spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object_1.vectorE3Object(referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction());
        geoOptions.meridian = vectorE3Object_1.vectorE3Object(referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction());
        geoOptions.openBack = options.openBack;
        geoOptions.openBase = options.openBase;
        geoOptions.openFront = options.openFront;
        geoOptions.openLeft = options.openLeft;
        geoOptions.openRight = options.openRight;
        geoOptions.openCap = options.openCap;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof BoxGeometry_1.BoxGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new BoxGeometry_1.BoxGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var material = materialFromOptions_1.materialFromOptions(contextManager, simplexModeFromOptions_1.simplexModeFromOptions(options, SimplexMode_1.SimplexMode.TRIANGLE), options);
        _this.material = material;
        material.release();
        setAxisAndMeridian_1.setAxisAndMeridian(_this, options);
        setColorOption_1.setColorOption(_this, options, options.textured ? Color_1.Color.white : Color_1.Color.gray);
        setDeprecatedOptions_1.setDeprecatedOptions(_this, options);
        if (isDefined_1.isDefined(options.width)) {
            _this.width = mustBeNumber_1.mustBeNumber('width', options.width);
        }
        if (isDefined_1.isDefined(options.height)) {
            _this.height = mustBeNumber_1.mustBeNumber('height', options.height);
        }
        if (isDefined_1.isDefined(options.depth)) {
            _this.depth = mustBeNumber_1.mustBeNumber('depth', options.depth);
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Box.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Box.prototype, "width", {
        /**
         * @default 1
         */
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
    Object.defineProperty(Box.prototype, "height", {
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
    Object.defineProperty(Box.prototype, "depth", {
        /**
         *
         */
        get: function () {
            return this.getScaleZ();
        },
        set: function (depth) {
            var x = this.getScaleX();
            var y = this.getScaleY();
            this.setScale(x, y, depth);
        },
        enumerable: false,
        configurable: true
    });
    return Box;
}(Mesh_1.Mesh));
exports.Box = Box;
