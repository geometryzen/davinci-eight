import { mustBeGE } from '../checks/mustBeGE';
import { mustBeLE } from '../checks/mustBeLE';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { GraphicsProgramSymbols as ProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Matrix4 } from '../math/Matrix4';

/**
 * @hidden
 */
export class PerspectiveTransform implements Facet {
    /**
     * 
     */
    private _aspect: number;
    /**
     * 
     */
    private _fov: number;
    /**
     * 
     */
    private _near: number;
    /**
     * 
     */
    private _far: number;
    /**
     * 
     */
    public matrix = Matrix4.one.clone();
    /**
     * 
     */
    private matrixName = ProgramSymbols.UNIFORM_PROJECTION_MATRIX;
    /**
     * 
     */
    constructor(fov = 45 * Math.PI / 180, aspect = 1, near = 0.1, far = 1000) {
        this._fov = fov;
        this._aspect = aspect;
        this._near = near;
        this._far = far;
        this.refreshMatrix();
    }
    /**
     * The aspect ratio (width / height) of the camera viewport.
     */
    get aspect(): number {
        return this._aspect;
    }
    set aspect(aspect: number) {
        if (this._aspect !== aspect) {
            mustBeNumber('aspect', aspect);
            mustBeGE('aspect', aspect, 0);
            this._aspect = aspect;
            this.refreshMatrix();
        }
    }


    /**
     * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
     * Measured in radians.
     */
    get fov(): number {
        return this._fov;
    }
    set fov(fov: number) {
        if (this._fov !== fov) {
            mustBeNumber('fov', fov);
            mustBeGE('fov', fov, 0);
            mustBeLE('fov', fov, Math.PI);
            this._fov = fov;
            this.refreshMatrix();
        }
    }


    /**
     * The distance to the near plane.
     */
    get near(): number {
        return this._near;
    }
    set near(near: number) {
        if (this._near !== near) {
            mustBeNumber('near', near);
            mustBeGE('near', near, 0);
            this._near = near;
            this.refreshMatrix();
        }
    }

    /**
     * The distance to the far plane.
     */
    get far(): number {
        return this._far;
    }
    set far(far: number) {
        if (this._far !== far) {
            mustBeNumber('far', far);
            mustBeGE('far', far, 0);
            this._far = far;
            this.refreshMatrix();
        }
    }

    /**
     * 
     */
    setUniforms(visitor: FacetVisitor): void {
        visitor.matrix4fv(this.matrixName, this.matrix.elements, false);
    }

    /**
     * The name of the uniform mat4 variable in the vertex shader that receives the projection matrix value.
     * The default name is `uProjection`.
     */
    get projectionMatrixUniformName(): string {
        return this.matrixName;
    }
    set projectionMatrixUniformName(name: string) {
        this.matrixName = name;
    }

    /**
     * Converts from image cube coordinates to camera coordinates.
     * This method performs the inverse of the perspective transformation.
     */
    imageToCameraCoords(x: number, y: number, z: number): number[] {
        /**
         * Near plane distance.
         */
        const n = this.near;
        /**
         * Far plane distance.
         */
        const f = this.far;
        /**
         * Difference of f and n.
         */
        const d = f - n;
        /**
         * Sum of f and n.
         */
        const s = f + n;
        /**
         * Homogeneous coordinates weight.
         */
        const weight = (s - d * z) / (2 * f * n);
        const t = Math.tan(this.fov / 2);
        const u = this.aspect * t * x / weight;
        const v = t * y / weight;
        const w = -1 / weight;
        return [u, v, w];
    }

    /**
     * 
     */
    private refreshMatrix(): void {
        this.matrix.perspective(this._fov, this._aspect, this._near, this._far);
    }
}
