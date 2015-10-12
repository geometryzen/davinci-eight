var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeObject', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, mustBeObject, mustBeString, Shareable) {
    var LOGGING_NAME = 'Vector3Uniform';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class Vector3Uniform
     */
    var Vector3Uniform = (function (_super) {
        __extends(Vector3Uniform, _super);
        /**
         * @class Vector3Uniform
         * @constructor
         * @param name {string}
         * @param vector {Vector3}
         */
        function Vector3Uniform(name, vector) {
            _super.call(this, 'Vector3Uniform');
            this._name = mustBeString('name', name, contextBuilder);
            this._vector = mustBeObject('vector', vector, contextBuilder);
        }
        Vector3Uniform.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        Vector3Uniform.prototype.setUniforms = function (visitor, canvasId) {
            visitor.uniformCartesian3(this._name, this._vector, canvasId);
        };
        return Vector3Uniform;
    })(Shareable);
    return Vector3Uniform;
});
