import Rotor3 = require('../math/Rotor3');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Vector3 = require('../math/Vector3');
/**
 * Model implements UniformData required for manipulating a body.
 */
declare class Model implements UniformData {
    position: Vector3;
    attitude: Rotor3;
    scale: Vector3;
    color: Vector3;
    private M;
    private N;
    private R;
    private S;
    private T;
    constructor();
    setUniforms(visitor: UniformDataVisitor, canvasId: number): void;
}
export = Model;
