import Euclidean3 = require('eight/math/e3ga/Euclidean3');
declare var perspectiveCamera: (fov?: number, aspect?: number, near?: number, far?: number) => {
    position: Euclidean3;
    attitude: Euclidean3;
    aspect: number;
    projectionMatrix: number[];
};
export = perspectiveCamera;
