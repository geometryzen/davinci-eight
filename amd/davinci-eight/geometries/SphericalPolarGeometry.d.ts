import Cartesian3 = require('../math/Cartesian3');
import MutableNumber = require('../math/MutableNumber');
import SliceGeometry = require('../geometries/SliceGeometry');
import Vector3 = require('../math/Vector3');
/**
 * @class SphericalPolarGeometry
 * @extends SliceGeometry
 */
declare class SphericalPolarGeometry extends SliceGeometry {
    /**
     * @property _radius
     * @type {MutableNumber}
     * @private
     */
    _radius: MutableNumber;
    /**
     * @property thetaLength
     * @type {number}
     */
    thetaLength: number;
    /**
     * Defines a start angle relative to the <code>axis</code> property.
     * @property thetaStart
     * @type {number}
     */
    thetaStart: number;
    /**
     * Constructs a geometry consisting of triangular simplices based on spherical coordinates.
     * @class SphericalPolarGeometry
     * @constructor
     * @param radius [number = 1]
     * @param axis [Cartesian3]
     * @param phiStart [Cartesian]
     * @param phiLength [number = 2 * Math.PI]
     * @param thetaStart [number]
     * @param thetaLength [number]
     */
    constructor(radius: number, axis: Cartesian3, phiStart: Cartesian3, phiLength?: number, thetaStart?: number, thetaLength?: number);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @property radius
     * @type {number}
     */
    radius: number;
    /**
     * @property phiLength
     * @type {number}
     */
    phiLength: number;
    /**
     * Defines a start half-plane relative to the <code>axis</code> property.
     * @property phiStart
     * @type {Vector3}
     */
    phiStart: Vector3;
    /**
     * @method isModified
     * @return {boolean}
     */
    isModified(): boolean;
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {SphericalPolarGeometry}
     * @chainable
     */
    setModified(modified: boolean): SphericalPolarGeometry;
    /**
     * @method regenerate
     * @return {void}
     */
    regenerate(): void;
}
export = SphericalPolarGeometry;
