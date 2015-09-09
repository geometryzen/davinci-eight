import Line = require('../dfx/Line');
import Vector1 = require('../math/Vector1');
import Vector3 = require('../math/Vector3');
declare class LineVertex {
    parent: Line;
    position: Vector3;
    normal: Vector3;
    params: Vector1;
    constructor(position: Vector3, normal?: Vector3);
}
export = LineVertex;
