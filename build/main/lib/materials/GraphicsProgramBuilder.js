"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getAttribVarName_1 = require("../core/getAttribVarName");
var glslAttribType_1 = require("./glslAttribType");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeString_1 = require("../checks/mustBeString");
var vColorRequired_1 = require("./vColorRequired");
var vCoordsRequired_1 = require("./vCoordsRequired");
var vLightRequired_1 = require("./vLightRequired");
var fragmentShaderSrc_1 = require("./fragmentShaderSrc");
var vertexShaderSrc_1 = require("./vertexShaderSrc");
function computeAttribParams(values) {
    var result = {};
    var keys = Object.keys(values);
    var keysLength = keys.length;
    for (var i = 0; i < keysLength; i++) {
        var key = keys[i];
        var attribute = values[key];
        mustBeInteger_1.mustBeInteger('size', attribute.size);
        var varName = getAttribVarName_1.getAttribVarName(attribute, key);
        result[varName] = { glslType: glslAttribType_1.glslAttribType(key, attribute.size) };
    }
    return result;
}
/**
 * GraphicsProgramBuilder is the builder pattern for generating vertex and fragment shader source code.
 */
var GraphicsProgramBuilder = (function () {
    /**
     * @param primitive
     */
    function GraphicsProgramBuilder(primitive) {
        this.aMeta = {};
        this.uParams = {};
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
        mustBeString_1.mustBeString('name', name);
        mustBeInteger_1.mustBeInteger('size', size);
        this.aMeta[name] = { size: size };
        return this;
    };
    GraphicsProgramBuilder.prototype.uniform = function (name, glslType) {
        mustBeString_1.mustBeString('name', name);
        mustBeString_1.mustBeString('glslType', glslType);
        this.uParams[name] = { glslType: glslType };
        return this;
    };
    /**
     * Computes vertex shader source code consistent with the state of this builder.
     */
    GraphicsProgramBuilder.prototype.vertexShaderSrc = function () {
        var aParams = computeAttribParams(this.aMeta);
        var vColor = vColorRequired_1.vColorRequired(aParams, this.uParams);
        var vCoords = vCoordsRequired_1.vCoordsRequired(aParams, this.uParams);
        var vLight = vLightRequired_1.vLightRequired(aParams, this.uParams);
        return vertexShaderSrc_1.vertexShaderSrc(aParams, this.uParams, vColor, vCoords, vLight);
    };
    /**
     * Computes fragment shader source code consistent with the state of this builder.
     */
    GraphicsProgramBuilder.prototype.fragmentShaderSrc = function () {
        var aParams = computeAttribParams(this.aMeta);
        var vColor = vColorRequired_1.vColorRequired(aParams, this.uParams);
        var vCoords = vCoordsRequired_1.vCoordsRequired(aParams, this.uParams);
        var vLight = vLightRequired_1.vLightRequired(aParams, this.uParams);
        return fragmentShaderSrc_1.fragmentShaderSrc(aParams, this.uParams, vColor, vCoords, vLight);
    };
    return GraphicsProgramBuilder;
}());
exports.GraphicsProgramBuilder = GraphicsProgramBuilder;
