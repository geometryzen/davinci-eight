declare var eight: {
    'VERSION': string;
    perspectiveCamera: (fov?: number, aspect?: number, near?: number, far?: number) => {
        position: Euclidean3;
        attitude: Euclidean3;
        aspect: number;
        updateProjectionMatrix: () => void;
    };
    euclidean3: (spec?: {
        w?: number;
        x?: number;
        y?: number;
        z?: number;
        xy?: number;
        yz?: number;
        zx?: number;
        xyz?: number;
    }) => Euclidean3;
    scalarE3: (w: number) => Euclidean3;
    vectorE3: (x: number, y: number, z: number) => Euclidean3;
    bivectorE3: (xy: number, yz: number, zx: number) => Euclidean3;
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
        position: Euclidean3;
        attitude: Euclidean3;
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
        render: (scene: any, camera: any) => void;
        viewport: (x: any, y: any, width: any, height: any) => void;
        setSize: (width: any, height: any, updateStyle: any) => void;
    };
    webGLContextMonitor: (canvas: HTMLCanvasElement, contextLoss: () => void, contextGain: (gl: WebGLRenderingContext) => void) => {
        start: () => void;
        stop: () => void;
    };
    workbench3D: (canvas: HTMLCanvasElement, renderer: any, camera: any, win: any) => {
        setUp: () => void;
        tearDown: () => void;
    };
    windowAnimationRunner: (tick: (t: number) => void, terminate: (t: number) => void, setUp: () => void, tearDown: (ex: any) => void, win?: Window) => {
        start: () => void;
        stop: () => void;
    };
    mesh: (geometry?: any, material?: any) => {
        position: Euclidean3;
        attitude: Euclidean3;
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
