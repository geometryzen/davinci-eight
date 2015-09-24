import Unit = require('../math/Unit')
interface Measure<T> {
  coordinates(): number[]
  uom: Unit
  add(rhs: T): T
  sub(rhs: T): T
  mul(rhs: T): T
  div(rhs: T): T
  wedge(rhs: T): T
  lshift(rhs: T): T
  rshift(rhs: T): T
  pow(exponent: T): T
  cos(): T
  cosh(): T
  exp(): T
  norm(): T
  quad(): T
  sin(): T
  sinh(): T
  unit(): T
  scalar(): number
  toExponential(): string
  toFixed(digits?: number): string
  toString(): string
}
export = Measure