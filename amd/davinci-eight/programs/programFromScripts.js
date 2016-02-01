define(["require", "exports", '../programs/createGraphicsProgram', '../scene/MonitorList', '../checks/mustBeObject', '../checks/mustBeString'], function (require, exports, createGraphicsProgram_1, MonitorList_1, mustBeObject_1, mustBeString_1) {
    function programFromScripts(monitors, vsId, fsId, domDocument, attribs) {
        if (attribs === void 0) { attribs = []; }
        MonitorList_1.default.verify('monitors', monitors, function () { return "programFromScripts"; });
        mustBeString_1.default('vsId', vsId);
        mustBeString_1.default('fsId', fsId);
        mustBeObject_1.default('domDocument', domDocument);
        function $(id) {
            var element = domDocument.getElementById(mustBeString_1.default('id', id));
            if (element) {
                return element;
            }
            else {
                throw new Error(id + " is not a valid DOM element identifier.");
            }
        }
        var vertexShader = $(vsId).textContent;
        var fragmentShader = $(fsId).textContent;
        return createGraphicsProgram_1.default(monitors, vertexShader, fragmentShader, attribs);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = programFromScripts;
});
