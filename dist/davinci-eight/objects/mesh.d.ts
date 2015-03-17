import glMatrix = require('gl-matrix');
import Euclidean3 = require('davinci-blade/Euclidean3');
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
