import AxialGeometry = require('../geometries/AxialGeometry');
import Cartesian3 = require('../math/Cartesian3');
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
     * @param axis {Cartesian3}
     * @return {ConeGeometry}
     * @chainable
     */
    setAxis(axis: Cartesian3): ConeGeometry;
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {ConeGeometry}
     * @chainable
     */
    setPosition(position: Cartesian3): ConeGeometry;
    /**
     * @method tPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): ConeGeometry;
}
export = ConeGeometry;
