export default function(a: Float32Array, b: Float32Array, c: Float32Array): Float32Array {

    let a11 = a[0x0], a12 = a[0x3], a13 = a[0x6]
    let a21 = a[0x1], a22 = a[0x4], a23 = a[0x7]
    let a31 = a[0x2], a32 = a[0x5], a33 = a[0x8]

    let b11 = b[0x0], b12 = b[0x3], b13 = b[0x6]
    let b21 = b[0x1], b22 = b[0x4], b23 = b[0x7]
    let b31 = b[0x2], b32 = b[0x5], b33 = b[0x8]

    c[0x0] = a11 + b11
    c[0x3] = a12 + b12
    c[0x6] = a13 + b13

    c[0x1] = a21 + b21
    c[0x4] = a22 + b22
    c[0x7] = a23 + b23

    c[0x2] = a31 + b31
    c[0x5] = a32 + b32
    c[0x8] = a33 + b33

    return c;
}
