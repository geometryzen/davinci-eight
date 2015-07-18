define(["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/math/Matrix4', 'davinci-eight/core/Symbolic'], function (require, exports, view, Matrix4, Symbolic) {
    var UNIFORM_PROJECTION_MATRIX_NAME = 'uProjectionMatrix';
    var UNIFORM_PROJECTION_MATRIX_TYPE = 'mat4';
    /**
     * @class perspective
     * @constructor
     * @param fov {number}
     * @param aspect {number}
     * @param near {number}
     * @param far {number}
     * @return {LinearPerspectiveCamera}
     */
    var perspective = function (fov, aspect, near, far) {
        if (fov === void 0) { fov = 75 * Math.PI / 180; }
        if (aspect === void 0) { aspect = 1; }
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 2000; }
        var base = view();
        var projectionMatrix = new Matrix4();
        function updateProjectionMatrix() {
            projectionMatrix.perspective(fov, aspect, near, far);
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
            get fov() {
                return fov;
            },
            set fov(value) {
                fov = value;
                updateProjectionMatrix();
            },
            get aspect() {
                return aspect;
            },
            set aspect(value) {
                aspect = value;
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
    return perspective;
});
