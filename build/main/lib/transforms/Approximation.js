"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeNumber_1 = require("../checks/mustBeNumber");
var Coords_1 = require("../math/Coords");
var Geometric2_1 = require("../math/Geometric2");
var Geometric3_1 = require("../math/Geometric3");
var Spinor2_1 = require("../math/Spinor2");
var Spinor3_1 = require("../math/Spinor3");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
/**
 * A `Transform` that calls the `approx` method on a `Vertex` attribute.
 */
var Approximation = (function () {
    /**
     * @param n The value that will be passed to the `approx` method.
     * @param names The names of the attributes that are affected.
     */
    function Approximation(n, names) {
        this.n = mustBeNumber_1.mustBeNumber('n', n);
        this.names = names;
    }
    Approximation.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var nLength = this.names.length;
        for (var k = 0; k < nLength; k++) {
            var aName = this.names[k];
            var v = vertex.attributes[aName];
            if (v instanceof Coords_1.Coords) {
                v.approx(this.n);
            }
            else if (v instanceof Vector3_1.Vector3) {
                v.approx(this.n);
            }
            else if (v instanceof Spinor3_1.Spinor3) {
                v.approx(this.n);
            }
            else if (v instanceof Vector2_1.Vector2) {
                v.approx(this.n);
            }
            else if (v instanceof Spinor2_1.Spinor2) {
                v.approx(this.n);
            }
            else if (v instanceof Geometric2_1.Geometric2) {
                v.approx(this.n);
            }
            else if (v instanceof Geometric3_1.Geometric3) {
                v.approx(this.n);
            }
            else {
                throw new Error("Expecting " + aName + " to be a VectorN");
            }
        }
    };
    return Approximation;
}());
exports.Approximation = Approximation;
