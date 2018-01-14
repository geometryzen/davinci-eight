import { Geometric3 } from '../math/Geometric3';
import { GraphicsProgramSymbols as ProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Matrix4 } from '../math/Matrix4';
import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
import { Vector3 } from '../math/Vector3';
import { viewMatrixFromEyeLookUp } from './viewMatrixFromEyeLookUp';

/**
 * 
 */
export class ViewTransform implements Facet {

    /**
     * 
     */
    private _eye = Geometric3.vector(0, 0, 1);

    /**
     * 
     */
    private _look = Geometric3.vector(0, 0, 0);

    /**
     * 
     */
    private _up = Geometric3.vector(0, 1, 0);

    /**
     * 
     */
    private _matrix = Matrix4.one.clone();

    /**
     * 
     */
    private matrixName = ProgramSymbols.UNIFORM_VIEW_MATRIX;

    /**
     * 
     */
    constructor() {
        this._eye.modified = true;
        this._look.modified = true;
        this._up.modified = true;
    }

    /**
     *
     */
    cameraToWorldCoords(cameraCoords: number[]): Geometric3 {
        // TODO: Pick the coordinates of n, u, v out of the matrix?
        const n = Vector3.copy(this.eye).sub(this.look).normalize();
        const u = Vector3.copy(this.up).cross(n).normalize();
        const v = Vector3.copy(n).cross(u).normalize();

        const u0 = cameraCoords[0];
        const u1 = cameraCoords[1];
        const u2 = cameraCoords[2];

        return this.eye.clone().addVector(u, u0).addVector(v, u1).addVector(n, u2);
    }

    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void {
        this.refreshMatrix();
        visitor.matrix4fv(this.matrixName, this._matrix.elements, false);
    }

    /**
     * The position of the camera, a vector.
     */
    get eye(): Geometric3 {
        return this._eye;
    }
    set eye(eye: Geometric3) {
        this._eye.copyVector(eye);
        this.refreshMatrix();
    }

    /**
     * The point that is being looked at.
     */
    get look(): Geometric3 {
        return this._look;
    }
    set look(look: Geometric3) {
        this._look.copyVector(look);
        this.refreshMatrix();
    }

    /**
     * The approximate up direction.
     */
    get up(): Geometric3 {
        return this._up;
    }
    set up(up: Geometric3) {
        this._up.copyVector(up);
        this.refreshMatrix();
    }

    public get matrix(): Matrix4 {
        // This is a bit of a hack because what we really need is for changes to the
        // eye, look, and up vectors to fire events. This is because it is possible
        // to mutate these vectors.
        this.refreshMatrix();
        return this._matrix;
    }

    private refreshMatrix(): void {
        if (this._eye.modified || this._look.modified || this._up.modified) {
            viewMatrixFromEyeLookUp(this._eye, this._look, this._up, this._matrix);
            this._eye.modified = false;
            this._look.modified = false;
            this._up.modified = false;
        }
    }
}
