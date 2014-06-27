declare var perspectiveCamera: (fov?: number, aspect?: number, near?: number, far?: number) => {
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
    projectionMatrix: any;
    aspect: number;
    updateProjectionMatrix: () => void;
};
export = perspectiveCamera;
