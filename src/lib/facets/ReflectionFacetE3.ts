import { mustBeString } from '../checks/mustBeString';
import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { readOnly } from '../i18n/readOnly';
import { Geometric3 } from '../math/Geometric3';
import { Matrix4 } from '../math/Matrix4';

/**
 * @hidden
 */
export class ReflectionFacetE3 implements Facet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     */
    public _normal: Geometric3;

    private matrix = Matrix4.one.clone();
    private name: string;

    /**
     * @param name {string} The name of the uniform variable.
     */
    constructor(name: string) {
        this.name = mustBeString('name', name);
        // The mathematics of the reflection causes a zero vector to be the identity transformation.
        this._normal = Geometric3.zero(false);
        this._normal.modified = true;
    }

    get normal(): Geometric3 {
        return this._normal;
    }
    set normal(unused) {
        throw new Error(readOnly('normal').message);
    }

    setUniforms(visitor: FacetVisitor): void {
        if (this._normal.modified) {
            this.matrix.reflection(this._normal);
            this._normal.modified = false;
        }
        visitor.matrix4fv(this.name, this.matrix.elements, false);
    }
}
