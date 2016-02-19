import VectorE3 from '../math/VectorE3';
import isDefined from '../checks/isDefined';
import Matrix4 from '../math/Matrix4';
import viewArray from './viewArray';

export default function viewMatrix(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Matrix4): Matrix4 {
    let m: Matrix4 = isDefined(matrix) ? matrix : Matrix4.one();
    viewArray(eye, look, up, m.elements);
    return m;
}
