import FacetVisitor from '../core/FacetVisitor';
import Frustum from './Frustum';
import View from './View';
import createView from './createView';
import Matrix4 from '../math/Matrix4';
import VectorE3 from '../math/VectorE3';
import Vector1 from '../math/Vector1';
import Vector3 from '../math/Vector3';

/**
 * @function createFrustum
 * @constructor
 * @return {Frustum}
 */
export default function createFrustum(viewMatrixName: string, projectionMatrixName: string): Frustum {

    const base: View = createView(viewMatrixName);
    const left: Vector1 = new Vector1();
    const right: Vector1 = new Vector1();
    const bottom: Vector1 = new Vector1();
    const top: Vector1 = new Vector1();
    const near: Vector1 = new Vector1();
    const far: Vector1 = new Vector1();
    // TODO: We should immediately create with a frustum static constructor?
    const projectionMatrix: Matrix4 = Matrix4.one();

    function updateProjectionMatrix() {
        projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
    }

    updateProjectionMatrix();

    var self: Frustum = {
        setProperty(name: string, value: number[]): Frustum {
            return this;
        },
        // Delegate to the base camera.
        get eye(): Vector3 {
            return base.eye;
        },
        set eye(value: Vector3) {
            base.eye = value;
        },
        setEye(eye: VectorE3) {
            base.setEye(eye);
            return self;
        },
        get look(): Vector3 {
            return base.look;
        },
        set look(value: Vector3) {
            base.look = value;
        },
        setLook(look: VectorE3) {
            base.setLook(look);
            return self;
        },
        get up(): Vector3 {
            return base.up;
        },
        set up(up: Vector3) {
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
        get viewMatrix(): Matrix4 {
            return base.viewMatrix
        },
        set viewMatrix(viewMatrix: Matrix4) {
            base.viewMatrix = viewMatrix
        },
        setUniforms(visitor: FacetVisitor) {
            visitor.mat4(projectionMatrixName, projectionMatrix, false);
            base.setUniforms(visitor);
        }
    };

    return self;
}
