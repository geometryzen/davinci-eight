define(["require", "exports", 'eight/math/e3ga/euclidean3'], function(require, exports, euclidean3) {
    var object3D = function () {
        var that = {
            position: euclidean3(),
            attitude: euclidean3({ w: 1 }),
            onContextGain: function (gl) {
                console.error("Missing onContextGain function");
            },
            onContextLoss: function () {
                console.error("Missing onContextLoss function");
            },
            tearDown: function () {
                console.error("Missing tearDown function");
            },
            updateMatrix: function () {
                console.error("Missing updateMatrix function");
            },
            draw: function (projectionMatrix) {
                console.error("Missing draw function");
            }
        };

        return that;
    };

    
    return object3D;
});
