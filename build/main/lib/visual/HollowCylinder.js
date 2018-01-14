"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Color_1 = require("../core/Color");
var Defaults_1 = require("./Defaults");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var HollowCylinderGeometry_1 = require("../geometries/HollowCylinderGeometry");
var offsetFromOptions_1 = require("./offsetFromOptions");
var referenceAxis_1 = require("../core/referenceAxis");
var referenceMeridian_1 = require("../core/referenceMeridian");
var isDefined_1 = require("../checks/isDefined");
var Mesh_1 = require("../core/Mesh");
var MeshMaterial_1 = require("../materials/MeshMaterial");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var setAxisAndMeridian_1 = require("./setAxisAndMeridian");
var setColorOption_1 = require("./setColorOption");
var setDeprecatedOptions_1 = require("./setDeprecatedOptions");
var spinorE3Object_1 = require("./spinorE3Object");
var vectorE3Object_1 = require("./vectorE3Object");
/**
 * A 3D visual representation of a hollow cylinder.
 */
var HollowCylinder = /** @class */ (function (_super) {
    tslib_1.__extends(HollowCylinder, _super);
    /**
     * Constructs a HollowCylinder.
     */
    function HollowCylinder(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction(), meridian: referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction() }, levelUp + 1) || this;
        _this.setLoggingName('HollowCylinder');
        var geoOptions = { kind: 'HollowCylinderGeometry' };
        geoOptions.offset = offsetFromOptions_1.offsetFromOptions(options);
        geoOptions.tilt = spinorE3Object_1.spinorE3Object(options.tilt);
        geoOptions.axis = vectorE3Object_1.vectorE3Object(referenceAxis_1.referenceAxis(options, Defaults_1.ds.axis).direction());
        geoOptions.meridian = vectorE3Object_1.vectorE3Object(referenceMeridian_1.referenceMeridian(options, Defaults_1.ds.meridian).direction());
        geoOptions.outerRadius = isDefined_1.isDefined(options.outerRadius) ? mustBeNumber_1.mustBeNumber('outerRadius', options.outerRadius) : Defaults_1.ds.radius;
        geoOptions.innerRadius = isDefined_1.isDefined(options.innerRadius) ? mustBeNumber_1.mustBeNumber('innerRadius', options.innerRadius) : 0.5 * geoOptions.outerRadius;
        geoOptions.sliceAngle = options.sliceAngle;
        var cachedGeometry = contextManager.getCacheGeometry(geoOptions);
        if (cachedGeometry && cachedGeometry instanceof HollowCylinderGeometry_1.HollowCylinderGeometry) {
            _this.geometry = cachedGeometry;
            cachedGeometry.release();
        }
        else {
            var geometry = new HollowCylinderGeometry_1.HollowCylinderGeometry(contextManager, geoOptions);
            _this.geometry = geometry;
            geometry.release();
            contextManager.putCacheGeometry(geoOptions, geometry);
        }
        var mmo = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };
        mmo.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
        mmo.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
        mmo.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        mmo.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        mmo.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
        mmo.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
        mmo.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        mmo.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
        mmo.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
        mmo.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
        mmo.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
        var cachedMaterial = contextManager.getCacheMaterial(mmo);
        if (cachedMaterial && cachedMaterial instanceof MeshMaterial_1.MeshMaterial) {
            _this.material = cachedMaterial;
            cachedMaterial.release();
        }
        else {
            var material = new MeshMaterial_1.MeshMaterial(contextManager, mmo);
            _this.material = material;
            material.release();
            contextManager.putCacheMaterial(mmo, material);
        }
        setAxisAndMeridian_1.setAxisAndMeridian(_this, options);
        setColorOption_1.setColorOption(_this, options, Color_1.Color.gray);
        setDeprecatedOptions_1.setDeprecatedOptions(_this, options);
        if (isDefined_1.isDefined(options.length)) {
            _this.length = mustBeNumber_1.mustBeNumber('length', options.length);
        }
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    HollowCylinder.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(HollowCylinder.prototype, "length", {
        /**
         * The length of the cylinder, a scalar. Defaults to 1.
         */
        get: function () {
            return this.getScaleY();
        },
        set: function (length) {
            var x = this.getScaleX();
            var z = this.getScaleZ();
            this.setScale(x, length, z);
        },
        enumerable: true,
        configurable: true
    });
    return HollowCylinder;
}(Mesh_1.Mesh));
exports.HollowCylinder = HollowCylinder;
