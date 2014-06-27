import Euclidean3 = require('eight/math/e3ga/Euclidean3');
declare var camera: () => {
    position: Euclidean3;
    attitude: Euclidean3;
    projectionMatrix: number[];
};
export = camera;
