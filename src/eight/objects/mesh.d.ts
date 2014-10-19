import Euclidean3 = require('eight/math/e3ga/Euclidean3');
declare var mesh: (geometry?: glMatrix.Geometry, material?: any) => {
    position: Euclidean3;
    attitude: Euclidean3;
    projectionMatrix: number[];
    onContextGain: (context: any) => void;
    onContextLoss: () => void;
    tearDown: () => void;
    updateMatrix: () => void;
    draw: (projectionMatrix: number[]) => void;
};
export = mesh;
