import Cartesian3 = require('../math/Cartesian3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import Geometry = require('../geometries/Geometry');
import IGeometry = require('../geometries/IGeometry');
/**
 * @class CuboidGeometry
 */
declare class CuboidGeometry extends Geometry implements IGeometry<CuboidGeometry> {
    iSegments: number;
    jSegments: number;
    kSegments: number;
    private _a;
    private _b;
    private _c;
    private sides;
    /**
     * @class CuboidGeometry
     * @constructor
     */
    constructor();
    /**
     * @property width
     * @type {number}
     */
    width: number;
    /**
     * @property height
     * @type {number}
     */
    height: number;
    /**
     * @property depth
     * @type {number}
     */
    depth: number;
    private regenerate();
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {CuboidGeometry}
     */
    setPosition(position: Cartesian3): CuboidGeometry;
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): CuboidGeometry;
}
export = CuboidGeometry;
