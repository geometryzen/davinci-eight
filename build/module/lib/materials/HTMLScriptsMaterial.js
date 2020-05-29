import { __extends } from "tslib";
import { isString } from '../checks/isString';
import { mustBeArray } from '../checks/mustBeArray';
import { mustBeObject } from '../checks/mustBeObject';
import { mustBeString } from '../checks/mustBeString';
import { mustSatisfy } from '../checks/mustSatisfy';
import { ShaderMaterial } from './ShaderMaterial';
function getHTMLElementById(elementId, dom) {
    var element = dom.getElementById(mustBeString('elementId', elementId));
    if (element) {
        return element;
    }
    else {
        throw new Error("'" + elementId + "' is not a valid element identifier.");
    }
}
function vertexShaderSrc(vsId, dom) {
    mustBeString('vsId', vsId);
    mustBeObject('dom', dom);
    return getHTMLElementById(vsId, dom).textContent;
}
function fragmentShaderSrc(fsId, dom) {
    mustBeString('fsId', fsId);
    mustBeObject('dom', dom);
    return getHTMLElementById(fsId, dom).textContent;
}
function assign(elementId, dom, result) {
    var htmlElement = dom.getElementById(elementId);
    if (htmlElement instanceof HTMLScriptElement) {
        var script = htmlElement;
        if (isString(script.type)) {
            if (script.type.indexOf('vertex') >= 0) {
                result[0] = elementId;
            }
            else if (script.type.indexOf('fragment') >= 0) {
                result[1] = elementId;
            }
            else {
                // Do nothing
            }
        }
        if (isString(script.textContent)) {
            if (script.textContent.indexOf('gl_Position') >= 0) {
                result[0] = elementId;
            }
            else if (script.textContent.indexOf('gl_FragColor') >= 0) {
                result[1] = elementId;
            }
            else {
                // Do nothing
            }
        }
    }
}
function detectShaderType(scriptIds, dom) {
    mustBeArray('scriptIds', scriptIds);
    mustSatisfy('scriptIds', scriptIds.length === 2, function () { return 'have two script element identifiers.'; });
    var result = [scriptIds[0], scriptIds[1]];
    assign(scriptIds[0], dom, result);
    assign(scriptIds[1], dom, result);
    return result;
}
/**
 * A shareable WebGL program based upon shader source code in HTML script elements.
 *
 * This class provides a convenient way of creating custom GLSL programs.
 * The scripts are lazily loaded so that the constructor may be called before
 * the DOM has finished loading.
 */
var HTMLScriptsMaterial = /** @class */ (function (_super) {
    __extends(HTMLScriptsMaterial, _super);
    /**
     * @param contextManager
     * @param scriptIds The element identifiers for the vertex and fragment shader respectively.
     * @param attribs An array of strings containing the order of attributes.
     * @param dom The document object model that owns the script elements.
     * @param levelUp
     */
    function HTMLScriptsMaterial(contextManager, scriptIds, attribs, dom, levelUp) {
        if (attribs === void 0) { attribs = []; }
        if (dom === void 0) { dom = window.document; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, vertexShaderSrc(detectShaderType(scriptIds, dom)[0], dom), fragmentShaderSrc(detectShaderType(scriptIds, dom)[1], dom), attribs, contextManager, levelUp + 1) || this;
        _this.setLoggingName('HTMLScriptsMaterial');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    HTMLScriptsMaterial.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('HTMLScriptsMaterial');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    HTMLScriptsMaterial.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return HTMLScriptsMaterial;
}(ShaderMaterial));
export { HTMLScriptsMaterial };
