import Vector3 = require('../math/Vector3');
import Spinor3 = require('../math/Spinor3');
/**
 * Interface for a node in a model.
 * This interface provides the contract for the class and functional constructor implementations.
 * @class Node3D
 */
interface Node3D {
    /**
     * Object's local position.
     * @property position
     * @type Vector3
     * @default new Vector3(0, 0, 0)
     */
    position: Vector3;
    /**
     * Object's local attitude.
     * @property attitude
     * @type Spinor3
     * @default new Spinor3()
     */
    attitude: Spinor3;
    /**
     * Object's local scale.
     * @property scale
     * @type Vector3
     */
    scale: Vector3;
    /**
     * Object's parent in the model.
     * @property parent
     * @type Node3D
     * @default null
     */
    parent: Node3D;
    /**
     * Array containing the object's children in the model.
     * @property children
     * @type Node3D[]
     * @default []
     */
    children: Node3D[];
}
export = Node3D;
