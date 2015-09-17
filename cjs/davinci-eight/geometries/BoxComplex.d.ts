import Complex = require('../dfx/Complex');
/**
 * @class BoxComplex
 * @extends Complex
 */
declare class BoxComplex extends Complex {
    constructor(width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number, wireFrame?: boolean);
}
export = BoxComplex;
