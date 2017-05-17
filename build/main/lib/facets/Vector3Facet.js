"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeString_1 = require("../checks/mustBeString");
var Vector3_1 = require("../math/Vector3");
/**
 * Updates a uniform vec3 shader parameter from a VectorE3.
 * Using a VectorE3 makes assignment easier, which is the dominant use case.
 */
var Vector3Facet = (function () {
    function Vector3Facet(name) {
        /**
         * Intentionally provide access to the mutable property.
         * The value property provides interoperability with other types.
         */
        this.vector = Vector3_1.Vector3.vector(0, 0, 0);
        this._name = mustBeString_1.mustBeString('name', name);
    }
    Object.defineProperty(Vector3Facet.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = mustBeString_1.mustBeString('name', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3Facet.prototype, "value", {
        get: function () {
            return this.vector;
        },
        set: function (value) {
            this.vector.copy(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    Vector3Facet.prototype.setUniforms = function (visitor) {
        var v = this.vector;
        visitor.uniform3f(this._name, v.x, v.y, v.z);
    };
    return Vector3Facet;
}());
exports.Vector3Facet = Vector3Facet;
