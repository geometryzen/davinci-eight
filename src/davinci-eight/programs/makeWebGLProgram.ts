import makeWebGLShader = require('../programs/makeWebGLShader');

function makeWebGLProgram(ctx: WebGLRenderingContext, vertexShader: string, fragmentShader: string, attribs: string[]): WebGLProgram {
  // create our shaders
  let vs: WebGLShader = makeWebGLShader(ctx, vertexShader, ctx.VERTEX_SHADER);
  let fs: WebGLShader = makeWebGLShader(ctx, fragmentShader, ctx.FRAGMENT_SHADER);

  // Create the program object.
  let program = ctx.createProgram();

  // Attach our two shaders to the program.
  ctx.attachShader(program, vs);
  ctx.attachShader(program, fs);

  // Bind attributes allows us to specify the index that an attribute should be bound to.
  for (var index = 0; index < attribs.length; ++index) {
    ctx.bindAttribLocation(program, index, attribs[index]);
  }

  // Link the program.
  ctx.linkProgram(program);

  // Check the link status
  let linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
  if (linked || ctx.isContextLost()) {
    return program;
  }
  else {
    let message: string = ctx.getProgramInfoLog(program);

    ctx.detachShader(program, vs);
    ctx.deleteShader(vs);

    ctx.detachShader(program, fs);
    ctx.deleteShader(fs);

    ctx.deleteProgram(program);

    throw new Error("Error linking program: " + message);
  }
}

export = makeWebGLProgram;
