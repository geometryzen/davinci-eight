import Euclidean3 = require('davinci-blade/Euclidean3');
declare var perspectiveCamera: (fov?: number, aspect?: number, near?: number, far?: number) => {
    position: Euclidean3;
    attitude: Euclidean3;
    aspect: number;
    projectionMatrix: number[];
};
export = perspectiveCamera;
