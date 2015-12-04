import AxialGeometry = require('../geometries/AxialGeometry');
import VectorE3 = require('../math/VectorE3');
import IAxialGeometry = require('../geometries/IAxialGeometry');
import Primitive = require('../geometries/Primitive');
/**
 * @class ConeGeometry
 */
declare class ConeGeometry extends AxialGeometry implements IAxialGeometry<ConeGeometry> {
    /**
     * @property radius
     * @type {number}
     */
    radius: number;
    /**
     * @property height
     * @type {number}
     */
    height: number;
    /**
     * @property thetaSegments
     * @type {number}
     */
    thetaSegments: number;
    /**
     * @class ConeGeometry
     * @constructor
     * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
     * @param sliceStart {VectorE3} A direction, orthogonal to <code>axis</code>.
     */
    constructor(axis: VectorE3, sliceStart: VectorE3);
    /**
     * @method setAxis
     * @param axis {VectorE3}
     * @return {ConeGeometry}
     * @chainable
     */
    setAxis(axis: VectorE3): ConeGeometry;
    /**
     * @method setPosition
     * @param position {VectorE3}
     * @return {ConeGeometry}
     * @chainable
     */
    setPosition(position: VectorE3): ConeGeometry;
    /**
     * @method tPrimitives
     * @return {Primitive[]}
     */
    toPrimitives(): Primitive[];
    enableTextureCoords(enable: boolean): ConeGeometry;
}
export = ConeGeometry;
