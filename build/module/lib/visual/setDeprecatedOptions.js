import { isDefined } from '../checks/isDefined';
var ATTITUDE_NAME = 'attitude';
var POSITION_NAME = 'position';
/**
 * Deprecated support for 'position' and 'attitude' in options.
 * Implementations should use the corresponding properties instead.
 */
export function setDeprecatedOptions(mesh, options) {
    if (isDefined(options[POSITION_NAME])) {
        console.warn("options." + POSITION_NAME + " is deprecated. Please use the X (position vector) property instead.");
        mesh.X.copyVector(options[POSITION_NAME]);
    }
    if (isDefined(options[ATTITUDE_NAME])) {
        console.warn("options." + ATTITUDE_NAME + " is deprecated. Please use the R (attitude rotor) property instead.");
        mesh.R.copySpinor(options[ATTITUDE_NAME]);
    }
}
