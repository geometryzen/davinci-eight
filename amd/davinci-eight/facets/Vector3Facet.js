var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeObject', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, mustBeObject, mustBeString, Shareable) {
    var LOGGING_NAME = 'Vector3Facet';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class Vector3Facet
     */
    var Vector3Facet = (function (_super) {
        __extends(Vector3Facet, _super);
        /**
         * @class Vector3Facet
         * @constructor
         * @param name {string}
         * @param vector {R3}
         */
        function Vector3Facet(name, vector) {
            _super.call(this, 'Vector3Facet');
            this._name = mustBeString('name', name, contextBuilder);
            this._vector = mustBeObject('vector', vector, contextBuilder);
        }
        Vector3Facet.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        Vector3Facet.prototype.getProperty = function (name) {
            return void 0;
        };
        Vector3Facet.prototype.setProperty = function (name, value) {
        };
        Vector3Facet.prototype.setUniforms = function (visitor, canvasId) {
            visitor.vec3(this._name, this._vector, canvasId);
        };
        return Vector3Facet;
    })(Shareable);
    return Vector3Facet;
});