import { Geometric3 } from '../math/Geometric3';
import { Matrix4 } from '../math/Matrix4';
import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
/**
 *
 */
export declare class ViewTransform implements Facet {
    /**
     *
     */
    private _eye;
    /**
     *
     */
    private _look;
    /**
     *
     */
    private _up;
    /**
     *
     */
    private _matrix;
    /**
     *
     */
    private matrixName;
    /**
     *
     */
    constructor();
    /**
     *
     */
    cameraToWorldCoords(cameraCoords: number[]): Geometric3;
    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
    /**
     * The name of the uniform mat4 variable in the vertex shader that receives the view matrix value.
     * The default name is `uView`.
     */
    viewMatrixUniformName: string;
    /**
     * The position of the camera, a vector.
     */
    eye: Geometric3;
    /**
     * The point that is being looked at.
     */
    look: Geometric3;
    /**
     * The approximate up direction.
     */
    up: Geometric3;
    readonly matrix: Matrix4;
    private refreshMatrix;
}
