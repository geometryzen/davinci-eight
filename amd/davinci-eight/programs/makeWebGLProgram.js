define(["require", "exports", '../programs/makeWebGLShader'], function (require, exports, makeWebGLShader_1) {
    function makeWebGLProgram(ctx, vertexShader, fragmentShader, attribs) {
        var vs = makeWebGLShader_1.default(ctx, vertexShader, ctx.VERTEX_SHADER);
        var fs = makeWebGLShader_1.default(ctx, fragmentShader, ctx.FRAGMENT_SHADER);
        var program = ctx.createProgram();
        ctx.attachShader(program, vs);
        ctx.attachShader(program, fs);
        for (var index = 0; index < attribs.length; ++index) {
            ctx.bindAttribLocation(program, index, attribs[index]);
        }
        ctx.linkProgram(program);
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = makeWebGLProgram;
});
