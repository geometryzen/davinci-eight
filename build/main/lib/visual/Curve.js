"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Curve = void 0;
var tslib_1 = require("tslib");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var Color_1 = require("../core/Color");
var CurveGeometry_1 = require("../geometries/CurveGeometry");
var CurveMode_1 = require("../geometries/CurveMode");
var isDefined_1 = require("../checks/isDefined");
var isFunction_1 = require("../checks/isFunction");
var isNull_1 = require("../checks/isNull");
var isUndefined_1 = require("../checks/isUndefined");
var LineMaterial_1 = require("../materials/LineMaterial");
var Mesh_1 = require("../core/Mesh");
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var PointMaterial_1 = require("../materials/PointMaterial");
var setColorOption_1 = require("./setColorOption");
var setDeprecatedOptions_1 = require("./setDeprecatedOptions");
var Vector3_1 = require("../math/Vector3");
function aPositionDefault(u) {
    return Vector3_1.Vector3.vector(u, 0, 0);
}
function isFunctionOrNull(x) {
    return isFunction_1.isFunction(x) || isNull_1.isNull(x);
}
function isFunctionOrUndefined(x) {
    return isFunction_1.isFunction(x) || isUndefined_1.isUndefined(x);
}
function transferGeometryOptions(options, geoOptions) {
    if (isFunctionOrNull(options.aPosition)) {
        geoOptions.aPosition = options.aPosition;
    }
    else if (isUndefined_1.isUndefined(options.aPosition)) {
        geoOptions.aPosition = aPositionDefault;
    }
    else {
        throw new Error("aPosition must be one of function, null, or undefined.");
    }
    if (isFunctionOrNull(options.aColor)) {
        geoOptions.aColor = options.aColor;
    }
    else if (isUndefined_1.isUndefined(options.aColor)) {
        // Do nothing.
    }
    else {
        throw new Error("aColor must be one of function, null, or undefined.");
    }
    if (isDefined_1.isDefined(options.uMax)) {
        geoOptions.uMax = mustBeNumber_1.mustBeNumber('uMax', options.uMax);
    }
    else {
        geoOptions.uMax = +0.5;
    }
    if (isDefined_1.isDefined(options.uMin)) {
        geoOptions.uMin = mustBeNumber_1.mustBeNumber('uMin', options.uMin);
    }
    else {
        geoOptions.uMin = -0.5;
    }
    if (isDefined_1.isDefined(options.uSegments)) {
        geoOptions.uSegments = mustBeGE_1.mustBeGE('uSegments', options.uSegments, 0);
    }
    else {
        geoOptions.uSegments = 1;
    }
}
function configPoints(contextManager, options, curve) {
    var geoOptions = { kind: 'CurveGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = CurveMode_1.CurveMode.POINTS;
    var geometry = new CurveGeometry_1.CurveGeometry(contextManager, geoOptions);
    curve.geometry = geometry;
    geometry.release();
    var matOptions = { kind: 'PointMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull_1.isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error();
    }
    if (isFunction_1.isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    if (isFunction_1.isFunction(options.aOpacity)) {
        matOptions.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_OPACITY] = 1;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    var material = new PointMaterial_1.PointMaterial(contextManager, matOptions);
    curve.material = material;
    material.release();
}
function configLines(contextManager, options, curve) {
    var geoOptions = { kind: 'CurveGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = CurveMode_1.CurveMode.LINES;
    var geometry = new CurveGeometry_1.CurveGeometry(contextManager, geoOptions);
    curve.geometry = geometry;
    geometry.release();
    var matOptions = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull_1.isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error();
    }
    if (isFunction_1.isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    var material = new LineMaterial_1.LineMaterial(contextManager, matOptions);
    curve.material = material;
    material.release();
}
/**
 * A 3D visual representation of a discrete parameterized line.
 */
var Curve = /** @class */ (function (_super) {
    tslib_1.__extends(Curve, _super);
    /**
     * Constructs a Curve.
     */
    function Curve(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, {}, levelUp + 1) || this;
        _this.setLoggingName('Curve');
        var mode = isDefined_1.isDefined(options.mode) ? options.mode : CurveMode_1.CurveMode.LINES;
        switch (mode) {
            case CurveMode_1.CurveMode.POINTS: {
                configPoints(contextManager, options, _this);
                break;
            }
            case CurveMode_1.CurveMode.LINES: {
                configLines(contextManager, options, _this);
                break;
            }
            default: {
                throw new Error("'" + mode + "' is not a valid option for mode.");
            }
        }
        setColorOption_1.setColorOption(_this, options, Color_1.Color.gray);
        setDeprecatedOptions_1.setDeprecatedOptions(_this, options);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Curve.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return Curve;
}(Mesh_1.Mesh));
exports.Curve = Curve;
