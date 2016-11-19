import { FacetVisitor } from '../core/FacetVisitor';
import { Geometric3 } from '../math/Geometric3';
import VectorE3 from '../math/VectorE3';
import Matrix4 from '../math/Matrix4';
import View from './View';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import isUndefined from '../checks/isUndefined';
import viewMatrixFromEyeLookUp from './viewMatrixFromEyeLookUp';

//
// In this implementation, the state variables are eye, look, and up.
//
// This is equivalent to specifying position and attitude by the following correspondence:
//
// eye is exactly equivalent to position.
//
// look and eye taken together define a unit vector, n, which points in the opposite direction of viewing.
// n and up allow us to calculate the unit vector v which is in the plane of n and up,
// orthogonal to n and on the same side as up.
// n and v define a third unit vector u, where u x v = n.
// This orthogonal frame u, v, n is equivalent to an attitude in that the attitude is the rotor that
// transforms from the reference frame to the u, v, n frame.
// The reference frame is n = e3, v = e2, and u = e1.
//
export default function createView(options: { viewMatrixName?: string } = {}): View {

    /**
     * eye is the position vector of the viewing point.
     * Default is e3.
     */
    const eye: Geometric3 = Geometric3.vector(0, 0, 1);

    /**
     * look is the point that we are looking at.
     * Default is 0, the origin.
     */
    const look: Geometric3 = Geometric3.vector(0, 0, 0);

    /**
     * up is the "guess" at where up should be.
     * Default is e2.
     */
    const up: Geometric3 = Geometric3.vector(0, 1, 0);

    /**
     *
     */
    const viewMatrix: Matrix4 = Matrix4.one();
    const viewMatrixName = isUndefined(options.viewMatrixName) ? GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX : options.viewMatrixName;

    // Force an update of the view matrix.
    eye.modified = true;
    look.modified = true;
    up.modified = true;

    const self: View = {
        get eye(): Geometric3 {
            return eye;
        },
        set eye(newEye: Geometric3) {
            self.setEye(newEye);
        },
        setEye(newEye: VectorE3): View {
            eye.copyVector(newEye);
            return self;
        },
        get look(): Geometric3 {
            return look;
        },
        set look(newLook: Geometric3) {
            self.setLook(newLook);
        },
        setLook(newLook: VectorE3): View {
            look.copyVector(newLook);
            return self;
        },
        get up(): Geometric3 {
            return up;
        },
        set up(newUp: Geometric3) {
            self.setUp(newUp);
        },
        setUp(newUp: VectorE3): View {
            up.copyVector(newUp);
            up.normalize();
            return self;
        },
        setUniforms(visitor: FacetVisitor): void {
            self.updateViewMatrix();
            visitor.matrix4fv(viewMatrixName, viewMatrix.elements, false);
        },

        updateViewMatrix(): void {
            if (eye.modified || look.modified || up.modified) {
                viewMatrixFromEyeLookUp(eye, look, up, viewMatrix);
                eye.modified = false;
                look.modified = false;
                up.modified = false;
            }
        },

        get viewMatrix(): Matrix4 {
            self.updateViewMatrix();
            return viewMatrix;
        }
    };
    return self;
}
