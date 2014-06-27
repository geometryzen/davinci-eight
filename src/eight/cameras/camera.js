define(["require", "exports", 'eight/core/object3D', 'gl-matrix'], function(require, exports, object3D, glMatrix) {
    var camera = function () {
        var base = object3D();

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
            projectionMatrix: glMatrix.mat4.create()
        };

        return that;
    };

    
    return camera;
});
