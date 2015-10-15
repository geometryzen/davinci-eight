import Cartesian3 = require('../math/Cartesian3');
import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
/**
 * @class RingGeometry
 * @extends Geometry
 */
declare class RingGeometry extends Geometry {
    /**
     * The outer radius.
     * @property a
     * @type {number}
     */
    a: number;
    /**
     * The inner radius.
     * @property b
     * @type {number}
     */
    b: number;
    /**
     * The axis of symmetry.
     * @property e
     * @type {Vector3}
     */
    e: Vector3;
    radialSegments: number;
    thetaSegments: number;
    thetaStart: number;
    thetaLength: number;
    /**
     * Creates an annulus with a single hole.
     * @class RingGeometry
     * @constructor
     */
    constructor(a?: number, b?: number, e?: Cartesian3);
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
     * @method recalculate
     * @return {void}
     */
    recalculate(): void;
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {RingGeometry}
     * @chainable
     */
    setModified(modified: boolean): RingGeometry;
}
export = RingGeometry;
