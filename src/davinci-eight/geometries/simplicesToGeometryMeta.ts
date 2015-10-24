import dataLength = require('../geometries/dataLength')
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
//import isInteger = require('../checks/isInteger');
import GeometryMeta = require('../geometries/GeometryMeta');
import Simplex = require('../geometries/Simplex');
import Vertex = require('../geometries/Vertex');
import VectorN = require('../math/VectorN');

function stringify(thing: any, space: any): string {
    let cache: any[] = [];
    return JSON.stringify(thing, function(key: string, value: any) {
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
    cache = null; // Enable garbage collection  
}

/**
 * Returns undefined (void 0) for an empty geometry.
 */
function simplicesToGeometryMeta(geometry: Simplex[]): GeometryMeta {
    let kValueOfSimplex: number = void 0;
    let knowns: { [key: string]: { size: number } } = {};
    let geometryLen = geometry.length;
    for (var i = 0; i < geometryLen; i++) {
        let simplex: Simplex = geometry[i];
        if (!(simplex instanceof Simplex)) {
            expectArg('simplex', simplex).toSatisfy(false, "Every element must be a Simplex @ simplicesToGeometryMeta(). Found " + stringify(simplex, 2));
        }
        let vertices: Vertex[] = simplex.vertices;
        // TODO: Check consistency of k-values.
        kValueOfSimplex = simplex.k;
        for (var j = 0, vsLen = vertices.length; j < vsLen; j++) {
            let vertex: Vertex = vertices[j];
            let attributes = vertex.attributes;
            let keys: string[] = Object.keys(attributes);
            let keysLen = keys.length;
            for (var k = 0; k < keysLen; k++) {
                let key = keys[k];
                let value: VectorN<number> = attributes[key];
                let dLength = dataLength(value)
                let known = knowns[key];
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
        let info: GeometryMeta = {
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

export = simplicesToGeometryMeta;
