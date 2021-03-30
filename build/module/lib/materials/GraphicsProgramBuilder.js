import { mustBeDefined } from '../checks/mustBeDefined';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeString } from '../checks/mustBeString';
import { getAttribVarName } from '../core/getAttribVarName';
import { fragmentShaderSrc } from './fragmentShaderSrc';
import { glslAttribType } from './glslAttribType';
import { GLSLESVersion } from './glslVersion';
import { vColorRequired } from './vColorRequired';
import { vCoordsRequired } from './vCoordsRequired';
import { vertexShaderSrc } from './vertexShaderSrc';
import { vLightRequired } from './vLightRequired';
/**
 * @hidden
 */
function computeAttribParams(values) {
    var result = {};
    var keys = Object.keys(values);
    var keysLength = keys.length;
    for (var i = 0; i < keysLength; i++) {
        var key = keys[i];
        var attribute = values[key];
        mustBeInteger('size', attribute.size);
        var varName = getAttribVarName(attribute, key);
        result[varName] = { glslType: glslAttribType(key, attribute.size) };
    }
    return result;
}
/**
 * GraphicsProgramBuilder is the builder pattern for generating vertex and fragment shader source code.
 * @hidden
 */
var GraphicsProgramBuilder = /** @class */ (function () {
    /**
     * @param primitive
     */
    function GraphicsProgramBuilder(primitive) {
        this.aMeta = {};
        this.uParams = {};
        this._version = GLSLESVersion.OneHundred;
        if (primitive) {
            var attributes = primitive.attributes;
            var keys = Object.keys(attributes);
            for (var i = 0, iLength = keys.length; i < iLength; i++) {
                var key = keys[i];
                var attribute = attributes[key];
                this.attribute(key, attribute.size);
            }
        }
    }
    GraphicsProgramBuilder.prototype.attribute = function (name, size) {
        mustBeString('name', name);
        mustBeInteger('size', size);
        this.aMeta[name] = { size: size };
        return this;
    };
    GraphicsProgramBuilder.prototype.uniform = function (name, glslType) {
        mustBeString('name', name);
        mustBeString('glslType', glslType);
        this.uParams[name] = { glslType: glslType };
        return this;
    };
    GraphicsProgramBuilder.prototype.version = function (version) {
        mustBeDefined("version", version);
        this._version = version;
        return this;
    };
    /**
     * Computes vertex shader source code consistent with the state of this builder.
     */
    GraphicsProgramBuilder.prototype.vertexShaderSrc = function () {
        var aParams = computeAttribParams(this.aMeta);
        var vColor = vColorRequired(aParams, this.uParams);
        var vCoords = vCoordsRequired(aParams, this.uParams);
        var vLight = vLightRequired(aParams, this.uParams);
        return vertexShaderSrc(aParams, this.uParams, vColor, vCoords, vLight, this._version);
    };
    /**
     * Computes fragment shader source code consistent with the state of this builder.
     */
    GraphicsProgramBuilder.prototype.fragmentShaderSrc = function () {
        var aParams = computeAttribParams(this.aMeta);
        var vColor = vColorRequired(aParams, this.uParams);
        var vCoords = vCoordsRequired(aParams, this.uParams);
        var vLight = vLightRequired(aParams, this.uParams);
        return fragmentShaderSrc(aParams, this.uParams, vColor, vCoords, vLight, this._version);
    };
    return GraphicsProgramBuilder;
}());
export { GraphicsProgramBuilder };
