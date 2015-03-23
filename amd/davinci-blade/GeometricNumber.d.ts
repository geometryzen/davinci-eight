interface GeometricNumber {
    scalarMultiply(alpha: number): any;
    add(other: any): any;
    sub(other: any): any;
    mul(other: any): any;
    div(other: any): any;
    wedge(other: any): any;
    lshift(other: any): any;
    rshift(other: any): any;
}
export = GeometricNumber;
