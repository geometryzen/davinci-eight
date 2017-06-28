"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createView_1 = require("./createView");
var Matrix4_1 = require("../math/Matrix4");
var Vector1_1 = require("../math/Vector1");
function createFrustum(viewMatrixName, projectionMatrixName) {
    var base = createView_1.createView({ viewMatrixName: viewMatrixName });
    var left = new Vector1_1.Vector1();
    var right = new Vector1_1.Vector1();
    var bottom = new Vector1_1.Vector1();
    var top = new Vector1_1.Vector1();
    var near = new Vector1_1.Vector1();
    var far = new Vector1_1.Vector1();
    var projectionMatrix = Matrix4_1.Matrix4.one.clone();
    function updateProjectionMatrix() {
        projectionMatrix.frustum(left.x, right.x, bottom.x, top.x, near.x, far.x);
    }
    updateProjectionMatrix();
    var self = {
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
        setUniforms: function (visitor) {
            visitor.matrix4fv(projectionMatrixName, projectionMatrix.elements, false);
            base.setUniforms(visitor);
        },
        updateViewMatrix: function () {
            base.updateViewMatrix();
        },
        get viewMatrix() {
            return base.viewMatrix;
        },
        set viewMatrix(viewMatrix) {
            base.viewMatrix = viewMatrix;
        }
    };
    return self;
}
exports.createFrustum = createFrustum;
