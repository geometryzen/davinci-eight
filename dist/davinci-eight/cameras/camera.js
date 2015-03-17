define(["require", "exports", 'davinci-eight/core/object3D', 'gl-matrix'], function (require, exports, object3D, glMatrix) {
    /**
     * @class camera
     */
    var camera = function () {
        var base = object3D();
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
            projectionMatrix: glMatrix.mat4.create()
        };
        return that;
    };
    return camera;
});
