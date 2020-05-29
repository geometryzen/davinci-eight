"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDeprecatedOptions = void 0;
var isDefined_1 = require("../checks/isDefined");
var ATTITUDE_NAME = 'attitude';
var POSITION_NAME = 'position';
/**
 * Deprecated support for 'position' and 'attitude' in options.
 * Implementations should use the corresponding properties instead.
 */
function setDeprecatedOptions(mesh, options) {
    if (isDefined_1.isDefined(options[POSITION_NAME])) {
        console.warn("options." + POSITION_NAME + " is deprecated. Please use the X (position vector) property instead.");
        mesh.X.copyVector(options[POSITION_NAME]);
    }
    if (isDefined_1.isDefined(options[ATTITUDE_NAME])) {
        console.warn("options." + ATTITUDE_NAME + " is deprecated. Please use the R (attitude rotor) property instead.");
        mesh.R.copySpinor(options[ATTITUDE_NAME]);
    }
}
exports.setDeprecatedOptions = setDeprecatedOptions;
