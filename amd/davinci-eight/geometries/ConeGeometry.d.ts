import AxialGeometry = require('../geometries/AxialGeometry');
import VectorE3 = require('../math/VectorE3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IAxialGeometry = require('../geometries/IAxialGeometry');
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
     */
    constructor();
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
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): ConeGeometry;
}
export = ConeGeometry;
