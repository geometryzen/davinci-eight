var view = require('davinci-eight/cameras/view');
var Matrix4 = require('davinci-eight/math/Matrix4');
var Vector1 = require('../math/Vector1');
/**
 * @class frustum
 * @constructor
 * @return {Frustum}
 */
var frustum = function (viewMatrixName, projectionMatrixName) {
    var base = view(viewMatrixName);
    var left = new Vector1();
    var right = new Vector1();
    var bottom = new Vector1();
    var top = new Vector1();
    var near = new Vector1();
    var far = new Vector1();
    // TODO: We should immediately create with a frustum static constructor?
    var projectionMatrix = Matrix4.identity();
    function updateProjectionMatrix() {
        projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
    }
    updateProjectionMatrix();
    var self = {
        // Delegate to the base camera.
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
        set up(up) {
            base.setUp(up);
        },
        setUp: function (up) {
            base.setUp(up);
            return self;
        },
        get left() {
            return left.x;
        },
        set left(value) {
            left.x = value;
            updateProjectionMatrix();
        },
        get right() {
            return right.x;
        },
        set right(value) {
            right.x = value;
            updateProjectionMatrix();
        },
        get bottom() {
            return bottom.x;
        },
        set bottom(value) {
            bottom.x = value;
            updateProjectionMatrix();
        },
        get top() {
            return top.x;
        },
        set top(value) {
            top.x = value;
            updateProjectionMatrix();
        },
        get near() {
            return near.x;
        },
        set near(value) {
            near.x = value;
            updateProjectionMatrix();
        },
        get far() {
            return far.x;
        },
        set far(value) {
            far.x = value;
            updateProjectionMatrix();
        },
        accept: function (visitor) {
            visitor.uniformMatrix4(projectionMatrixName, false, projectionMatrix);
            base.accept(visitor);
        }
    };
    return self;
};
module.exports = frustum;
