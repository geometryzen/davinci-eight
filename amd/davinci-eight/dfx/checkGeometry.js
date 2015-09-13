define(["require", "exports", '../checks/expectArg', '../dfx/Simplex'], function (require, exports, expectArg, Simplex) {
    function checkGeometry(geometry) {
        var knowns = {};
        var geometryLen = geometry.length;
        for (var i = 0; i < geometryLen; i++) {
            var simplex = geometry[i];
            expectArg('simplex', simplex).toSatisfy(simplex instanceof Simplex, "Every element must be a Simplex");
            var vertices = simplex.vertices;
            for (var j = 0, vsLen = vertices.length; j < vsLen; j++) {
                var vertex = vertices[j];
                var attributes = vertex.attributes;
                var keys = Object.keys(attributes);
                var keysLen = keys.length;
                for (var k = 0; k < keysLen; k++) {
                    var key = keys[k];
                    var vector = attributes[key];
                    var known = knowns[key];
                    if (known) {
                        if (known.size !== vector.length) {
                            throw new Error("Something is rotten in Denmark!");
                        }
                    }
                    else {
                        knowns[key] = { size: vector.length };
                    }
                }
            }
        }
        return knowns;
    }
    return checkGeometry;
});
