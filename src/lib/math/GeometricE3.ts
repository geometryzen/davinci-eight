import { Pseudo } from '../math/Pseudo';
import { Scalar } from '../math/Scalar';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';

/**
 *
 */
export interface GeometricE3 extends Pseudo, Scalar, SpinorE3, VectorE3 {
}
