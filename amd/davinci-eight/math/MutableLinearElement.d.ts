import LinearElement = require('../math/LinearElement');
interface MutableLinearElement<I, M, S, V> extends LinearElement<I, M, S, V> {
    add2(a: I, b: I): M;
    clone(): M;
    copy(source: I): M;
    divideByScalar(α: number): M;
    lerp2(a: I, b: I, α: number): M;
    scale(α: number): M;
    sub2(a: I, b: I): M;
}
export = MutableLinearElement;
