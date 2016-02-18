import Unit from './Unit'

/**
 * @class VectorE3
 */
interface VectorE3 {
    /**
     * The Cartesian x-coordinate.
     * @property x
     * @type number
     */
    x: number;

    /**
     * The Cartesian y-coordinate.
     * @property y
     * @type number
     */
    y: number;

    /**
     * The Cartesian z-coordinate.
     * @property z
     * @type number
     */
    z: number;

    /**
     * The optional unit of measure.
     *
     * @property uom
     * @type number
     * @optional
     */
    uom: Unit;
}

export default VectorE3;
