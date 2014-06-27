declare var scalarE3: (w: number) => {
    w: number;
    x: number;
    y: number;
    z: number;
    xy: number;
    yz: number;
    zx: number;
    xyz: number;
    sub(other: any): any;
    mul(other: any): any;
    div(other: any): any;
    cross(other: any): any;
    norm(): any;
};
export = scalarE3;
