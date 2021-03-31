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
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = 2;
    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
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
 *
 * @param contextId The context identifier used when creating the WebGL rendering context. May be undefined.
 * @param options
 * @hidden
 */
function builder(contextId, options) {
    if (isUndefined(options) || isNull(options)) {
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
var LOGGING_NAME_MESH_MATERIAL = 'MeshMaterial';
/**
 * @hidden
 */
function getContextId(contextManager) {
    return mustBeNonNullObject('contextManager', contextManager).contextId;
}
/**
 * @hidden
 */
var MeshMaterial = /** @class */ (function (_super) {
    __extends(MeshMaterial, _super);
    /**
     * 1. Creates a subscription to WebGL rendering context events but does not subscribe.
     * 2. Constructs vertex and fragment shader sources.
     * 3. Sets the name for reporting reference counts.
     * 4. Synchronize with the WebGL rendering context if this is a top-level class (levelUp is zero).
     *
     * The contextManager must be defined.
     *
     * @param contextManager The ContextManager that will be subscribed to for WebGL rendering context events.
     * @param options Used to configure the MeshMaterial.
     * @param levelUp Defines the level of the MeshMaterial in the inheritance hierarchy.
     */
    function MeshMaterial(contextManager, options, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, vertexShaderSrc(getContextId(contextManager), options), fragmentShaderSrc(getContextId(contextManager), options), [], contextManager, levelUp + 1) || this;
        _this.setLoggingName(LOGGING_NAME_MESH_MATERIAL);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    MeshMaterial.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName(LOGGING_NAME_MESH_MATERIAL);
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    MeshMaterial.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return MeshMaterial;
}(ShaderMaterial));
export { MeshMaterial };
