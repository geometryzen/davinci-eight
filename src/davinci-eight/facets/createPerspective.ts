import {FacetVisitor} from '../core/FacetVisitor';
import Perspective from './Perspective';
import View from './View';
import createView from './createView';
import Matrix4 from '../math/Matrix4';
import {Geometric3} from '../math/Geometric3';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import VectorE3 from '../math/VectorE3';
import Vector1 from '../math/Vector1';
import isUndefined from '../checks/isUndefined';
import mustBeNumber from '../checks/mustBeNumber';
import computePerspectiveMatrix from './perspectiveMatrix';

export default function createPerspective(options: { fov?: number; aspect?: number; near?: number; far?: number; projectionMatrixName?: string; viewMatrixName?: string; } = {}): Perspective {

    const fov: Vector1 = new Vector1([isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov]);
    const aspect: Vector1 = new Vector1([isUndefined(options.aspect) ? 1 : options.aspect]);
    const near: Vector1 = new Vector1([isUndefined(options.near) ? 0.1 : options.near]);
    const far: Vector1 = new Vector1([mustBeNumber('options.far', isUndefined(options.far) ? 2000 : options.far)]);
    const projectionMatrixName = isUndefined(options.projectionMatrixName) ? GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;

    const base: View = createView(options)
    const projectionMatrix: Matrix4 = Matrix4.one()
    let matrixNeedsUpdate = true

    const self: Perspective = {
        get eye(): Geometric3 {
            return base.eye
        },
        set eye(value: Geometric3) {
            base.eye = value;
        },
        setEye(eye: VectorE3) {
            base.setEye(eye)
            return self
        },
        get look(): Geometric3 {
            return base.look
        },
        set look(value: Geometric3) {
            base.look = value
        },
        setLook(look: VectorE3) {
            base.setLook(look)
            return self
        },
        get up(): Geometric3 {
            return base.up
        },
        set up(value: Geometric3) {
            base.up = value
        },
        setUp(up: VectorE3) {
            base.setUp(up)
            return self
        },
        get fov(): number {
            return fov.x
        },
        set fov(value: number) {
            self.setFov(value)
        },
        setFov(value: number) {
            mustBeNumber('fov', value)
            matrixNeedsUpdate = matrixNeedsUpdate || fov.x !== value
            fov.x = value
            return self
        },
        get aspect(): number {
            return aspect.x
        },
        set aspect(value: number) {
            self.setAspect(value)
        },
        setAspect(value: number) {
            mustBeNumber('aspect', value)
            matrixNeedsUpdate = matrixNeedsUpdate || aspect.x !== value
            aspect.x = value
            return self
        },
        get near(): number {
            return near.x
        },
        set near(value: number) {
            self.setNear(value)
        },
        setNear(value: number) {
            if (value !== near.x) {
                near.x = value
                matrixNeedsUpdate = true
            }
            return self
        },
        get far(): number {
            return far.x
        },
        set far(value: number) {
            self.setFar(value)
        },
        setFar(value: number) {
            if (value !== far.x) {
                far.x = value
                matrixNeedsUpdate = true
            }
            return self
        },

        setUniforms(visitor: FacetVisitor) {
            self.updateProjectionMatrix();
            visitor.matrix4fv(projectionMatrixName, projectionMatrix.elements, false)
            base.setUniforms(visitor)
        },

        get projectionMatrix(): Matrix4 {
            self.updateProjectionMatrix();
            return projectionMatrix;
        },

        updateProjectionMatrix(): void {
            if (matrixNeedsUpdate) {
                computePerspectiveMatrix(fov.x, aspect.x, near.x, far.x, projectionMatrix)
                matrixNeedsUpdate = false
            }
        },

        updateViewMatrix(): void {
            base.updateViewMatrix();
        },

        get viewMatrix(): Matrix4 {
            return base.viewMatrix;
        },

        set viewMatrix(value: Matrix4) {
            base.viewMatrix = value;
        }
    };
    return self;
}
