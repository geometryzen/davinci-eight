import DrawMode = require('../core/DrawMode');

function adapterOptions(options: {wireFrame?: boolean} = {wireFrame: false}) {
  let drawMode: DrawMode = options.wireFrame ? DrawMode.LINES : DrawMode.TRIANGLES;
  return {
      drawMode: drawMode
  };
}

export = adapterOptions;