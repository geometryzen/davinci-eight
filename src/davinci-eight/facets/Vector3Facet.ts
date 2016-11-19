import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import mustBeString from '../checks/mustBeString';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

/**
 * Updates a uniform vec3 shader parameter from a VectorE3.
 * Using a VectorE3 makes assignment easier, which is the dominant use case. 
 */
export default class Vector3Facet implements Facet {
    /**
     * Hide the name to provide some degree of safety.
     */
    private _name: string;
    /**
     * Intentionally provide access to the mutable property.
     * The value property provides interoperability with other types.
     */
    public vector = Vector3.vector(0, 0, 0);

    constructor(name: string) {
        this._name = mustBeString('name', name);
    }

    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = mustBeString('name', value);
    }

    get value(): VectorE3 {
        return this.vector;
    }
    set value(value: VectorE3) {
        this.vector.copy(value);
    }

    /**
     * 
     */
    setUniforms(visitor: FacetVisitor): void {
        const v = this.vector;
        visitor.uniform3f(this._name, v.x, v.y, v.z);
    }
}
