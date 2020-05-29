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
    get viewMatrixUniformName(): string;
    set viewMatrixUniformName(name: string);
    /**
     * The position of the camera, a vector.
     */
    get eye(): Geometric3;
    set eye(eye: Geometric3);
    /**
     * The point that is being looked at.
     */
    get look(): Geometric3;
    set look(look: Geometric3);
    /**
     * The approximate up direction.
     */
    get up(): Geometric3;
    set up(up: Geometric3);
    get matrix(): Matrix4;
    private refreshMatrix;
}
