import Frustum = require('davinci-eight/cameras/Frustum');
/**
 * @class frustum
 * @constructor
 * @return {Frustum}
 */
declare let frustum: (viewMatrixName: string, projectionMatrixName: string) => Frustum;
export = frustum;
