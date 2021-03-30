import { isDefined } from '../checks/isDefined';
import { Vector3 } from '../math/Vector3';
/**
 * @hidden
 */
export function scaleFromBoxOptions(options) {
    var x = isDefined(options.width) ? options.width : 1;
    return Vector3.vector(x, 0, 0);
}
