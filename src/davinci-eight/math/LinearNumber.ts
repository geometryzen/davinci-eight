/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 * Notice that the effect on the target depends upon whether the target class in mutable.
 * MAGNITUDE is the chosen type for the magnitude method and scaling.
 * For dimensionless quantities without units, use number.
 * For linear quantities with units, you may use Unit.
 * For geometric quantities with units, you may use the quantity itself because it can represent a scalar.
 */

/**
 * @class LinearNumber
 */
interface LinearNumber<I, M, S, V, MAGNITUDE, SCALAR> {
  add(rhs: I, α?: number): M;
  divByScalar(α: SCALAR): M;
  lerp(target: I, α: number): M;
  scale(α: SCALAR): M;
  neg(): M;
  reflect(n: V): M;
  rotate(rotor: S): M;
  slerp(target: I, α: number): M;
  stress(σ: V): M;
  sub(rhs: I, α?: number): M;
  toExponential(fractionDigits?: number): string
  toFixed(fractionDigits?: number): string;
  toPrecision(precision?: number): string;
  toString(radix?: number): string;
}

export default LinearNumber;
