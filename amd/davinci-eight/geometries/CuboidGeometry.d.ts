import Geometry = require('../geometries/Geometry');
import Vector3 = require('../math/Vector3');
/**
 * @class CuboidGeometry
 */
declare class CuboidGeometry extends Geometry {
    a: Vector3;
    b: Vector3;
    c: Vector3;
    k: number;
    constructor();
    calculate(): void;
}
export = CuboidGeometry;
