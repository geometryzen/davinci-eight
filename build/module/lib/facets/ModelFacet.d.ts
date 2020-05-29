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
     * The name used for the model matrix in the vertex shader.
     */
    private nameM;
    /**
     * The name used for the normal matrix in the vertex shader.
     */
    private nameN;
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
    get stress(): Matrix4;
    set stress(stress: Matrix4);
    /**
     * @readOnly
     */
    get matrix(): Matrix4;
    set matrix(unused: Matrix4);
    /**
     * The name of the uniform variable in the vertex shader that receives the model matrix value.
     */
    get modelMatrixUniformName(): string;
    set modelMatrixUniformName(name: string);
    /**
     * The name of the uniform variable in the vertex shader that receives the normal matrix value.
     */
    get normalMatrixUniformName(): string;
    set normalMatrixUniformName(name: string);
    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
    private updateMatrices;
}
