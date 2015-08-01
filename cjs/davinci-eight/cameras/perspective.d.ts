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
declare let perspective: (options?: {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    projectionMatrixName?: string;
    viewMatrixName?: string;
}) => LinearPerspectiveCamera;
export = perspective;
