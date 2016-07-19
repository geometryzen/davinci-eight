import {AbstractDrawable} from './AbstractDrawable'
import {Color} from './Color'
import {Geometric3} from '../math/Geometric3'
import Matrix4 from '../math/Matrix4'

interface AbstractMesh extends AbstractDrawable {
    R: Geometric3;
    color: Color;
    opacity: number;
    pointSize: number;
    X: Geometric3;
    stress: Matrix4;
}

export default AbstractMesh
