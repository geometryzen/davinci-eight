import VectorE3 from '../math/VectorE3';
import isDefined from '../checks/isDefined';
import Matrix4 from '../math/Matrix4';
import viewArrayFromEyeLookUp from './viewArrayFromEyeLookUp';

export default function viewMatrixFromEyeLookUp(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Matrix4): Matrix4 {
    const m: Matrix4 = isDefined(matrix) ? matrix : Matrix4.one.clone();
    viewArrayFromEyeLookUp(eye, look, up, m.elements);
    return m;
}
