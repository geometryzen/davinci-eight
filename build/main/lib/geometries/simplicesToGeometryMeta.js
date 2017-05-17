"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dataLength_1 = require("./dataLength");
var expectArg_1 = require("../checks/expectArg");
var isDefined_1 = require("../checks/isDefined");
var Simplex_1 = require("./Simplex");
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
 */
function simplicesToGeometryMeta(geometry) {
    var kValueOfSimplex = void 0;
    var knowns = {};
    var geometryLen = geometry.length;
    for (var i = 0; i < geometryLen; i++) {
        var simplex = geometry[i];
        if (!(simplex instanceof Simplex_1.Simplex)) {
            expectArg_1.expectArg('simplex', simplex).toSatisfy(false, "Every element must be a Simplex @ simplicesToGeometryMeta(). Found " + stringify(simplex, 2));
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
                var dLength = dataLength_1.dataLength(value);
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
    if (isDefined_1.isDefined(kValueOfSimplex)) {
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
exports.simplicesToGeometryMeta = simplicesToGeometryMeta;
