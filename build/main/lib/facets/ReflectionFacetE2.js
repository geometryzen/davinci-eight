"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionFacetE2 = void 0;
var mustBeString_1 = require("../checks/mustBeString");
var Vector2_1 = require("../math/Vector2");
var Matrix2_1 = require("../math/Matrix2");
var readOnly_1 = require("../i18n/readOnly");
/**
 *
 */
var ReflectionFacetE2 = /** @class */ (function () {
    /**
     * @param name The name of the uniform variable.
     */
    function ReflectionFacetE2(name) {
        /**
         *
         */
        this.matrix = Matrix2_1.Matrix2.one.clone();
        this.name = mustBeString_1.mustBeString('name', name);
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = new Vector2_1.Vector2().zero();
        this._normal.modified = true;
    }
    Object.defineProperty(ReflectionFacetE2.prototype, "normal", {
        /**
         *
         */
        get: function () {
            return this._normal;
        },
        set: function (unused) {
            throw new Error(readOnly_1.readOnly('normal').message);
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     */
    ReflectionFacetE2.prototype.setUniforms = function (visitor) {
        if (this._normal.modified) {
            this.matrix.reflection(this._normal);
            this._normal.modified = false;
        }
        visitor.matrix2fv(this.name, this.matrix.elements, false);
    };
    return ReflectionFacetE2;
}());
exports.ReflectionFacetE2 = ReflectionFacetE2;
