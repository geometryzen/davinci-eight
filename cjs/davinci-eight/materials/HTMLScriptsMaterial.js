var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Material = require('../materials/Material');
var mustSatisfy = require('../checks/mustSatisfy');
var programFromScripts = require('../programs/programFromScripts');
/**
 * Name used for reference count monitoring and logging.
 */
var CLASS_NAME = 'HTMLScriptsMaterial';
function nameBuilder() {
    return CLASS_NAME;
}
/**
 * @module EIGHT
 * @class HTMLScriptsMaterial
 * @extends Material
 */
var HTMLScriptsMaterial = (function (_super) {
    __extends(HTMLScriptsMaterial, _super);
    /**
     * @constructor
     * @param contexts {ContextMonitor[]}
     * @param scriptIds {string[]}
     * @param dom {Document}
     */
    function HTMLScriptsMaterial(contexts, scriptIds, dom) {
        if (scriptIds === void 0) { scriptIds = []; }
        if (dom === void 0) { dom = document; }
        _super.call(this, contexts, CLASS_NAME);
        this.attributeBindings = [];
        // For now, we limit the implementation to only a vertex shader and a fragment shader.
        mustSatisfy('scriptIds', scriptIds.length === 2, function () { return "scriptIds must be [vsId, fsId]"; });
        this.scriptIds = scriptIds.map(function (scriptId) { return scriptId; });
        this.dom = dom;
    }
    HTMLScriptsMaterial.prototype.createProgram = function () {
        var vsId = this.scriptIds[0];
        var fsId = this.scriptIds[1];
        return programFromScripts(this.monitors, vsId, fsId, this.dom, this.attributeBindings);
    };
    return HTMLScriptsMaterial;
})(Material);
module.exports = HTMLScriptsMaterial;
