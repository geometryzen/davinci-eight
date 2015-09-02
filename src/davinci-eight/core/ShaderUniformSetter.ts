//import RenderingContextProgramUser = require('../core/RenderingContextProgramUser');
import UniformDataInfo = require('../core/UniformDataInfo');

interface ShaderUniformSetter {
  (data: UniformDataInfo): void
}

export = ShaderUniformSetter;
