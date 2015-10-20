import Cartesian3 = require('../math/Cartesian3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import AxialGeometry = require('../geometries/AxialGeometry');
import IGeometry = require('../geometries/IGeometry');
/**
 * @class ArrowGeometry
 */
declare class ArrowGeometry extends AxialGeometry implements IGeometry<ArrowGeometry> {
    /**
     * @property heightCone
     * @type {number}
     */
    heightCone: number;
    /**
     * @property radiusCone
     * @type {number}
     */
    radiusCone: number;
    /**
     * @property radiusShaft
     * @type {number}
     */
    radiusShaft: number;
    /**
     * @property thetaSegments
     * @type {number}
     */
    thetaSegments: number;
    /**
     * @class ArrowGeometry
     * @constructor
     */
    constructor();
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {ArrowGeometry}
     * @chainable
     */
    setPosition(position: Cartesian3): ArrowGeometry;
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): ArrowGeometry;
}
export = ArrowGeometry;
