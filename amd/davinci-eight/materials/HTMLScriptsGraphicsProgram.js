var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeObject', '../checks/mustBeString', '../core/Material'], function (require, exports, mustBeObject_1, mustBeString_1, Material_1) {
    function $(id, dom) {
        var element = dom.getElementById(mustBeString_1.default('id', id));
        if (element) {
            return element;
        }
        else {
            throw new Error(id + " is not a valid DOM element identifier.");
        }
    }
    function vertexShader(scriptIds, dom) {
        var vsId = scriptIds[0];
        mustBeString_1.default('vsId', vsId);
        mustBeObject_1.default('dom', dom);
        return $(vsId, dom).textContent;
    }
    function fragmentShader(scriptIds, dom) {
        var fsId = scriptIds[1];
        mustBeString_1.default('fsId', fsId);
        mustBeObject_1.default('dom', dom);
        return $(fsId, dom).textContent;
    }
    var HTMLScriptsGraphicsProgram = (function (_super) {
        __extends(HTMLScriptsGraphicsProgram, _super);
        function HTMLScriptsGraphicsProgram(scriptIds, dom) {
            if (scriptIds === void 0) { scriptIds = []; }
            if (dom === void 0) { dom = document; }
            _super.call(this, vertexShader(scriptIds, dom), fragmentShader(scriptIds, dom));
        }
        return HTMLScriptsGraphicsProgram;
    })(Material_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HTMLScriptsGraphicsProgram;
});
