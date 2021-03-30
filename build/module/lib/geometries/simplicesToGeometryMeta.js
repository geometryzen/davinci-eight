import { expectArg } from '../checks/expectArg';
import { isDefined } from '../checks/isDefined';
import { dataLength } from './dataLength';
import { Simplex } from './Simplex';
/**
 * @hidden
 */
function stringify(thing, space) {
    var cache = [];
    return JSON.stringify(thing, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, space);
}
/**
 * Returns undefined (void 0) for an empty geometry.
 * @hidden
 */
export function simplicesToGeometryMeta(geometry) {
    var kValueOfSimplex = void 0;
    var knowns = {};
    var geometryLen = geometry.length;
    for (var i = 0; i < geometryLen; i++) {
        var simplex = geometry[i];
        if (!(simplex instanceof Simplex)) {
            expectArg('simplex', simplex).toSatisfy(false, "Every element must be a Simplex @ simplicesToGeometryMeta(). Found " + stringify(simplex, 2));
        }
        var vertices = simplex.vertices;
        // TODO: Check consistency of k-values.
        kValueOfSimplex = simplex.k;
        for (var j = 0, vsLen = vertices.length; j < vsLen; j++) {
            var vertex = vertices[j];
            var attributes = vertex.attributes;
            var keys = Object.keys(attributes);
            var keysLen = keys.length;
            for (var k = 0; k < keysLen; k++) {
                var key = keys[k];
                var value = attributes[key];
                var dLength = dataLength(value);
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
    // isDefined is necessary because k = -1, 0, 1, 2, 3, ... are legal and 0 is falsey.
    if (isDefined(kValueOfSimplex)) {
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
