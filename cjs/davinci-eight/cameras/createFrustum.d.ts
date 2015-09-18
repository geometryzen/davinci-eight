import Frustum = require('davinci-eight/cameras/Frustum');
/**
 * @function createFrustum
 * @constructor
 * @return {Frustum}
 */
declare let createFrustum: (viewMatrixName: string, projectionMatrixName: string) => Frustum;
export = createFrustum;
