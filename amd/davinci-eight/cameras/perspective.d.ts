import LinearPerspectiveCamera = require('davinci-eight/cameras/LinearPerspectiveCamera');
/**
 * @class perspective
 * @constructor
 * @param fov {number}
 * @param aspect {number}
 * @param near {number}
 * @param far {number}
 * @return {LinearPerspectiveCamera}
 */
declare var perspective: (fov?: number, aspect?: number, near?: number, far?: number) => LinearPerspectiveCamera;
export = perspective;
