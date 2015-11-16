import IAxialGeometry = require('../geometries/IAxialGeometry');
import R1 = require('../math/R1');
import SliceSimplexGeometry = require('../geometries/SliceSimplexGeometry');
import R3 = require('../math/R3');
import VectorE3 = require('../math/VectorE3');
/**
 * @class SphericalPolarSimplexGeometry
 * @extends SliceSimplexGeometry
 */
declare class SphericalPolarSimplexGeometry extends SliceSimplexGeometry implements IAxialGeometry<SphericalPolarSimplexGeometry> {
    /**
     * @property _radius
     * @type {R1}
     * @private
     */
    _radius: R1;
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
     * @param [radius = 1] {number}
     * @param [axis] {VectorE3}
     * @param [phiStart] {vectorE3}
     * @param [phiLength = 2 * Math.PI] {number}
     * @param [thetaStart = 0] {number}
     * @param [thetaLength = Math.PI] {number}
     */
    constructor(radius: number, axis: VectorE3, phiStart?: VectorE3, phiLength?: number, thetaStart?: number, thetaLength?: number);
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
     * @type {R3}
     */
    phiStart: R3;
    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {SphericalPolarSimplexGeometry}
     * @chainable
     */
    setAxis(axis: VectorE3): SphericalPolarSimplexGeometry;
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {SphericalPolarSimplexGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): SphericalPolarSimplexGeometry;
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
