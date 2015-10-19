import Cartesian3 = require('../math/Cartesian3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import IGeometry = require('../geometries/IGeometry');
import Vector3 = require('../math/Vector3');
/**
 * @class ConeGeometry
 */
declare class ConeGeometry implements IGeometry {
    radius: number;
    height: number;
    axis: Vector3;
    private topo;
    /**
     * @class ConeGeometry
     * @constructor
     * @param radius {number}
     * @param height {number}
     * @param axis {Cartesian3}
     */
    constructor(radius: number, height: number, axis: Cartesian3);
    regenerate(): void;
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    toPrimitives(): DrawPrimitive[];
}
export = ConeGeometry;
