define(["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/math/Matrix4', 'davinci-eight/core/Symbolic'], function (require, exports, view, Matrix4, Symbolic) {
    var UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
    var UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';
    /**
     * @class frustum
     * @constructor
     * @param left {number}
     * @param right {number}
     * @param bottom {number}
     * @param top {number}
     * @param near {number}
     * @param far {number}
     * @return {Frustum}
     */
    var frustum = function (left, right, bottom, top, near, far) {
        if (left === void 0) { left = -1; }
        if (right === void 0) { right = 1; }
        if (bottom === void 0) { bottom = -1; }
        if (top === void 0) { top = 1; }
        if (near === void 0) { near = 1; }
        if (far === void 0) { far = 1000; }
        var options = { viewMatrixName: Symbolic.UNIFORM_VIEW_MATRIX };
        var base = view(options);
        // TODO: We should immediately create with a frustum static constructor?
        var projectionMatrix = Matrix4.identity();
        function updateProjectionMatrix() {
            projectionMatrix.frustum(left, right, bottom, top, near, far);
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
                return left;
            },
            set left(value) {
                left = value;
                updateProjectionMatrix();
            },
            get right() {
                return right;
            },
            set right(value) {
                right = value;
                updateProjectionMatrix();
            },
            get bottom() {
                return bottom;
            },
            set bottom(value) {
                bottom = value;
                updateProjectionMatrix();
            },
            get top() {
                return top;
            },
            set top(value) {
                top = value;
                updateProjectionMatrix();
            },
            get near() {
                return near;
            },
            set near(value) {
                near = value;
                updateProjectionMatrix();
            },
            get far() {
                return far;
            },
            set far(value) {
                far = value;
                updateProjectionMatrix();
            },
            getUniformFloat: function (name) {
                return base.getUniformFloat(name);
            },
            getUniformMatrix2: function (name) {
                return base.getUniformMatrix2(name);
            },
            getUniformMatrix3: function (name) {
                return base.getUniformMatrix3(name);
            },
            getUniformMatrix4: function (name) {
                switch (name) {
                    case UNIFORM_PROJECTION_MATRIX_NAME: {
                        return { transpose: false, matrix4: projectionMatrix.elements };
                    }
                    default: {
                        return base.getUniformMatrix4(name);
                    }
                }
            },
            getUniformVector2: function (name) {
                return base.getUniformVector2(name);
            },
            getUniformVector3: function (name) {
                return base.getUniformVector3(name);
            },
            getUniformVector4: function (name) {
                return base.getUniformVector4(name);
            },
            getUniformMeta: function () {
                var uniforms = base.getUniformMeta();
                uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX] = { name: UNIFORM_PROJECTION_MATRIX_NAME, glslType: UNIFORM_PROJECTION_MATRIX_TYPE };
                return uniforms;
            }
        };
        return self;
    };
    return frustum;
});
