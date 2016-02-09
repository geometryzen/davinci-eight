define(["require", "exports", '../geometries/dataLength', '../checks/expectArg', '../checks/isDefined', '../geometries/Simplex'], function (require, exports, dataLength_1, expectArg_1, isDefined_1, Simplex_1) {
    function stringify(thing, space) {
        var cache = [];
        return JSON.stringify(thing, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }
            return value;
        }, space);
    }
    function simplicesToGeometryMeta(geometry) {
        var kValueOfSimplex = void 0;
        var knowns = {};
        var geometryLen = geometry.length;
        for (var i = 0; i < geometryLen; i++) {
            var simplex = geometry[i];
            if (!(simplex instanceof Simplex_1.default)) {
                expectArg_1.default('simplex', simplex).toSatisfy(false, "Every element must be a Simplex @ simplicesToGeometryMeta(). Found " + stringify(simplex, 2));
            }
            var vertices = simplex.vertices;
            kValueOfSimplex = simplex.k;
            for (var j = 0, vsLen = vertices.length; j < vsLen; j++) {
                var vertex = vertices[j];
                var attributes = vertex.attributes;
                var keys = Object.keys(attributes);
                var keysLen = keys.length;
                for (var k = 0; k < keysLen; k++) {
                    var key = keys[k];
                    var value = attributes[key];
                    var dLength = dataLength_1.default(value);
                    var known = knowns[key];
                    if (known) {
                        if (known.size !== dLength) {
                            throw new Error("Something is rotten in Denmark!");
                        }
                    }
                    else {
                        knowns[key] = { size: dLength };
                    }
                }
            }
        }
        if (isDefined_1.default(kValueOfSimplex)) {
            var info = {
                get attributes() {
                    return knowns;
                },
                get k() {
                    return kValueOfSimplex;
                }
            };
            return info;
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = simplicesToGeometryMeta;
});
