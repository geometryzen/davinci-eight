import DrawMode = require('../core/DrawMode');
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols');

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
  let positionVarName: string = options.positionVarName || GraphicsProgramSymbols.ATTRIBUTE_POSITION;
  let normalVarName: string = options.normalVarName || GraphicsProgramSymbols.ATTRIBUTE_NORMAL;
  return {
      drawMode: drawMode,
      elementUsage: elementUsage,
      positionVarName: positionVarName,
      normalVarName: normalVarName
  };
}

export = adapterOptions;