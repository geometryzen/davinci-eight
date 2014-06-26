define(["require", "exports", 'eight/cameras/camera'], function(require, exports, camera) {
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
            set position(position) {
                base.position = position;
            },
            get attitude() {
                return base.attitude;
            },
            set attitude(attitude) {
                base.attitude = attitude;
            },
            get aspect() {
                return aspect;
            },
            set aspect(value) {
                aspect = value;
            },
            updateProjectionMatrix: updateProjectionMatrix
        };

        var updateProjectionMatrix = function () {
        };

        return that;
    };

    
    return perspectiveCamera;
});
