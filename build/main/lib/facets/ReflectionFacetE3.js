"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionFacetE3 = void 0;
var mustBeString_1 = require("../checks/mustBeString");
var Geometric3_1 = require("../math/Geometric3");
var Matrix4_1 = require("../math/Matrix4");
var readOnly_1 = require("../i18n/readOnly");
/**
 *
 */
var ReflectionFacetE3 = /** @class */ (function () {
    /**
     * @param name {string} The name of the uniform variable.
     */
    function ReflectionFacetE3(name) {
        this.matrix = Matrix4_1.Matrix4.one.clone();
        this.name = mustBeString_1.mustBeString('name', name);
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = Geometric3_1.Geometric3.zero(false);
        this._normal.modified = true;
    }
    Object.defineProperty(ReflectionFacetE3.prototype, "normal", {
        get: function () {
            return this._normal;
        },
        set: function (unused) {
            throw new Error(readOnly_1.readOnly('normal').message);
        },
        enumerable: false,
        configurable: true
    });
    ReflectionFacetE3.prototype.setUniforms = function (visitor) {
        if (this._normal.modified) {
            this.matrix.reflection(this._normal);
            this._normal.modified = false;
        }
        visitor.matrix4fv(this.name, this.matrix.elements, false);
    };
    return ReflectionFacetE3;
}());
exports.ReflectionFacetE3 = ReflectionFacetE3;
