import SerialGeometry = require('../geometries/SerialGeometry');
/**
 * @class CuboidSerialGeometry
 */
declare class CuboidSerialGeometry extends SerialGeometry {
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
     * <p>
     * A CuboidSerialGeometry represents the mathematical shape of a cuboid.
     * <p>
     * @class CuboidSerialGeometry
     * @constructor
     * @param width {number} The length in the x-axis aspect.
     * @param height {number} The length in the y-axis aspect.
     * @param depth {number} The length in the z-axis aspect.
     */
    constructor(width?: number, height?: number, depth?: number);
    calculate(): void;
}
export = CuboidSerialGeometry;
