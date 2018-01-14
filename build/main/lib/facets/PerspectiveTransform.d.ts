import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { Matrix4 } from '../math/Matrix4';
/**
 *
 */
export declare class PerspectiveTransform implements Facet {
    /**
     *
     */
    private _aspect;
    /**
     *
     */
    private _fov;
    /**
     *
     */
    private _near;
    /**
     *
     */
    private _far;
    /**
     *
     */
    matrix: Matrix4;
    /**
     *
     */
    private matrixName;
    /**
     *
     */
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    /**
     * The aspect ratio (width / height) of the camera viewport.
     */
    aspect: number;
    /**
     * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
     * Measured in radians.
     */
    fov: number;
    /**
     * The distance to the near plane.
     */
    near: number;
    /**
     * The distance to the far plane.
     */
    far: number;
    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
    /**
     * Converts from image cube coordinates to camera coordinates.
     * This method performs the inverse of the perspective transformation.
     */
    imageToCameraCoords(x: number, y: number, z: number): number[];
    /**
     *
     */
    private refreshMatrix();
}
