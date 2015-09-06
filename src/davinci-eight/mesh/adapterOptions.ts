import DrawMode = require('../core/DrawMode');
import Symbolic = require('../core/Symbolic');

function adapterOptions(options: {
    wireFrame?: boolean,
    elementUsage?: number,
    positionVarName?: string,
    normalVarName?: string
  } = {
    wireFrame: false
  }) {
  let drawMode: DrawMode = options.wireFrame ? DrawMode.LINES : DrawMode.TRIANGLES;
  let elementUsage: number = options.elementUsage;
  let positionVarName: string = options.positionVarName || Symbolic.ATTRIBUTE_POSITION;
  let normalVarName: string = options.normalVarName || Symbolic.ATTRIBUTE_NORMAL;
  return {
      drawMode: drawMode,
      elementUsage: elementUsage,
      positionVarName: positionVarName,
      normalVarName: normalVarName
  };
}

export = adapterOptions;