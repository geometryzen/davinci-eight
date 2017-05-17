"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
/**
 * Sets the axis and meridian properties from options in the correct order.
 */
function setAxisAndMeridian(mesh, options) {
    if (isDefined_1.isDefined(options.axis)) {
        mesh.axis = options.axis;
    }
    if (isDefined_1.isDefined(options.meridian)) {
        mesh.meridian = options.meridian;
    }
}
exports.setAxisAndMeridian = setAxisAndMeridian;
