import { isDefined } from '../checks/isDefined';
/**
 * @hidden
 */
export function setColorOption(mesh, options, defaultColor) {
    if (isDefined(options.color)) {
        mesh.color.copy(options.color);
    }
    else if (isDefined(defaultColor)) {
        mesh.color.copy(defaultColor);
    }
}
