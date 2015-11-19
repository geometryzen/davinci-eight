var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/GraphicsProgram', '../checks/mustSatisfy', '../programs/programFromScripts'], function (require, exports, GraphicsProgram, mustSatisfy, programFromScripts) {
    /**
     * @class HTMLScriptsGraphicsProgram
     * @extends GraphicsProgram
     */
    var HTMLScriptsGraphicsProgram = (function (_super) {
        __extends(HTMLScriptsGraphicsProgram, _super);
        /**
         * @class HTMLScriptsGraphicsProgram
         * @constructor
         * @param contexts {IContextMonitor[]}
         * @param scriptIds {string[]}
         * @param dom {Document}
         */
        function HTMLScriptsGraphicsProgram(contexts, scriptIds, dom) {
            if (scriptIds === void 0) { scriptIds = []; }
            if (dom === void 0) { dom = document; }
            _super.call(this, contexts, 'HTMLScriptsGraphicsProgram');
            /**
             * An ordered list of names of program attributes implicitly specifying the index bindings.
             * @property attributeBindings
             * @type {Array&lt;string&gt;}
             */
            this.attributeBindings = [];
            // For now, we limit the implementation to only a vertex shader and a fragment shader.
            mustSatisfy('scriptIds', scriptIds.length === 2, function () { return "scriptIds must be [vsId, fsId]"; });
            this.scriptIds = scriptIds.map(function (scriptId) { return scriptId; });
            this.dom = dom;
        }
        /**
         * @method createGraphicsProgram
         * @return {IGraphicsProgram}
         * @protected
         */
        HTMLScriptsGraphicsProgram.prototype.createGraphicsProgram = function () {
            var vsId = this.scriptIds[0];
            var fsId = this.scriptIds[1];
            return programFromScripts(this.monitors, vsId, fsId, this.dom, this.attributeBindings);
        };
        return HTMLScriptsGraphicsProgram;
    })(GraphicsProgram);
    return HTMLScriptsGraphicsProgram;
});
