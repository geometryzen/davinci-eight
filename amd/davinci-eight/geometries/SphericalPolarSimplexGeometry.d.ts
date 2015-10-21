import Cartesian3 = require('../math/Cartesian3');
import IAxialGeometry = require('../geometries/IAxialGeometry');
import MutableNumber = require('../math/MutableNumber');
import SliceSimplexGeometry = require('../geometries/SliceSimplexGeometry');
import Vector3 = require('../math/Vector3');
/**
 * @class SphericalPolarSimplexGeometry
 * @extends SliceSimplexGeometry
 */
declare class SphericalPolarSimplexGeometry extends SliceSimplexGeometry implements IAxialGeometry<SphericalPolarSimplexGeometry> {
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
     * @class SphericalPolarSimplexGeometry
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
     * @method setAxis
     * @param axis {Cartesian3}
     * @return {SphericalPolarSimplexGeometry}
     * @chainable
     */
    setAxis(axis: Cartesian3): SphericalPolarSimplexGeometry;
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {SphericalPolarSimplexGeometry}
     * @chainable
     */
    setPosition(position: Cartesian3): SphericalPolarSimplexGeometry;
    enableTextureCoords(enable: boolean): SphericalPolarSimplexGeometry;
    /**
     * @method isModified
     * @return {boolean}
     */
    isModified(): boolean;
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {SphericalPolarSimplexGeometry}
     * @chainable
     */
    setModified(modified: boolean): SphericalPolarSimplexGeometry;
    /**
     * @method regenerate
     * @return {void}
     */
    regenerate(): void;
}
export = SphericalPolarSimplexGeometry;
