"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var GraphicsProgramBuilder_1 = require("../materials/GraphicsProgramBuilder");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var isDefined_1 = require("../checks/isDefined");
var isNull_1 = require("../checks/isNull");
var isUndefined_1 = require("../checks/isUndefined");
var ShaderMaterial_1 = require("./ShaderMaterial");
var mustBeObject_1 = require("../checks/mustBeObject");
function builder(options) {
    if (isNull_1.isNull(options) || isUndefined_1.isUndefined(options)) {
        options = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
        options.attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
        options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    }
    else {
        mustBeObject_1.mustBeObject('options', options);
    }
    var attributes = isDefined_1.isDefined(options.attributes) ? options.attributes : {};
    var uniforms = isDefined_1.isDefined(options.uniforms) ? options.uniforms : {};
    var gpb = new GraphicsProgramBuilder_1.GraphicsProgramBuilder();
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
function vertexShaderSrc(options) {
    return builder(options).vertexShaderSrc();
}
function fragmentShaderSrc(options) {
    return builder(options).fragmentShaderSrc();
}
/**
 * Generates a WebGLProgram suitable for use with LINES, and LINE_STRIP.
 *
 * <table>
 * <tr>
 * <td>attribute</td><td>vec3</td><td>aPosition</td>
 * </tr>
 * </table>
 */
var LineMaterial = (function (_super) {
    tslib_1.__extends(LineMaterial, _super);
    /**
     *
     */
    function LineMaterial(contextManager, options, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, vertexShaderSrc(options), fragmentShaderSrc(options), [], contextManager, levelUp + 1) || this;
        _this.setLoggingName('LineMaterial');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    LineMaterial.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('LineMaterial');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    LineMaterial.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return LineMaterial;
}(ShaderMaterial_1.ShaderMaterial));
exports.LineMaterial = LineMaterial;
