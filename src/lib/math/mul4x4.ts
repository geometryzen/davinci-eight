/**
 * @hidden
 */
export function mul4x4(a: Float32Array, b: Float32Array, c: Float32Array): Float32Array {
    const a11 = a[0x0],
        a12 = a[0x4],
        a13 = a[0x8],
        a14 = a[0xc];
    const a21 = a[0x1],
        a22 = a[0x5],
        a23 = a[0x9],
        a24 = a[0xd];
    const a31 = a[0x2],
        a32 = a[0x6],
        a33 = a[0xa],
        a34 = a[0xe];
    const a41 = a[0x3],
        a42 = a[0x7],
        a43 = a[0xb],
        a44 = a[0xf];

    const b11 = b[0x0],
        b12 = b[0x4],
        b13 = b[0x8],
        b14 = b[0xc];
    const b21 = b[0x1],
        b22 = b[0x5],
        b23 = b[0x9],
        b24 = b[0xd];
    const b31 = b[0x2],
        b32 = b[0x6],
        b33 = b[0xa],
        b34 = b[0xe];
    const b41 = b[0x3],
        b42 = b[0x7],
        b43 = b[0xb],
        b44 = b[0xf];

    c[0x0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    c[0x4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    c[0x8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    c[0xc] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

    c[0x1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    c[0x5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    c[0x9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    c[0xd] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

    c[0x2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    c[0x6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    c[0xa] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    c[0xe] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

    c[0x3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    c[0x7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    c[0xb] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    c[0xf] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return c;
}
