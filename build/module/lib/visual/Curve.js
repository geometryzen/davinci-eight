import { __extends } from "tslib";
import { isDefined } from '../checks/isDefined';
import { isFunction } from '../checks/isFunction';
import { isNull } from '../checks/isNull';
import { isUndefined } from '../checks/isUndefined';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Color } from '../core/Color';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Mesh } from '../core/Mesh';
import { CurveGeometry } from '../geometries/CurveGeometry';
import { CurveMode } from '../geometries/CurveMode';
import { LineMaterial } from '../materials/LineMaterial';
import { PointMaterial } from '../materials/PointMaterial';
import { Vector3 } from '../math/Vector3';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
/**
 * @hidden
 */
function aPositionDefault(u) {
    return Vector3.vector(u, 0, 0);
}
/**
 * @hidden
 */
function isFunctionOrNull(x) {
    return isFunction(x) || isNull(x);
}
/**
 * @hidden
 */
function isFunctionOrUndefined(x) {
    return isFunction(x) || isUndefined(x);
}
/**
 * @hidden
 */
function transferGeometryOptions(options, geoOptions) {
    if (isFunctionOrNull(options.aPosition)) {
        geoOptions.aPosition = options.aPosition;
    }
    else if (isUndefined(options.aPosition)) {
        geoOptions.aPosition = aPositionDefault;
    }
    else {
        throw new Error("aPosition must be one of function, null, or undefined.");
    }
    if (isFunctionOrNull(options.aColor)) {
        geoOptions.aColor = options.aColor;
    }
    else if (isUndefined(options.aColor)) {
        // Do nothing.
    }
    else {
        throw new Error("aColor must be one of function, null, or undefined.");
    }
    if (isDefined(options.uMax)) {
        geoOptions.uMax = mustBeNumber('uMax', options.uMax);
    }
    else {
        geoOptions.uMax = +0.5;
    }
    if (isDefined(options.uMin)) {
        geoOptions.uMin = mustBeNumber('uMin', options.uMin);
    }
    else {
        geoOptions.uMin = -0.5;
    }
    if (isDefined(options.uSegments)) {
        geoOptions.uSegments = mustBeGE('uSegments', options.uSegments, 0);
    }
    else {
        geoOptions.uSegments = 1;
    }
}
/**
 * @hidden
 */
function configPoints(contextManager, options, curve) {
    var geoOptions = { kind: 'CurveGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = CurveMode.POINTS;
    var geometry = new CurveGeometry(contextManager, geoOptions);
    curve.geometry = geometry;
    geometry.release();
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
    }
    if (isFunction(options.aOpacity)) {
        matOptions.attributes[GraphicsProgramSymbols.ATTRIBUTE_OPACITY] = 1;
    }
    else {
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    }
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    matOptions.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
    var material = new PointMaterial(contextManager, matOptions);
    curve.material = material;
    material.release();
}
/**
 * @hidden
 */
function configLines(contextManager, options, curve) {
    var geoOptions = { kind: 'CurveGeometry' };
    transferGeometryOptions(options, geoOptions);
    geoOptions.mode = CurveMode.LINES;
    var geometry = new CurveGeometry(contextManager, geoOptions);
    curve.geometry = geometry;
    geometry.release();
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
    var material = new LineMaterial(contextManager, matOptions);
    curve.material = material;
    material.release();
}
/**
 * A 3D visual representation of a discrete parameterized line.
 */
var Curve = /** @class */ (function (_super) {
    __extends(Curve, _super);
    /**
     * Constructs a Curve.
     */
    function Curve(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, {}, levelUp + 1) || this;
        _this.setLoggingName('Curve');
        var mode = isDefined(options.mode) ? options.mode : CurveMode.LINES;
        switch (mode) {
            case CurveMode.POINTS: {
                configPoints(contextManager, options, _this);
                break;
            }
            case CurveMode.LINES: {
                configLines(contextManager, options, _this);
                break;
            }
            default: {
                throw new Error("'" + mode + "' is not a valid option for mode.");
            }
        }
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
    Curve.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return Curve;
}(Mesh));
export { Curve };
