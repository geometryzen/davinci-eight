declare var mesh: (geometry?: any, material?: any) => {
    position: {
        x: number;
        y: number;
        z: number;
    };
    attitude: {
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
    projectionMatrix: number[];
    onContextGain: (context: any) => void;
    onContextLoss: () => void;
    tearDown: () => void;
    updateMatrix: () => void;
    draw: (projectionMatrix: any) => void;
};
export = mesh;
