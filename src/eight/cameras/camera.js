define(["require", "exports", 'eight/core/object3D'], function(require, exports, object3D) {
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
            projectionMatrix: mat4.create()
        };

        return that;
    };

    
    return camera;
});
