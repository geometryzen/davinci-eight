import Spinor3 = require('../math/Spinor3');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Vector3 = require('../math/Vector3');
/**
 * Node implements UniformData required for manipulating a body.
 */
declare class Node implements UniformData {
    position: Vector3;
    attitude: Spinor3;
    scale: Vector3;
    color: Vector3;
    /**
     * Node implements UniformData required for manipulating a body.
     */
    constructor();
    accept(visitor: UniformDataVisitor): void;
}
export = Node;
