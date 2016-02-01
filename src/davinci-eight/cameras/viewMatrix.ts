import VectorE3 from '../math/VectorE3';
import isDefined from '../checks/isDefined';
import Mat4R from '../math/Mat4R';
import viewArray from '../cameras/viewArray';

export default function viewMatrix(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Mat4R): Mat4R {
    let m: Mat4R = isDefined(matrix) ? matrix : Mat4R.one();
    viewArray(eye, look, up, m.elements);
    return m;
}
