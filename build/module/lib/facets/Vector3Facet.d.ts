import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { Vector3 } from '../math/Vector3';
import { VectorE3 } from '../math/VectorE3';
/**
 * Updates a uniform vec3 shader parameter from a VectorE3.
 * Using a VectorE3 makes assignment easier, which is the dominant use case.
 * @hidden
 */
export declare class Vector3Facet implements Facet {
    /**
     * Hide the name to provide some degree of safety.
     */
    private _name;
    /**
     * Intentionally provide access to the mutable property.
     * The value property provides interoperability with other types.
     */
    vector: Vector3;
    constructor(name: string);
    get name(): string;
    set name(value: string);
    get value(): VectorE3;
    set value(value: VectorE3);
    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
}
