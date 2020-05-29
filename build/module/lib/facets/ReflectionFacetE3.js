import { mustBeString } from '../checks/mustBeString';
import { Geometric3 } from '../math/Geometric3';
import { Matrix4 } from '../math/Matrix4';
import { readOnly } from '../i18n/readOnly';
/**
 *
 */
var ReflectionFacetE3 = /** @class */ (function () {
    /**
     * @param name {string} The name of the uniform variable.
     */
    function ReflectionFacetE3(name) {
        this.matrix = Matrix4.one.clone();
        this.name = mustBeString('name', name);
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = Geometric3.zero(false);
        this._normal.modified = true;
    }
    Object.defineProperty(ReflectionFacetE3.prototype, "normal", {
        get: function () {
            return this._normal;
        },
        set: function (unused) {
            throw new Error(readOnly('normal').message);
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
export { ReflectionFacetE3 };
