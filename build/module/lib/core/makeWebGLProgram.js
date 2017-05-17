import { makeWebGLShader } from './makeWebGLShader';
export function makeWebGLProgram(ctx, vertexShaderSrc, fragmentShaderSrc, attribs) {
    // create our shaders
    var vs = makeWebGLShader(ctx, vertexShaderSrc, ctx.VERTEX_SHADER);
    var fs = makeWebGLShader(ctx, fragmentShaderSrc, ctx.FRAGMENT_SHADER);
    // Create the program object.
    var program = ctx.createProgram();
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
    var linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
    if (linked || ctx.isContextLost()) {
        return program;
    }
    else {
        var message = ctx.getProgramInfoLog(program);
        ctx.detachShader(program, vs);
        ctx.deleteShader(vs);
        ctx.detachShader(program, fs);
        ctx.deleteShader(fs);
        ctx.deleteProgram(program);
        throw new Error("Error linking program: " + message);
    }
}
