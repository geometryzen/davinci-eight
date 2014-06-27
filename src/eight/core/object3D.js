define(["require", "exports", 'eight/math/e3ga/scalarE3', 'eight/math/e3ga/vectorE3'], function(require, exports, scalarE3, vectorE3) {
    var object3D = function () {
        var that = {
            position: vectorE3(0, 0, 0),
            attitude: scalarE3(1),
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
