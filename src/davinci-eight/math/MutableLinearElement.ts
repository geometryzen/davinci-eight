import LinearElement = require('../math/LinearElement')

interface MutableLinearElement<I, M, S, V> extends LinearElement<I, M, S, V> {
  /**
   * <p>
   * <code>this ⟼ a * α + b * β</code>
   * </p>
   */
  add2(a: I, b: I, α?: number, β?: number): M;
  clone(): M;
  copy(source: I): M;
  /**
   * <p>
   * <code>this ⟼ a * α - b * β</code>
   * </p>
   */
  sub2(a: I, b: I): M;
}

export = MutableLinearElement;