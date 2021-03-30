// Cubic Bezier Functions
/**
 * @hidden
 */
function b3p0(t, p) {
    var k = 1 - t;
    return k * k * k * p;
}
/**
 * @hidden
 */
function b3p1(t, p) {
    var k = 1 - t;
    return 3 * k * k * t * p;
}
/**
 * @hidden
 */
function b3p2(t, p) {
    var k = 1 - t;
    return 3 * k * t * t * p;
}
/**
 * @hidden
 */
function b3p3(t, p) {
    return t * t * t * p;
}
/**
 * @hidden
 */
export function b3(t, p0, p1, p2, p3) {
    return b3p0(t, p0) + b3p1(t, p1) + b3p2(t, p2) + b3p3(t, p3);
}
