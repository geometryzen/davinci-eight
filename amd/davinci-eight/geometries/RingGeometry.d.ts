import Cartesian3 = require('../math/Cartesian3');
import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
/**
 * @class RingGeometry
 * @extends Geometry
 */
declare class RingGeometry extends Geometry {
    /**
     * The inner radius.
     * @property innerRadius
     * @type {number}
     */
    innerRadius: number;
    /**
     * The outer radius.
     * @property outerRadius
     * @type {number}
     */
    outerRadius: number;
    /**
     * The axis of symmetry (unit vector) direction.
     * @property normal
     * @type {Vector3}
     */
    normal: Vector3;
    /**
     * The direction (perpendicular to normal) of the start or the arc.
     * @property start
     * @type {Vector3}
     */
    start: Vector3;
    /**
     * The angle subtended by the ring.
     */
    angle: number;
    /**
     * The number of segments in the radial direction.
     */
    radialSegments: number;
    /**
     * The number of segments in the angular direction.
     */
    thetaSegments: number;
    /**
     * Creates an annulus with a single hole.
     * @class RingGeometry
     * @constructor
     * @param a [number = 1] The outer radius
     * @param b [number = 0] The inner radius
     * @param e [Cartesian3 = Vector3.e3] The symmetry axis unit vector.
     * @param
     */
    constructor(innerRadius?: number, outerRadius?: number, normal?: Cartesian3, start?: Cartesian3, angle?: number);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method isModified
     * @return {boolean}
     */
    isModified(): boolean;
    /**
     * @method regenerate
     * @return {void}
     */
    regenerate(): void;
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {RingGeometry}
     * @chainable
     */
    setModified(modified: boolean): RingGeometry;
}
export = RingGeometry;
