import IRigidBody3 = require('../models/IRigidBody3');
import Shareable = require('../utils/Shareable');
import Spinor3 = require('../math/Spinor3');
import Vector3 = require('../math/Vector3');
/**
 * A model for a rigid body in 3-dimensional space.
 * This class may be used concretely or extended.
 * @class RigidBody3
 */
declare class RigidBody3 extends Shareable implements IRigidBody3 {
    private _attitude;
    private _position;
    /**
     * The `attitude` is initialized to the default for `Spinor3`.
     * The `position` is initialized to the default for `Vector3`.
     * This class assumes that it is being used concretely if the type is 'RigidBody3'.
     * @class RigidBody3
     * @constructor
     * @param type {string} The class name of the derived class. Defaults to 'RigidBody3'.
     */
    constructor(type?: string);
    protected destructor(): void;
    /**
     * The attitude spinor of the rigid body.
     * @property attitude
     * @type Spinor3
     * @readonly
     */
    attitude: Spinor3;
    /**
     * The position vector of the rigid body.
     * @property position
     * @type Vector3
     * @readonly
     */
    position: Vector3;
}
export = RigidBody3;
