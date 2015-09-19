import Geometry = require('../geometries/Geometry');
/**
 * @class BoxGeometry
 */
declare class BoxGeometry extends Geometry {
    /**
     * @property x {number} The length of the side in the x-axis direction.
     */
    x: number;
    /**
     * @property y {number} The length of the side in the y-axis direction.
     */
    y: number;
    /**
     * @property z {number} The length of the side in the z-axis direction.
     */
    z: number;
    /**
     * @property xSegments {number} The number of segments in the x-axis direction.
     */
    xSegments: number;
    /**
     * @property ySegments {number} The number of segments in the y-axis direction.
     */
    ySegments: number;
    /**
     * @property zSegments {number} The number of segments in the z-axis direction.
     */
    zSegments: number;
    lines: boolean;
    /**
     * @class BoxGeometry
     * @constructor
     */
    constructor();
    calculate(): void;
}
export = BoxGeometry;
