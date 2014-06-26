// The compiler needs the reference comment to find the eightAPI module.
/// <reference path="./things.d" />
// We're using an interface so it vanishes in the generated JavaScript.

import things = require('eightAPI');

var geometry = function(spec?): things.Geometry {

    var that =
        {
            vertices: [],
            vertexIndices: [],
            colors: [],
            primitiveMode: function(gl) {
                return gl.TRIANGLES;
            }
        };

    return that;
};
export = geometry;