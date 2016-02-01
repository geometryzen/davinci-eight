var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/GraphicsProgram', '../checks/mustSatisfy', '../programs/programFromScripts'], function (require, exports, GraphicsProgram_1, mustSatisfy_1, programFromScripts_1) {
    var HTMLScriptsGraphicsProgram = (function (_super) {
        __extends(HTMLScriptsGraphicsProgram, _super);
        function HTMLScriptsGraphicsProgram(scriptIds, dom, monitors) {
            if (scriptIds === void 0) { scriptIds = []; }
            if (dom === void 0) { dom = document; }
            _super.call(this, 'HTMLScriptsGraphicsProgram', monitors);
            this.attributeBindings = [];
            mustSatisfy_1.default('scriptIds', scriptIds.length === 2, function () { return "scriptIds must be [vsId, fsId]"; });
            this.scriptIds = scriptIds.map(function (scriptId) { return scriptId; });
            this.dom = dom;
        }
        HTMLScriptsGraphicsProgram.prototype.createGraphicsProgram = function () {
            var vsId = this.scriptIds[0];
            var fsId = this.scriptIds[1];
            return programFromScripts_1.default(this.monitors, vsId, fsId, this.dom, this.attributeBindings);
        };
        return HTMLScriptsGraphicsProgram;
    })(GraphicsProgram_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HTMLScriptsGraphicsProgram;
});
