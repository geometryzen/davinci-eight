//
// createPerspective.ts
//
import FacetVisitor from '../core/FacetVisitor';
import Perspective from './Perspective';
import View from './View';
import createView from './createView';
import Mat4R from '../math/Mat4R';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import VectorE3 from '../math/VectorE3';
import R1 from '../math/R1';
import R3 from '../math/R3';
import isUndefined from '../checks/isUndefined';
import mustBeNumber from '../checks/mustBeNumber';
import computePerspectiveMatrix from './perspectiveMatrix';

/**
 * @function createPerspective
 * @constructor
 * @param fov {number}
 * @param aspect {number}
 * @param near {number}
 * @param far {number}
 * @return {Perspective}
 */
export default function createPerspective(options?: { fov?: number; aspect?: number; near?: number; far?: number; projectionMatrixName?: string; viewMatrixName?: string; }): Perspective {

    options = options || {};
    const fov: R1 = new R1([isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov]);
    const aspect: R1 = new R1([isUndefined(options.aspect) ? 1 : options.aspect]);
    const near: R1 = new R1([isUndefined(options.near) ? 0.1 : options.near]);
    const far: R1 = new R1([mustBeNumber('options.far', isUndefined(options.far) ? 2000 : options.far)]);
    const projectionMatrixName = isUndefined(options.projectionMatrixName) ? GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;

    const base: View = createView(options)
    const projectionMatrix: Mat4R = Mat4R.one()
    var matrixNeedsUpdate = true

    const self: Perspective = {
        setProperty(name: string, value: number[]): Perspective {
            return self;
        },
        // Delegate to the base camera.
        get eye(): R3 {
            return base.eye;
        },
        set eye(eye: R3) {
            base.eye = eye;
        },
        setEye(eye: VectorE3) {
            base.setEye(eye);
            return self;
        },
        get look(): R3 {
            return base.look;
        },
        set look(value: R3) {
            base.look = value;
        },
        setLook(look: VectorE3) {
            base.setLook(look);
            return self;
        },
        get up(): R3 {
            return base.up;
        },
        set up(value: R3) {
            base.up = value;
        },
        setUp(up: VectorE3) {
            base.setUp(up);
            return self;
        },
        get fov(): number {
            return fov.x;
        },
        set fov(value: number) {
            self.setFov(value);
        },
        setFov(value: number) {
            mustBeNumber('fov', value);
            matrixNeedsUpdate = matrixNeedsUpdate || fov.x !== value;
            fov.x = value;
            return self;
        },
        get aspect(): number {
            return aspect.x;
        },
        set aspect(value: number) {
            self.setAspect(value);
        },
        setAspect(value: number) {
            mustBeNumber('aspect', value);
            matrixNeedsUpdate = matrixNeedsUpdate || aspect.x !== value;
            aspect.x = value;
            return self;
        },
        get near(): number {
            return near.x;
        },
        set near(value: number) {
            self.setNear(value);
        },
        setNear(value: number) {
            if (value !== near.x) {
                near.x = value;
                matrixNeedsUpdate = true;
            }
            return self;
        },
        get far(): number {
            return far.x;
        },
        set far(value: number) {
            self.setFar(value);
        },
        setFar(value: number) {
            if (value !== far.x) {
                far.x = value;
                matrixNeedsUpdate = true;
            }
            return self;
        },
        setUniforms(visitor: FacetVisitor) {
            if (matrixNeedsUpdate) {
                computePerspectiveMatrix(fov.x, aspect.x, near.x, far.x, projectionMatrix);
                matrixNeedsUpdate = false;
            }
            visitor.mat4(projectionMatrixName, projectionMatrix, false);
            base.setUniforms(visitor);
        }
    };

    return self;
}
