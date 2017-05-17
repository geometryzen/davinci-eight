import * as tslib_1 from "tslib";
import { GraphicsProgramBuilder } from '../materials/GraphicsProgramBuilder';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { isDefined } from '../checks/isDefined';
import { isNull } from '../checks/isNull';
import { isUndefined } from '../checks/isUndefined';
import { ShaderMaterial } from './ShaderMaterial';
import { mustBeObject } from '../checks/mustBeObject';
function builder(options) {
    if (isNull(options) || isUndefined(options)) {
        options = { kind: 'LineMaterial', attributes: {}, uniforms: {} };
        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
        options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';
    }
    else {
        mustBeObject('options', options);
    }
    var attributes = isDefined(options.attributes) ? options.attributes : {};
    var uniforms = isDefined(options.uniforms) ? options.uniforms : {};
    var gpb = new GraphicsProgramBuilder();
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
}(ShaderMaterial));
export { LineMaterial };
