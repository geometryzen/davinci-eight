import { isUndefined } from '../checks/isUndefined';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Geometric3 } from '../math/Geometric3';
import { Matrix4 } from '../math/Matrix4';
import { viewMatrixFromEyeLookUp } from './viewMatrixFromEyeLookUp';
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
/**
 * @hidden
 */
export function createView(options) {
    if (options === void 0) { options = {}; }
    /**
     * eye is the position vector of the viewing point.
     * Default is e3.
     */
    var eye = Geometric3.vector(0, 0, 1);
    /**
     * look is the point that we are looking at.
     * Default is 0, the origin.
     */
    var look = Geometric3.vector(0, 0, 0);
    /**
     * up is the "guess" at where up should be.
     * Default is e2.
     */
    var up = Geometric3.vector(0, 1, 0);
    /**
     *
     */
    var viewMatrix = Matrix4.one.clone();
    var viewMatrixName = isUndefined(options.viewMatrixName) ? GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX : options.viewMatrixName;
    // Force an update of the view matrix.
    eye.modified = true;
    look.modified = true;
    up.modified = true;
    var self = {
        get eye() {
            return eye;
        },
        set eye(newEye) {
            self.setEye(newEye);
        },
        setEye: function (newEye) {
            eye.copyVector(newEye);
            return self;
        },
        get look() {
            return look;
        },
        set look(newLook) {
            self.setLook(newLook);
        },
        setLook: function (newLook) {
            look.copyVector(newLook);
            return self;
        },
        get up() {
            return up;
        },
        set up(newUp) {
            self.setUp(newUp);
        },
        setUp: function (newUp) {
            up.copyVector(newUp);
            up.normalize();
            return self;
        },
        setUniforms: function (visitor) {
            self.updateViewMatrix();
            visitor.matrix4fv(viewMatrixName, viewMatrix.elements, false);
        },
        updateViewMatrix: function () {
            if (eye.modified || look.modified || up.modified) {
                viewMatrixFromEyeLookUp(eye, look, up, viewMatrix);
                eye.modified = false;
                look.modified = false;
                up.modified = false;
            }
        },
        get viewMatrix() {
            self.updateViewMatrix();
            return viewMatrix;
        }
    };
    return self;
}
