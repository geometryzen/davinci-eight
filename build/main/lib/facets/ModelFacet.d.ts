import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { Matrix4 } from '../math/Matrix4';
import { ModelE3 } from './ModelE3';
/**
 *
 */
export declare class ModelFacet extends ModelE3 implements Facet {
    /**
     * @default diag(1, 1, 1, 1)
     */
    private matS;
    private _matM;
    private _matN;
    private matR;
    private matT;
    /**
     * <p>
     * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
     * </p>
     * <p>
     * In Physics, the composite object may represent a rigid body.
     * In Computer Graphics, the composite object is a collection of drawing primitives.
     * </p>
     * <p>
     * ModelFacet implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelFacet at the origin and with unity attitude.
     * </p>
     */
    constructor();
    /**
     * Stress (tensor)
     */
    stress: Matrix4;
    /**
     *
     * @readOnly
     */
    matrix: Matrix4;
    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
    private updateMatrices();
}
