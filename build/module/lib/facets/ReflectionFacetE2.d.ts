import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { Vector2 } from '../math/Vector2';
/**
 * @hidden
 */
export declare class ReflectionFacetE2 implements Facet {
    /**
     * The vector perpendicular to the (hyper-)plane of reflection.
     */
    _normal: Vector2;
    /**
     *
     */
    private matrix;
    private name;
    /**
     * @param name The name of the uniform variable.
     */
    constructor(name: string);
    /**
     *
     */
    get normal(): Vector2;
    set normal(unused: Vector2);
    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
}
