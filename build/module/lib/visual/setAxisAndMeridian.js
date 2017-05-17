import { isDefined } from '../checks/isDefined';
/**
 * Sets the axis and meridian properties from options in the correct order.
 */
export function setAxisAndMeridian(mesh, options) {
    if (isDefined(options.axis)) {
        mesh.axis = options.axis;
    }
    if (isDefined(options.meridian)) {
        mesh.meridian = options.meridian;
    }
}
