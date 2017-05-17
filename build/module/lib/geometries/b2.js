// Quadratic Bezier
function b2p0(t, p) {
    var k = 1 - t;
    return k * k * p;
}
function b2p1(t, p) {
    return 2 * (1 - t) * t * p;
}
function b2p2(t, p) {
    return t * t * p;
}
export function b2(t, begin, control, end) {
    return b2p0(t, begin) + b2p1(t, control) + b2p2(t, end);
}
