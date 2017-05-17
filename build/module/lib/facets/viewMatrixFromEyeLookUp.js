import { isDefined } from '../checks/isDefined';
import { Matrix4 } from '../math/Matrix4';
import { viewArrayFromEyeLookUp } from './viewArrayFromEyeLookUp';
export function viewMatrixFromEyeLookUp(eye, look, up, matrix) {
    var m = isDefined(matrix) ? matrix : Matrix4.one.clone();
    viewArrayFromEyeLookUp(eye, look, up, m.elements);
    return m;
}
