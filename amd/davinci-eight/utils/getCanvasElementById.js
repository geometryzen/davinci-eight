define(["require", "exports", '../checks/mustBeString', '../checks/mustBeObject'], function (require, exports, mustBeString, mustBeObject) {
    /**
     * Convenience function for &lt;HTMLCanvasElement&gt;document.getElementById(elementId).
     */
    function getCanvasElementById(elementId, dom) {
        if (dom === void 0) { dom = window.document; }
        mustBeString('elementId', elementId);
        mustBeObject('document', dom);
        var element = dom.getElementById(elementId);
        if (element instanceof HTMLCanvasElement) {
            return element;
        }
        else {
            throw new Error(elementId + " is not an HTMLCanvasElement.");
        }
    }
    return getCanvasElementById;
});
