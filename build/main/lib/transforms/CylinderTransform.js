"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeNumber_1 = require("../checks/mustBeNumber");
var mustBeString_1 = require("../checks/mustBeString");
var Spinor3_1 = require("../math/Spinor3");
var Vector3_1 = require("../math/Vector3");
/**
 *
 */
var CylinderTransform = (function () {
    /**
     * @param sliceAngle
     * @param aPosition The name to use for the position attribute.
     * @param aTangent The name to use for the tangent plane attribute.
     */
    function CylinderTransform(height, cutLine, clockwise, sliceAngle, orientation, aPosition, aTangent) {
        this.height = Vector3_1.Vector3.copy(height);
        this.cutLine = Vector3_1.Vector3.copy(cutLine);
        this.generator = Spinor3_1.Spinor3.dual(this.height.clone().normalize(), clockwise);
        this.sliceAngle = mustBeNumber_1.mustBeNumber('sliceAngle', sliceAngle);
        this.orientation = mustBeNumber_1.mustBeNumber('orientation', orientation);
        this.aPosition = mustBeString_1.mustBeString('aPosition', aPosition);
        this.aTangent = mustBeString_1.mustBeString('aTangent', aTangent);
    }
    CylinderTransform.prototype.exec = function (vertex, i, j, iLength, jLength) {
        var uSegments = iLength - 1;
        var u = i / uSegments;
        var vSegments = jLength - 1;
        var v = j / vSegments;
        var rotor = this.generator.clone().scale(-this.sliceAngle * u / 2).exp();
        /**
         * Point on the wall of the cylinder, initially with no vertical component.
         */
        var ρ = Vector3_1.Vector3.copy(this.cutLine).rotate(rotor);
        vertex.attributes[this.aPosition] = ρ.clone().add(this.height, v);
        vertex.attributes[this.aTangent] = Spinor3_1.Spinor3.dual(ρ, false).scale(this.orientation);
    };
    return CylinderTransform;
}());
exports.CylinderTransform = CylinderTransform;
