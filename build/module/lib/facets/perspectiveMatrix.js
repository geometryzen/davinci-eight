import { isDefined } from '../checks/isDefined';
import { Matrix4 } from '../math/Matrix4';
import { perspectiveArray } from './perspectiveArray';
/**
 * @hidden
 */
export function perspectiveMatrix(fov, aspect, near, far, matrix) {
    var m = isDefined(matrix) ? matrix : Matrix4.one.clone();
    perspectiveArray(fov, aspect, near, far, m.elements);
    return m;
}
