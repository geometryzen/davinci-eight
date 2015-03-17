import Euclidean3 = require('davinci-blade/Euclidean3');
/**
 * @class camera
 */
declare var camera: () => {
    position: Euclidean3;
    attitude: Euclidean3;
    projectionMatrix: number[];
};
export = camera;
