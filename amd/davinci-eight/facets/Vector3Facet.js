define(["require", "exports", '../checks/mustBeObject', '../checks/mustBeString'], function (require, exports, mustBeObject_1, mustBeString_1) {
    var LOGGING_NAME = 'Vector3Facet';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    var Vector3Facet = (function () {
        function Vector3Facet(name, vector) {
            this._name = mustBeString_1.default('name', name, contextBuilder);
            this._vector = mustBeObject_1.default('vector', vector, contextBuilder);
        }
        Vector3Facet.prototype.getProperty = function (name) {
            return void 0;
        };
        Vector3Facet.prototype.setProperty = function (name, value) {
            return this;
        };
        Vector3Facet.prototype.setUniforms = function (visitor) {
            visitor.vec3(this._name, this._vector);
        };
        return Vector3Facet;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector3Facet;
});
