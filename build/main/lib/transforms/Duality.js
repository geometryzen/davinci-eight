"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeBoolean_1 = require("../checks/mustBeBoolean");
var mustBeString_1 = require("../checks/mustBeString");
var notImplemented_1 = require("../i18n/notImplemented");
var Spinor2_1 = require("../math/Spinor2");
var Spinor3_1 = require("../math/Spinor3");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
/**
 * Applies a duality transformation to the specified attributes of a vertex, creating a new attribute.
 * The convention used is pre-multiplication by the pseudoscalar.
 */
var Duality = /** @class */ (function () {
    function Duality(sourceName, outputName, changeSign, removeSource) {
        this.sourceName = mustBeString_1.mustBeString('sourceName', sourceName);
        this.outputName = mustBeString_1.mustBeString('outputName', outputName);
        this.changeSign = mustBeBoolean_1.mustBeBoolean('changeSign', changeSign);
        this.removeSource = mustBeBoolean_1.mustBeBoolean('removeSource', removeSource);
    }
    Duality.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var v = vertex.attributes[this.sourceName];
        if (v) {
            if (v instanceof Vector3_1.Vector3) {
                var spinor = Spinor3_1.Spinor3.dual(v, this.changeSign);
                vertex.attributes[this.outputName] = spinor;
            }
            else if (v instanceof Spinor3_1.Spinor3) {
                var vector = Vector3_1.Vector3.dual(v, this.changeSign);
                vertex.attributes[this.outputName] = vector;
            }
            else if (v instanceof Vector2_1.Vector2) {
                throw new Error(notImplemented_1.notImplemented('dual(vector: Vector2)').message);
            }
            else if (v instanceof Spinor2_1.Spinor2) {
                throw new Error(notImplemented_1.notImplemented('dual(spinor: Spinor2)').message);
            }
            else {
                throw new Error("Expecting " + this.sourceName + " to be a Vector3 or Spinor");
            }
            if (this.removeSource) {
                delete vertex.attributes[this.sourceName];
            }
        }
        else {
            throw new Error("Vertex attribute " + this.sourceName + " was not found");
        }
    };
    return Duality;
}());
exports.Duality = Duality;
