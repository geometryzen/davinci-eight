"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = void 0;
var tslib_1 = require("tslib");
var Color_1 = require("../core/Color");
var expectOptions_1 = require("../checks/expectOptions");
var GeometryMode_1 = require("../geometries/GeometryMode");
var geometryModeFromOptions_1 = require("./geometryModeFromOptions");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var GridGeometry_1 = require("../geometries/GridGeometry");
var isFunction_1 = require("../checks/isFunction");
var isNull_1 = require("../checks/isNull");
var isUndefined_1 = require("../checks/isUndefined");
var LineMaterial_1 = require("../materials/LineMaterial");
var Mesh_1 = require("../core/Mesh");
var MeshMaterial_1 = require("../materials/MeshMaterial");
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeFunction_1 = require("../checks/mustBeFunction");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var mustBeObject_1 = require("../checks/mustBeObject");
var PointMaterial_1 = require("../materials/PointMaterial");
var R3_1 = require("../math/R3");
var setAxisAndMeridian_1 = require("./setAxisAndMeridian");
var setColorOption_1 = require("./setColorOption");
var setDeprecatedOptions_1 = require("./setDeprecatedOptions");
var validate_1 = require("../checks/validate");
var COORD_MIN_DEFAULT = -1;
var COORD_MAX_DEFAULT = +1;
var GRID_SEGMENTS_DEFAULT = 10;
var OPTION_OFFSET = { name: 'offset' };
var OPTION_TILT = { name: 'tilt' };
var OPTION_STRESS = { name: 'stress' };
var OPTION_COLOR = { name: 'color', assertFn: mustBeObject_1.mustBeObject };
var OPTION_POSITION_FUNCTION = { name: 'aPosition', assertFn: mustBeFunction_1.mustBeFunction };
var OPTION_NORMAL_FUNCTION = { name: 'aNormal', assertFn: mustBeFunction_1.mustBeFunction };
var OPTION_COLOR_FUNCTION = { name: 'aColor', assertFn: mustBeFunction_1.mustBeFunction };
var OPTION_UMIN = { name: 'uMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber_1.mustBeNumber };
var OPTION_UMAX = { name: 'uMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber_1.mustBeNumber };
var OPTION_USEGMENTS = { name: 'uSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger_1.mustBeInteger };
var OPTION_VMIN = { name: 'vMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber_1.mustBeNumber };
var OPTION_VMAX = { name: 'vMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber_1.mustBeNumber };
var OPTION_VSEGMENTS = { name: 'vSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger_1.mustBeInteger };
var OPTION_MODE = { name: 'mode', defaultValue: GeometryMode_1.GeometryMode.WIRE, assertFn: mustBeInteger_1.mustBeInteger };
var OPTIONS = [
    OPTION_OFFSET,
    OPTION_TILT,
    OPTION_STRESS,
    OPTION_COLOR,
    OPTION_POSITION_FUNCTION,
    OPTION_NORMAL_FUNCTION,
    OPTION_COLOR_FUNCTION,
    OPTION_UMIN,
    OPTION_UMAX,
    OPTION_USEGMENTS,
    OPTION_VMIN,
    OPTION_VMAX,
    OPTION_VSEGMENTS,
    OPTION_MODE
];
var OPTION_NAMES = OPTIONS.map(function (option) { return option.name; });
function aPositionDefault(u, v) {
    return R3_1.vec(u, v, 0);
}
function aNormalDefault(u, v) {
    mustBeNumber_1.mustBeNumber('u', u);
    mustBeNumber_1.mustBeNumber('v', v);
    return R3_1.vec(0, 0, 1);
}
function isFunctionOrNull(x) {
    return isFunction_1.isFunction(x) || isNull_1.isNull(x);
}
function isFunctionOrUndefined(x) {
    return isFunction_1.isFunction(x) || isUndefined_1.isUndefined(x);
}
function transferGeometryOptions(source, target) {
    if (isFunctionOrNull(source.aPosition)) {
        target.aPosition = source.aPosition;
    }
    else if (isUndefined_1.isUndefined(source.aPosition)) {
        target.aPosition = aPositionDefault;
    }
    else {
        throw new Error("aPosition must be one of function, null, or undefined.");
    }
    if (isFunctionOrNull(source.aNormal)) {
        target.aNormal = source.aNormal;
    }
    else if (isUndefined_1.isUndefined(source.aNormal)) {
        target.aNormal = aNormalDefault;
    }
    else {
        throw new Error("aNormal must be one of function, null, or undefined.");
    }
    if (isFunctionOrNull(source.aColor)) {
        target.aColor = source.aColor;
    }
    else if (isUndefined_1.isUndefined(source.aColor)) {
        // Do nothing.
    }
    else {
        throw new Error("aColor must be one of function, null, or undefined.");
    }
    target.uMin = validate_1.validate('uMin', source.uMin, COORD_MIN_DEFAULT, mustBeNumber_1.mustBeNumber);
    target.uMax = validate_1.validate('uMax', source.uMax, COORD_MAX_DEFAULT, mustBeNumber_1.mustBeNumber);
    target.uSegments = validate_1.validate('uSegments', source.uSegments, GRID_SEGMENTS_DEFAULT, mustBeInteger_1.mustBeInteger);
    mustBeGE_1.mustBeGE('uSegments', target.uSegments, 0);
    target.vMin = validate_1.validate('vMin', source.vMin, COORD_MIN_DEFAULT, mustBeNumber_1.mustBeNumber);
    target.vMax = validate_1.validate('vMax', source.vMax, COORD_MAX_DEFAULT, mustBeNumber_1.mustBeNumber);
    target.vSegments = validate_1.validate('vSegments', source.vSegments, GRID_SEGMENTS_DEFAULT, mustBeInteger_1.mustBeInteger);
    mustBeGE_1.mustBeGE('vSegments', target.vSegments, 0);
}
/**
 *
 */
function configGeometry(engine, geoOptions, grid) {
    // Don't use the Geometry cache until we can better differentiate the options.
    var geometry = new GridGeometry_1.GridGeometry(engine, geoOptions);
    grid.geometry = geometry;
    geometry.release();
    /*
    const cachedGeometry = engine.getCacheGeometry(geoOptions);
    if (cachedGeometry && cachedGeometry instanceof GridGeometry) {
        grid.geometry = cachedGeometry;
        cachedGeometry.release();
    }
    else {
        const geometry = new GridGeometry(engine, geoOptions);
        grid.geometry = geometry;
        geometry.release();
        engine.putCacheGeometry(geoOptions, geometry);
    }
    */
}
function configPoints(engine, options, grid) {
    var geoOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode_1.GeometryMode.POINT;
    configGeometry(engine, geoOptions, grid);
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
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    var cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof PointMaterial_1.PointMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        var material = new PointMaterial_1.PointMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}
function configLines(engine, options, grid) {
    var geoOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode_1.GeometryMode.WIRE;
    configGeometry(engine, geoOptions, grid);
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
    /*
    if (isFunction(options.aNormal)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
    }
    */
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
    var cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof LineMaterial_1.LineMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        var material = new LineMaterial_1.LineMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}
function configMesh(engine, options, grid) {
    var geoOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode_1.GeometryMode.MESH;
    configGeometry(engine, geoOptions, grid);
    var geometry = new GridGeometry_1.GridGeometry(engine, geoOptions);
    grid.geometry = geometry;
    geometry.release();
    var matOptions = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull_1.isNull(options.aPosition)) {
        // We're being instructed not to have the aPosition attribute.
    }
    else {
        throw new Error();
    }
    if (isFunctionOrUndefined(options.aNormal)) {
        matOptions.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
    }
    else if (isNull_1.isNull(options.aNormal)) {
        // We're being instructed not to have the aNormal attribute.
    }
    else {
        throw new Error();
    }
    if (isFunction_1.isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else if (isNull_1.isNull(options.aColor)) {
        // We're being instructed not to have the aColor attribute.
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    else if (isUndefined_1.isUndefined(options.aColor)) {
        matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    else {
        throw new Error();
    }
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
    var cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof MeshMaterial_1.MeshMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        var material = new MeshMaterial_1.MeshMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}
/**
 * A 3D visual representation of a a discrete parameterized surface.
 */
var Grid = /** @class */ (function (_super) {
    tslib_1.__extends(Grid, _super);
    /**
     * Constructs a Grid.
     */
    function Grid(engine, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, engine, {}, levelUp + 1) || this;
        _this.setLoggingName('Grid');
        expectOptions_1.expectOptions(OPTION_NAMES, Object.keys(options));
        var mode = geometryModeFromOptions_1.geometryModeFromOptions(options, GeometryMode_1.GeometryMode.WIRE);
        switch (mode) {
            case GeometryMode_1.GeometryMode.POINT: {
                configPoints(engine, options, _this);
                break;
            }
            case GeometryMode_1.GeometryMode.WIRE: {
                configLines(engine, options, _this);
                break;
            }
            case GeometryMode_1.GeometryMode.MESH: {
                configMesh(engine, options, _this);
                break;
            }
            default: {
                throw new Error("'" + mode + "' is not a valid option for mode.");
            }
        }
        setAxisAndMeridian_1.setAxisAndMeridian(_this, options);
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
    Grid.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return Grid;
}(Mesh_1.Mesh));
exports.Grid = Grid;
