import LinearElement = require('../math/LinearElement')

interface MutableLinearElement<I, M, S, V> extends LinearElement<I, M, S, V> {
    // FIXME: Add α and β as final parameters? Otherwise it's just a convenience.
    add2(a: I, b: I): M;
    clone(): M;
    copy(source: I): M;
    divideByScalar(α: number): M;
    // FIXME: This can be done through copy(a).lerp(b, α), so it's just a convenience. Add β.
    lerp2(a: I, b: I, α: number): M;
    scale(α: number): M;
    sub2(a: I, b: I): M;
}

export = MutableLinearElement;