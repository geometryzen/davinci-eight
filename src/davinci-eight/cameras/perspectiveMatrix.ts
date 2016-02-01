import isDefined from '../checks/isDefined';
import Mat4R from '../math/Mat4R';
import perspectiveArray from '../cameras/perspectiveArray';

export default function perspectiveMatrix(fov: number, aspect: number, near: number, far: number, matrix?: Mat4R): Mat4R {
    let m: Mat4R = isDefined(matrix) ? matrix : Mat4R.one();
    perspectiveArray(fov, aspect, near, far, m.elements);
    return m;
}
