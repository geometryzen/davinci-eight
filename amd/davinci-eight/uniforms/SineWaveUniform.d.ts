import Shareable = require('../utils/Shareable');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
declare class SineWaveUniform extends Shareable implements UniformData {
    amplitude: number;
    omega: number;
    mean: number;
    uName: string;
    constructor(omega: number, uName?: string);
    setUniforms(visitor: UniformDataVisitor, canvasId: number): void;
}
export = SineWaveUniform;
