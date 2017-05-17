"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeString_1 = require("../checks/mustBeString");
var Geometric2_1 = require("../math/Geometric2");
var Geometric3_1 = require("../math/Geometric3");
var Spinor2_1 = require("../math/Spinor2");
var Spinor3_1 = require("../math/Spinor3");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
var Direction = (function () {
    function Direction(sourceName) {
        this.sourceName = mustBeString_1.mustBeString('sourceName', sourceName);
    }
    Direction.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var v = vertex.attributes[this.sourceName];
        if (v) {
            if (v instanceof Vector3_1.Vector3) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Spinor3_1.Spinor3) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Vector2_1.Vector2) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Spinor2_1.Spinor2) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Geometric3_1.Geometric3) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else if (v instanceof Geometric2_1.Geometric2) {
                vertex.attributes[this.sourceName] = v.normalize();
            }
            else {
                throw new Error("Expecting " + this.sourceName + " to be a Vector, Spinor, or Geometric");
            }
        }
        else {
            throw new Error("Vertex attribute " + this.sourceName + " was not found");
        }
    };
    return Direction;
}());
exports.Direction = Direction;
