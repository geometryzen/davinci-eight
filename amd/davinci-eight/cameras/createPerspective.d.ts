import Perspective = require('../cameras/Perspective');
/**
 * @function createPerspective
 * @constructor
 * @param fov {number}
 * @param aspect {number}
 * @param near {number}
 * @param far {number}
 * @return {Perspective}
 */
declare let createPerspective: (options?: {
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    projectionMatrixName?: string;
    viewMatrixName?: string;
}) => Perspective;
export = createPerspective;
