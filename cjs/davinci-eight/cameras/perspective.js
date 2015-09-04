var view = require('davinci-eight/cameras/view');
var Matrix4 = require('davinci-eight/math/Matrix4');
var Symbolic = require('davinci-eight/core/Symbolic');
var Vector1 = require('../math/Vector1');
var isUndefined = require('../checks/isUndefined');
var expectArg = require('../checks/expectArg');
var computePerspectiveMatrix = require('../cameras/perspectiveMatrix');
//let UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
/**
 * @class perspective
 * @constructor
 * @param fov {number}
 * @param aspect {number}
 * @param near {number}
 * @param far {number}
 * @return {Perspective}
 */
var perspective = function (options) {
    options = options || {};
    var fov = new Vector1([isUndefined(options.fov) ? 75 * Math.PI / 180 : options.fov]);
    var aspect = new Vector1([isUndefined(options.aspect) ? 1 : options.aspect]);
    var near = new Vector1([isUndefined(options.near) ? 0.1 : options.near]);
    var far = new Vector1([expectArg('options.far', isUndefined(options.far) ? 2000 : options.far).toBeNumber().value]);
    var projectionMatrixName = isUndefined(options.projectionMatrixName) ? Symbolic.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
    var base = view(options);
    var projectionMatrix = Matrix4.identity();
    var matrixNeedsUpdate = true;
    var self = {
        // Delegate to the base camera.
        get eye() {
            return base.eye;
        },
        set eye(eye) {
            base.eye = eye;
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
            expectArg('fov', value).toBeNumber();
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
            expectArg('aspect', value).toBeNumber();
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
            expectArg('near', value).toBeNumber();
            matrixNeedsUpdate = matrixNeedsUpdate || near.x !== value;
            near.x = value;
            return self;
        },
        get far() {
            return far.x;
        },
        set far(value) {
            self.setFar(value);
        },
        setFar: function (value) {
            expectArg('far', value).toBeNumber();
            matrixNeedsUpdate = matrixNeedsUpdate || far.x !== value;
            far.x = value;
            return self;
        },
        accept: function (visitor) {
            if (matrixNeedsUpdate) {
                computePerspectiveMatrix(fov.x, aspect.x, near.x, far.x, projectionMatrix);
                matrixNeedsUpdate = false;
            }
            visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix);
            base.accept(visitor);
        }
    };
    return self;
};
module.exports = perspective;
