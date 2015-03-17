define(["require", "exports", 'davinci-eight/cameras/camera', 'gl-matrix'], function (require, exports, camera, glMatrix) {
    var perspectiveCamera = function (fov, aspect, near, far) {
        if (fov === void 0) { fov = 50; }
        if (aspect === void 0) { aspect = 1; }
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 2000; }
        var base = camera();
        function updateProjectionMatrix() {
            glMatrix.mat4.perspective(base.projectionMatrix, fov, aspect, near, far);
        }
        var that = {
            // Delegate to the base camera.
            get position() {
                return base.position;
            },
            set position(value) {
                base.position = value;
            },
            get attitude() {
                return base.attitude;
            },
            set attitude(value) {
                base.attitude = value;
            },
            // Extensions
            get aspect() {
                return aspect;
            },
            set aspect(value) {
                aspect = value;
                updateProjectionMatrix();
            },
            get projectionMatrix() {
                return base.projectionMatrix;
            }
        };
        return that;
    };
    return perspectiveCamera;
});
