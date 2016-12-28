import isDefined from '../checks/isDefined';
import Matrix4 from '../math/Matrix4';
import perspectiveArray from './perspectiveArray';

export default function perspectiveMatrix(fov: number, aspect: number, near: number, far: number, matrix?: Matrix4): Matrix4 {
    const m: Matrix4 = isDefined(matrix) ? matrix : Matrix4.one();
    perspectiveArray(fov, aspect, near, far, m.elements);
    return m;
}
