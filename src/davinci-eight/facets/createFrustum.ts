import { FacetVisitor } from '../core/FacetVisitor';
import Frustum from './Frustum';
import { Geometric3 } from '../math/Geometric3';
import createView from './createView';
import Matrix4 from '../math/Matrix4';
import VectorE3 from '../math/VectorE3';
import Vector1 from '../math/Vector1';

export default function createFrustum(viewMatrixName: string, projectionMatrixName: string): Frustum {

    const base = createView(viewMatrixName);
    const left: Vector1 = new Vector1();
    const right: Vector1 = new Vector1();
    const bottom: Vector1 = new Vector1();
    const top: Vector1 = new Vector1();
    const near: Vector1 = new Vector1();
    const far: Vector1 = new Vector1();

    const projectionMatrix: Matrix4 = Matrix4.one();

    function updateProjectionMatrix() {
        projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
    }

    updateProjectionMatrix();

    const self: Frustum = {
        get eye(): Geometric3 {
            return base.eye;
        },
        set eye(eye: Geometric3) {
            base.eye = eye;
        },
        setEye(eye: VectorE3) {
            base.setEye(eye);
            return self;
        },
        get look(): Geometric3 {
            return base.look;
        },
        set look(value: Geometric3) {
            base.look = value;
        },
        setLook(look: VectorE3) {
            base.setLook(look);
            return self;
        },
        get up(): Geometric3 {
            return base.up;
        },
        set up(up: Geometric3) {
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
        setUniforms(visitor: FacetVisitor): void {
            visitor.matrix4fv(projectionMatrixName, projectionMatrix.elements, false);
            base.setUniforms(visitor);
        },
        updateViewMatrix(): void {
            base.updateViewMatrix();
        },
        get viewMatrix(): Matrix4 {
            return base.viewMatrix;
        },
        set viewMatrix(viewMatrix: Matrix4) {
            base.viewMatrix = viewMatrix;
        }
    };
    return self;
}
