define(["require", "exports", '../checks/mustBeObject', '../checks/mustBeString', '../core/Material'], function (require, exports, mustBeObject_1, mustBeString_1, Material_1) {
    function programFromScripts(vsId, fsId, dom, attribs) {
        if (attribs === void 0) { attribs = []; }
        mustBeString_1.default('vsId', vsId);
        mustBeString_1.default('fsId', fsId);
        mustBeObject_1.default('dom', dom);
        function $(id) {
            var element = dom.getElementById(mustBeString_1.default('id', id));
            if (element) {
                return element;
            }
            else {
                throw new Error(id + " is not a valid DOM element identifier.");
            }
        }
        var vertexShader = $(vsId).textContent;
        var fragmentShader = $(fsId).textContent;
        return new Material_1.default(vertexShader, fragmentShader, attribs);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = programFromScripts;
});
