// The compiler needs the reference comment to find the eightAPI module.
/// <reference path="./things.d" />
// We're using an interface so it vanishes in the generated JavaScript.

import eight = require('eightAPI');

var geometry = function(spec?): eight.Geometry {

    var that =
        {
            primitives: [],
            vertices: [],
            vertexIndices: [],
            colors: [],
            normals: [],
            primitiveMode: function(gl: WebGLRenderingContext) {
                return gl.TRIANGLES;
            }
        };

    return that;
};
export = geometry;