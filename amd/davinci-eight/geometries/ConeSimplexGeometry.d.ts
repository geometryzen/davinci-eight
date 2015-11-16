import SliceSimplexGeometry = require('../geometries/SliceSimplexGeometry');
import VectorE3 = require('../math/VectorE3');
/**
 * @class ConeSimplexGeometry
 * @extends SliceSimplexGeometry
 */
declare class ConeSimplexGeometry extends SliceSimplexGeometry {
    radiusTop: number;
    radius: number;
    height: number;
    openTop: boolean;
    openBottom: boolean;
    thetaStart: number;
    /**
     * @class ConeSimplexGeometry
     * @constructor
     * @param [radiusTop = 0.5] {number}
     * @param [radius = 0.5] {number}
     * @param [height = 1] {number}
     * @param [openTop = false] {boolean}
     * @param [openBottom = false] {boolean}
     * @param [thetaStart = 0] {number}
     */
    constructor(radius: number, height: number, axis: VectorE3, radiusTop?: number, openTop?: boolean, openBottom?: boolean, thetaStart?: number);
    regenerate(): void;
}
export = ConeSimplexGeometry;
