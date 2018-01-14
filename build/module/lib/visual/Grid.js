import * as tslib_1 from "tslib";
import { Color } from '../core/Color';
import { expectOptions } from '../checks/expectOptions';
import { GeometryMode } from '../geometries/GeometryMode';
import { geometryModeFromOptions } from './geometryModeFromOptions';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { GridGeometry } from '../geometries/GridGeometry';
import { isFunction } from '../checks/isFunction';
import { isNull } from '../checks/isNull';
import { isUndefined } from '../checks/isUndefined';
import { LineMaterial } from '../materials/LineMaterial';
import { Mesh } from '../core/Mesh';
import { MeshMaterial } from '../materials/MeshMaterial';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeFunction } from '../checks/mustBeFunction';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { mustBeObject } from '../checks/mustBeObject';
import { PointMaterial } from '../materials/PointMaterial';
import { vec } from '../math/R3';
import { setAxisAndMeridian } from './setAxisAndMeridian';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { validate } from '../checks/validate';
var COORD_MIN_DEFAULT = -1;
var COORD_MAX_DEFAULT = +1;
var GRID_SEGMENTS_DEFAULT = 10;
var OPTION_OFFSET = { name: 'offset' };
var OPTION_TILT = { name: 'tilt' };
var OPTION_STRESS = { name: 'stress' };
var OPTION_COLOR = { name: 'color', assertFn: mustBeObject };
var OPTION_POSITION_FUNCTION = { name: 'aPosition', assertFn: mustBeFunction };
var OPTION_NORMAL_FUNCTION = { name: 'aNormal', assertFn: mustBeFunction };
var OPTION_COLOR_FUNCTION = { name: 'aColor', assertFn: mustBeFunction };
var OPTION_UMIN = { name: 'uMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber };
var OPTION_UMAX = { name: 'uMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber };
var OPTION_USEGMENTS = { name: 'uSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger };
var OPTION_VMIN = { name: 'vMin', defaultValue: COORD_MIN_DEFAULT, assertFn: mustBeNumber };
var OPTION_VMAX = { name: 'vMax', defaultValue: COORD_MAX_DEFAULT, assertFn: mustBeNumber };
var OPTION_VSEGMENTS = { name: 'vSegments', defaultValue: GRID_SEGMENTS_DEFAULT, assertFn: mustBeInteger };
var OPTION_MODE = { name: 'mode', defaultValue: GeometryMode.WIRE, assertFn: mustBeInteger };
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
    return vec(u, v, 0);
}
function aNormalDefault(u, v) {
    mustBeNumber('u', u);
    mustBeNumber('v', v);
    return vec(0, 0, 1);
}
function isFunctionOrNull(x) {
    return isFunction(x) || isNull(x);
}
function isFunctionOrUndefined(x) {
    return isFunction(x) || isUndefined(x);
}
function transferGeometryOptions(source, target) {
    if (isFunctionOrNull(source.aPosition)) {
        target.aPosition = source.aPosition;
    }
    else if (isUndefined(source.aPosition)) {
        target.aPosition = aPositionDefault;
    }
    else {
        throw new Error("aPosition must be one of function, null, or undefined.");
    }
    if (isFunctionOrNull(source.aNormal)) {
        target.aNormal = source.aNormal;
    }
    else if (isUndefined(source.aNormal)) {
        target.aNormal = aNormalDefault;
    }
    else {
        throw new Error("aNormal must be one of function, null, or undefined.");
    }
    if (isFunctionOrNull(source.aColor)) {
        target.aColor = source.aColor;
    }
    else if (isUndefined(source.aColor)) {
        // Do nothing.
    }
    else {
        throw new Error("aColor must be one of function, null, or undefined.");
    }
    target.uMin = validate('uMin', source.uMin, COORD_MIN_DEFAULT, mustBeNumber);
    target.uMax = validate('uMax', source.uMax, COORD_MAX_DEFAULT, mustBeNumber);
    target.uSegments = validate('uSegments', source.uSegments, GRID_SEGMENTS_DEFAULT, mustBeInteger);
    mustBeGE('uSegments', target.uSegments, 0);
    target.vMin = validate('vMin', source.vMin, COORD_MIN_DEFAULT, mustBeNumber);
    target.vMax = validate('vMax', source.vMax, COORD_MAX_DEFAULT, mustBeNumber);
    target.vSegments = validate('vSegments', source.vSegments, GRID_SEGMENTS_DEFAULT, mustBeInteger);
    mustBeGE('vSegments', target.vSegments, 0);
}
/**
 *
 */
function configGeometry(engine, geoOptions, grid) {
    // Don't use the Geometry cache until we can better differentiate the options.
    var geometry = new GridGeometry(engine, geoOptions);
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
    geoOptions.mode = GeometryMode.POINT;
    configGeometry(engine, geoOptions, grid);
    var matOptions = { kind: 'PointMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have a position attribute.
    }
    else {
        throw new Error();
    }
    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    var cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof PointMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        var material = new PointMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}
function configLines(engine, options, grid) {
    var geoOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode.WIRE;
    configGeometry(engine, geoOptions, grid);
    var matOptions = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
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
    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    var cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof LineMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        var material = new LineMaterial(engine, matOptions);
        grid.material = material;
        material.release();
        engine.putCacheMaterial(matOptions, material);
    }
}
function configMesh(engine, options, grid) {
    var geoOptions = { kind: 'GridGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = GeometryMode.MESH;
    configGeometry(engine, geoOptions, grid);
    var geometry = new GridGeometry(engine, geoOptions);
    grid.geometry = geometry;
    geometry.release();
    var matOptions = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };
    if (isFunctionOrUndefined(options.aPosition)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    }
    else if (isNull(options.aPosition)) {
        // We're being instructed not to have the aPosition attribute.
    }
    else {
        throw new Error();
    }
    if (isFunctionOrUndefined(options.aNormal)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
    }
    else if (isNull(options.aNormal)) {
        // We're being instructed not to have the aNormal attribute.
    }
    else {
        throw new Error();
    }
    if (isFunction(options.aColor)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = 3;
    }
    else if (isNull(options.aColor)) {
        // We're being instructed not to have the aColor attribute.
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    else if (isUndefined(options.aColor)) {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    }
    else {
        throw new Error();
    }
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
    var cachedMaterial = engine.getCacheMaterial(matOptions);
    if (cachedMaterial && cachedMaterial instanceof MeshMaterial) {
        grid.material = cachedMaterial;
        cachedMaterial.release();
    }
    else {
        var material = new MeshMaterial(engine, matOptions);
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
        expectOptions(OPTION_NAMES, Object.keys(options));
        var mode = geometryModeFromOptions(options, GeometryMode.WIRE);
        switch (mode) {
            case GeometryMode.POINT: {
                configPoints(engine, options, _this);
                break;
            }
            case GeometryMode.WIRE: {
                configLines(engine, options, _this);
                break;
            }
            case GeometryMode.MESH: {
                configMesh(engine, options, _this);
                break;
            }
            default: {
                throw new Error("'" + mode + "' is not a valid option for mode.");
            }
        }
        setAxisAndMeridian(_this, options);
        setColorOption(_this, options, Color.gray);
        setDeprecatedOptions(_this, options);
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
}(Mesh));
export { Grid };
