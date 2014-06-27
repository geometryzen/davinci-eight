define(["require", "exports", 'eight/cameras/camera', 'gl-matrix'], function(require, exports, camera, glMatrix) {
    var perspectiveCamera = function (fov, aspect, near, far) {
        if (typeof fov === "undefined") { fov = 50; }
        if (typeof aspect === "undefined") { aspect = 1; }
        if (typeof near === "undefined") { near = 0.1; }
        if (typeof far === "undefined") { far = 2000; }
        var base = camera();

        var that = {
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
            get projectionMatrix() {
                return base.projectionMatrix;
            },
            get aspect() {
                return aspect;
            },
            set aspect(value) {
                aspect = value;
            },
            updateProjectionMatrix: function () {
                glMatrix.mat4.perspective(base.projectionMatrix, fov, aspect, near, far);
            }
        };

        return that;
    };

    
    return perspectiveCamera;
});
