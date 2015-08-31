//import RenderingContextProgramUser = require('../core/RenderingContextProgramUser');
import UniformDataInfo = require('../core/UniformDataInfo');

interface UniformSetter {
  (data: UniformDataInfo): void
}

export = UniformSetter;
