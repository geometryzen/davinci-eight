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
        var base = view();
        var projectionMatrix = new Matrix4();
        function updateProjectionMatrix() {
            projectionMatrix.frustum(left, right, bottom, top, near, far);
        }
        updateProjectionMatrix();
        var publicAPI = {
            // Delegate to the base camera.
            get eye() {
                return base.eye;
            },
            set eye(value) {
                base.eye = value;
            },
            get look() {
                return base.look;
            },
            set look(value) {
                base.look = value;
            },
            get up() {
                return base.up;
            },
            set up(value) {
                base.up = value;
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
            getUniformVector3: function (name) {
                return base.getUniformVector3(name);
            },
            getUniformMetaInfos: function () {
                var uniforms = base.getUniformMetaInfos();
                uniforms[Symbolic.UNIFORM_PROJECTION_MATRIX] = { name: UNIFORM_PROJECTION_MATRIX_NAME, type: UNIFORM_PROJECTION_MATRIX_TYPE };
                return uniforms;
            }
        };
        return publicAPI;
    };
    return frustum;
});
