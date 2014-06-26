define(["require", "exports"], function(require, exports) {
    var geometry = function (spec) {
        var that = {
            vertices: [],
            vertexIndices: [],
            colors: [],
            primitiveMode: function (gl) {
                return gl.TRIANGLES;
            }
        };

        return that;
    };
    
    return geometry;
});
