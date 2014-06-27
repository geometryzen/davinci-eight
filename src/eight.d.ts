declare var eight: {
    'VERSION': string;
    perspectiveCamera: (fov?: number, aspect?: number, near?: number, far?: number) => {
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
    euclidean3: (self?: {
        w?: number;
        x?: number;
        y?: number;
        z?: number;
        xy?: number;
        yz?: number;
        zx?: number;
        xyz?: number;
    }) => {
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
    scalarE3: (w: number) => {
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
    vectorE3: (x: number, y: number, z: number) => {
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
    bivectorE3: (xy: number, yz: number, zx: number) => {
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
    scene: () => {
        children: {
            onContextGain: (gl: WebGLRenderingContext) => void;
            onContextLoss: () => void;
            tearDown: () => void;
        }[];
        onContextGain: (gl: WebGLRenderingContext) => void;
        onContextLoss: () => void;
        tearDown: () => void;
        add: (child: {
            onContextGain: (gl: WebGLRenderingContext) => void;
            onContextLoss: () => void;
            tearDown: () => void;
        }) => void;
    };
    object3D: () => {
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
        onContextGain: (gl: any) => void;
        onContextLoss: () => void;
        tearDown: () => void;
        updateMatrix: () => void;
        draw: (projectionMatrix: any) => void;
    };
    webGLRenderer: (parameters?: any) => {
        canvas: HTMLCanvasElement;
        context: WebGLRenderingContext;
        onContextGain: (context: WebGLRenderingContext) => void;
        onContextLoss: () => void;
        clearColor: (r: number, g: number, b: number, a: number) => void;
        render: (scene: any, camera: {
            projectionMatrix: any;
        }) => void;
        viewport: (x: any, y: any, width: any, height: any) => void;
        setSize: (width: any, height: any, updateStyle: any) => void;
    };
    webGLContextMonitor: (canvas: HTMLCanvasElement, contextLoss: () => void, contextGain: (gl: WebGLRenderingContext) => void) => {
        start: () => void;
        stop: () => void;
    };
    workbench3D: (canvas: HTMLCanvasElement, renderer: any, camera: {
        aspect: number;
        updateProjectionMatrix: () => void;
    }, win?: Window) => {
        setUp: () => void;
        tearDown: () => void;
    };
    windowAnimationRunner: (tick: (t: number) => void, terminate: (t: number) => void, setUp: () => void, tearDown: (ex: any) => void, win?: Window) => {
        start: () => void;
        stop: () => void;
    };
    mesh: (geometry?: any, material?: any) => {
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
        onContextGain: (context: any) => void;
        onContextLoss: () => void;
        tearDown: () => void;
        updateMatrix: () => void;
        draw: (projectionMatrix: any) => void;
    };
    geometry: (spec?: any) => x.Geometry;
    boxGeometry: (spec?: any) => {
        triangles: number[][];
        vertices: any[];
        normals: any[];
        colors: any[];
    };
    prismGeometry: (spec?: any) => {
        triangles: number[][];
        vertices: any[];
        normals: any[];
        colors: any[];
    };
    material: (spec?: any) => Material;
    meshBasicMaterial: (spec: any) => Material;
    meshNormalMaterial: (spec: any) => Material;
};
export = eight;
