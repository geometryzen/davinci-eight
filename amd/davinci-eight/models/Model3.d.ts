import Spinor3 = require('../math/Spinor3');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Vector3 = require('../math/Vector3');
/**
 * Model3 implements UniformData required for manipulating a body.
 */
declare class Model3 implements UniformData {
    position: Vector3;
    attitude: Spinor3;
    scaleXYZ: Vector3;
    colorRGB: Vector3;
    private M;
    private N;
    private R;
    private S;
    private T;
    constructor();
    setUniforms(visitor: UniformDataVisitor, canvasId: number): void;
}
export = Model3;
