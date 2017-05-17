import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { Geometric3 } from '../math/Geometric3';
/**
 *
 */
export declare class ReflectionFacetE3 implements Facet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     */
    _normal: Geometric3;
    private matrix;
    private name;
    /**
     * @param name {string} The name of the uniform variable.
     */
    constructor(name: string);
    normal: Geometric3;
    setUniforms(visitor: FacetVisitor): void;
}
