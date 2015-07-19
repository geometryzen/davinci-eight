import Frustum = require('davinci-eight/cameras/Frustum');
/**
 * @class frustum
 * @constructor
 * @param left {number}
 * @param right {number}
 * @param bottom {number}
 * @param top {number}
 * @param near {number}
 * @param far {number}
 * @return {Frustum}
 */
declare var frustum: (left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number) => Frustum;
export = frustum;
