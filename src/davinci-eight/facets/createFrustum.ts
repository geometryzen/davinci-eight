import FacetVisitor from '../core/FacetVisitor';
import Frustum from './Frustum';
import View from './View';
import createView from './createView';
import Mat4R from '../math/Mat4R';
import VectorE3 from '../math/VectorE3';
import R1m from '../math/R1m';
import R3m from '../math/R3m';

/**
 * @function createFrustum
 * @constructor
 * @return {Frustum}
 */
export default function createFrustum(viewMatrixName: string, projectionMatrixName: string): Frustum {

    const base: View = createView(viewMatrixName);
    const left: R1m = new R1m();
    const right: R1m = new R1m();
    const bottom: R1m = new R1m();
    const top: R1m = new R1m();
    const near: R1m = new R1m();
    const far: R1m = new R1m();
    // TODO: We should immediately create with a frustum static constructor?
    const projectionMatrix: Mat4R = Mat4R.one();

    function updateProjectionMatrix() {
        projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
    }

    updateProjectionMatrix();

    var self: Frustum = {
        setProperty(name: string, value: number[]): Frustum {
            return this;
        },
        // Delegate to the base camera.
        get eye(): R3m {
            return base.eye;
        },
        set eye(value: R3m) {
            base.eye = value;
        },
        setEye(eye: VectorE3) {
            base.setEye(eye);
            return self;
        },
        get look(): R3m {
            return base.look;
        },
        set look(value: R3m) {
            base.look = value;
        },
        setLook(look: VectorE3) {
            base.setLook(look);
            return self;
        },
        get up(): R3m {
            return base.up;
        },
        set up(up: R3m) {
            base.setUp(up);
        },
        setUp(up: VectorE3): Frustum {
            base.setUp(up);
            return self;
        },
        get left(): number {
            return left.x;
        },
        set left(value: number) {
            left.x = value;
            updateProjectionMatrix();
        },
        get right(): number {
            return right.x;
        },
        set right(value: number) {
            right.x = value;
            updateProjectionMatrix();
        },
        get bottom(): number {
            return bottom.x;
        },
        set bottom(value: number) {
            bottom.x = value;
            updateProjectionMatrix();
        },
        get top(): number {
            return top.x;
        },
        set top(value: number) {
            top.x = value;
            updateProjectionMatrix();
        },
        get near(): number {
            return near.x;
        },
        set near(value: number) {
            near.x = value;
            updateProjectionMatrix();
        },
        get far(): number {
            return far.x;
        },
        set far(value: number) {
            far.x = value;
            updateProjectionMatrix();
        },
        get viewMatrix(): Mat4R {
            return base.viewMatrix
        },
        set viewMatrix(viewMatrix: Mat4R) {
            base.viewMatrix = viewMatrix
        },
        setUniforms(visitor: FacetVisitor) {
            visitor.mat4(projectionMatrixName, projectionMatrix, false);
            base.setUniforms(visitor);
        }
    };

    return self;
}
