declare class Euclidean3 {
    constructor(w: number, x: number, y: number, z: number);
    copy(coords: {
        w?: number;
        x?: number;
        y?: number;
        z?: number;
    }): void;
    add(other: Euclidean3): Euclidean3;
    sub(other: Euclidean3): Euclidean3;
    mul(other: Euclidean3): Euclidean3;
    div(other: Euclidean3): Euclidean3;
    static scalar(w: number): Euclidean3;
    static vector(x: number, y: number, z: number): Euclidean3;
    static ZERO: Euclidean3;
    static ONE: Euclidean3;
    static MINUS_ONE: Euclidean3;
    static TWO: Euclidean3;
    static e1: Euclidean3;
    static e2: Euclidean3;
    static e3: Euclidean3;
}
export = Euclidean3;
