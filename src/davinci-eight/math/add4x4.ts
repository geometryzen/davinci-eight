export default function add4x4(a: Float32Array, b: Float32Array, c: Float32Array): Float32Array {

    let a11 = a[0x0], a12 = a[0x4], a13 = a[0x8], a14 = a[0xC];
    let a21 = a[0x1], a22 = a[0x5], a23 = a[0x9], a24 = a[0xD];
    let a31 = a[0x2], a32 = a[0x6], a33 = a[0xA], a34 = a[0xE];
    let a41 = a[0x3], a42 = a[0x7], a43 = a[0xB], a44 = a[0xF];

    let b11 = b[0x0], b12 = b[0x4], b13 = b[0x8], b14 = b[0xC];
    let b21 = b[0x1], b22 = b[0x5], b23 = b[0x9], b24 = b[0xD];
    let b31 = b[0x2], b32 = b[0x6], b33 = b[0xA], b34 = b[0xE];
    let b41 = b[0x3], b42 = b[0x7], b43 = b[0xB], b44 = b[0xF];

    c[0x0] = a11 + b11
    c[0x4] = a12 + b12
    c[0x8] = a13 + b13
    c[0xC] = a14 + b14

    c[0x1] = a21 + b21
    c[0x5] = a22 + b22
    c[0x9] = a23 + b23
    c[0xD] = a24 + b24

    c[0x2] = a31 + b31
    c[0x6] = a32 + b32
    c[0xA] = a33 + b33
    c[0xE] = a34 + b34

    c[0x3] = a41 + b41
    c[0x7] = a42 + b42
    c[0xB] = a43 + b43
    c[0xF] = a44 + b44

    return c;
}
