import R3 from '../math/R3'
import Spinor3 from '../math/Spinor3'

/**
 * The deviation of the initial axis from the scaling reference frame.
 */
export default function(axis: R3): Spinor3 {
    return Spinor3.rotorFromDirections(R3.e2, axis)
}
