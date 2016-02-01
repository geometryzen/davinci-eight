define(["require", "exports", '../checks/mustBeArray', '../checks/mustBeInteger', '../checks/mustBeObject'], function (require, exports, mustBeArray_1, mustBeInteger_1, mustBeObject_1) {
    var DrawPrimitive = (function () {
        function DrawPrimitive(mode, indices, attributes) {
            this.attributes = {};
            this.mode = mustBeInteger_1.default('mode', mode);
            this.indices = mustBeArray_1.default('indices', indices);
            this.attributes = mustBeObject_1.default('attributes', attributes);
        }
        return DrawPrimitive;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DrawPrimitive;
});
