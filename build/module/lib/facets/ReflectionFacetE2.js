import { mustBeString } from '../checks/mustBeString';
import { Vector2 } from '../math/Vector2';
import { Matrix2 } from '../math/Matrix2';
import { readOnly } from '../i18n/readOnly';
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
        this.matrix = Matrix2.one.clone();
        this.name = mustBeString('name', name);
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = new Vector2().zero();
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
            throw new Error(readOnly('normal').message);
        },
        enumerable: true,
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
export { ReflectionFacetE2 };
