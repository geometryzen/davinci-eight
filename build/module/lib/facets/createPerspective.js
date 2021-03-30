import { isUndefined } from '../checks/isUndefined';
import { mustBeNumber } from '../checks/mustBeNumber';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Matrix4 } from '../math/Matrix4';
import { Vector1 } from '../math/Vector1';
import { createView } from './createView';
import { perspectiveMatrix as computePerspectiveMatrix } from './perspectiveMatrix';
/**
 * @hidden
 */
export function createPerspective(options) {
    if (options === void 0) { options = {}; }
    var fov = new Vector1([isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov]);
    var aspect = new Vector1([isUndefined(options.aspect) ? 1 : options.aspect]);
    var near = new Vector1([isUndefined(options.near) ? 0.1 : options.near]);
    var far = new Vector1([mustBeNumber('options.far', isUndefined(options.far) ? 2000 : options.far)]);
    var projectionMatrixName = isUndefined(options.projectionMatrixName) ? GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
    var base = createView(options);
    var projectionMatrix = Matrix4.one.clone();
    var matrixNeedsUpdate = true;
    var self = {
        get eye() {
            return base.eye;
        },
        set eye(value) {
            base.eye = value;
        },
        setEye: function (eye) {
            base.setEye(eye);
            return self;
        },
        get look() {
            return base.look;
        },
        set look(value) {
            base.look = value;
        },
        setLook: function (look) {
            base.setLook(look);
            return self;
        },
        get up() {
            return base.up;
        },
        set up(value) {
            base.up = value;
        },
        setUp: function (up) {
            base.setUp(up);
            return self;
        },
        get fov() {
            return fov.x;
        },
        set fov(value) {
            self.setFov(value);
        },
        setFov: function (value) {
            mustBeNumber('fov', value);
            matrixNeedsUpdate = matrixNeedsUpdate || fov.x !== value;
            fov.x = value;
            return self;
        },
        get aspect() {
            return aspect.x;
        },
        set aspect(value) {
            self.setAspect(value);
        },
        setAspect: function (value) {
            mustBeNumber('aspect', value);
            matrixNeedsUpdate = matrixNeedsUpdate || aspect.x !== value;
            aspect.x = value;
            return self;
        },
        get near() {
            return near.x;
        },
        set near(value) {
            self.setNear(value);
        },
        setNear: function (value) {
            if (value !== near.x) {
                near.x = value;
                matrixNeedsUpdate = true;
            }
            return self;
        },
        get far() {
            return far.x;
        },
        set far(value) {
            self.setFar(value);
        },
        setFar: function (value) {
            if (value !== far.x) {
                far.x = value;
                matrixNeedsUpdate = true;
            }
            return self;
        },
        setUniforms: function (visitor) {
            self.updateProjectionMatrix();
            visitor.matrix4fv(projectionMatrixName, projectionMatrix.elements, false);
            base.setUniforms(visitor);
        },
        get projectionMatrix() {
            self.updateProjectionMatrix();
            return projectionMatrix;
        },
        updateProjectionMatrix: function () {
            if (matrixNeedsUpdate) {
                computePerspectiveMatrix(fov.x, aspect.x, near.x, far.x, projectionMatrix);
                matrixNeedsUpdate = false;
            }
        },
        updateViewMatrix: function () {
            base.updateViewMatrix();
        },
        get viewMatrix() {
            return base.viewMatrix;
        },
        set viewMatrix(value) {
            base.viewMatrix = value;
        }
    };
    return self;
}
