/**
 * @class Matrix<M>
 */
// FIXME: Shouldn't the parameter be the element type?
interface Matrix<M> {
  determinant(): number;
  identity(): M;
  multiply(rhs: M): M;
  product(a: M, b: M): M;
}

export = Matrix;