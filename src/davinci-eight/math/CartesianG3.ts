/**
 * Marker interface
 *
 * Cartesian coordinates
 * 3 linear dimensions
 * No units of measure
 * Euclidean metric.
 */
interface CartesianG3 {
  /**
   * A bitmask describing the grades.
   *
   * 0x0 = zero
   * 0x1 = scalar
   * 0x2 = vector
   * 0x4 = bivector
   * 0x8 = pseudoscalar
   */
  maskG3: number;
}

export default CartesianG3;
