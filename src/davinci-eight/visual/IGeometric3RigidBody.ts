import {Geometric3} from '../math/Geometric3';
import AbstractMesh from '../core/AbstractMesh';
import IRigidBody from './IRigidBody';
import VectorE3 from '../math/VectorE3';

/**
 * Intentionally undocumented.
 */
interface IGeometric3RigidBody extends AbstractMesh, IRigidBody<number, Geometric3, Geometric3> {
    initialAxis: VectorE3;
}

export default IGeometric3RigidBody;
