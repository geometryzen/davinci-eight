declare var camera: () => {
    position: Euclidean3;
    attitude: Euclidean3;
    onContextGain: (gl: any) => void;
    onContextLoss: () => void;
    tearDown: () => void;
    updateMatrix: () => void;
    draw: (projectionMatrix: any) => void;
};
export = camera;
