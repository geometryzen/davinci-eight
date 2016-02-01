define(["require", "exports", '../checks/mustBeString', '../checks/mustBeObject'], function (require, exports, mustBeString_1, mustBeObject_1) {
    function getCanvasElementById(elementId, dom) {
        if (dom === void 0) { dom = window.document; }
        mustBeString_1.default('elementId', elementId);
        mustBeObject_1.default('document', dom);
        var element = dom.getElementById(elementId);
        if (element instanceof HTMLCanvasElement) {
            return element;
        }
        else {
            throw new Error(elementId + " is not an HTMLCanvasElement.");
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getCanvasElementById;
});
