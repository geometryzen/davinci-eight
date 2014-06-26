declare var mesh: (geometry?: any, material?: any) => {
    position: Euclidean3;
    attitude: Euclidean3;
    projectionMatrix: any;
    onContextGain: (context: any) => void;
    onContextLoss: () => void;
    tearDown: () => void;
    updateMatrix: () => void;
    draw: (projectionMatrix: any) => void;
};
export = mesh;
