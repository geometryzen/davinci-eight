import { __extends } from "tslib";
import { isDefined } from '../checks/isDefined';
import { isNull } from '../checks/isNull';
import { isUndefined } from '../checks/isUndefined';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeObject } from '../checks/mustBeObject';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { GraphicsProgramBuilder } from '../materials/GraphicsProgramBuilder';
import { glslVersionFromWebGLContextId } from './glslVersionFromWebGLContextId';
import { ShaderMaterial } from './ShaderMaterial';
/**
 * @hidden
 */
function defaultOptions(options) {
    if (!options.attributes) {
        options.attributes = {};
    }
    if (!options.uniforms) {
        options.uniforms = {};
    }
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
}
/**
 * @hidden
 */
function shaderPropertiesCount(options) {
    var count = Object.keys(options).length;
    if (options.version) {
        count--;
    }
    return count;
}
/**
 * @hidden
 */
function builder(contextId, options) {
    if (isNull(options) || isUndefined(options)) {
        options = { attributes: {}, uniforms: {} };
        defaultOptions(options);
    }
    else {
        mustBeObject('options', options);
        if (shaderPropertiesCount(options) === 0) {
            defaultOptions(options);
        }
    }
    var attributes = isDefined(options.attributes) ? options.attributes : {};
    var uniforms = isDefined(options.uniforms) ? options.uniforms : {};
    var gpb = new GraphicsProgramBuilder();
    gpb.version(glslVersionFromWebGLContextId(options.version, contextId));
    var aNames = Object.keys(attributes);
    for (var a = 0; a < aNames.length; a++) {
        var aName = aNames[a];
        var size = attributes[aName];
        gpb.attribute(aName, size);
    }
    var uNames = Object.keys(uniforms);
    for (var u = 0; u < uNames.length; u++) {
        var uName = uNames[u];
        var type = uniforms[uName];
        gpb.uniform(uName, type);
    }
    return gpb;
}
/**
 * @hidden
 */
function vertexShaderSrc(contextId, options) {
    return builder(contextId, options).vertexShaderSrc();
}
/**
 * @hidden
 */
function fragmentShaderSrc(contextId, options) {
    return builder(contextId, options).fragmentShaderSrc();
}
/**
 * @hidden
 */
var LOGGING_NAME_POINT_MATERIAL = 'PointMaterial';
/**
 * @hidden
 */
function getContextId(contextManager) {
    return mustBeNonNullObject('contextManager', contextManager).contextId;
}
/**
 * @hidden
 */
var PointMaterial = /** @class */ (function (_super) {
    __extends(PointMaterial, _super);
    /**
     *
     */
    function PointMaterial(contextManager, options, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, vertexShaderSrc(getContextId(contextManager), options), fragmentShaderSrc(getContextId(contextManager), options), [], contextManager, levelUp + 1) || this;
        _this.setLoggingName(LOGGING_NAME_POINT_MATERIAL);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    PointMaterial.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName(LOGGING_NAME_POINT_MATERIAL);
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    PointMaterial.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return PointMaterial;
}(ShaderMaterial));
export { PointMaterial };
