interface Euclidean3 {
    add(rhs: Euclidean3): Euclidean3;
    sub(rhs: Euclidean3): Euclidean3;
    mul(rhs: Euclidean3): Euclidean3;
    div(rhs: Euclidean3): Euclidean3;
    cross(rhs: Euclidean3): Euclidean3;
    norm(): Euclidean3;
    w: number;
    x: number;
    y: number;
    z: number;
    xy: number;
    yz: number;
    zx: number;
    xyz: number;
}
