//
// object3D.ts
//
// This is an example of a functional constructor (Douglas Crockford).
// We make no attempt to use an interface to get named typing.
// This seems to work better in the generated *.d.ts files.
// When we try to use an interface, the reference comments or imports are incorrect.
//
import scalarE3 = require('eight/math/e3ga/scalarE3');
import vectorE3 = require('eight/math/e3ga/vectorE3');
import Euclidean3 = require('eight/math/e3ga/Euclidean3');

var object3D = function() {

    var that =
        {
            position: vectorE3(0, 0, 0),
            attitude: scalarE3(1),
            onContextGain: function(gl) {
                console.error("Missing onContextGain function");
            },
            onContextLoss: function() {
                console.error("Missing onContextLoss function");
            },
            tearDown: function() {
                console.error("Missing tearDown function");
            },
            updateMatrix: function() {
                console.error("Missing updateMatrix function");
            },
            draw: function(projectionMatrix) {
                console.error("Missing draw function");
            }
        };

    return that;
};

export = object3D;
