define(["require", "exports", '../glsl/parse', '../glsl/NodeWalker', '../glsl/ProgramArgs', '../utils/uuid4'], function (require, exports, parse, NodeWalker, ProgramArgs, uuid4) {
    var shaderMaterial = function () {
        var vertexShader;
        var fragmentShader;
        var program;
        var programId;
        var contextGainId;
        var attributes = [];
        var uniforms = [];
        var varyings = [];
        var publicAPI = {
            get vertexShader() {
                return vertexShader;
            },
            set vertexShader(value) {
                try {
                    var program_1 = parse(value);
                    vertexShader = value;
                    var walker = new NodeWalker();
                    var args = new ProgramArgs();
                    walker.walk(program_1, args);
                    attributes = args.attributes.map(function (a) { return { modifiers: a.modifiers, type: a.type, name: a.name }; });
                    uniforms = args.uniforms.map(function (u) { return { modifiers: u.modifiers, type: u.type, name: u.name }; });
                    varyings = args.varyings.map(function (v) { return { modifiers: v.modifiers, type: v.type, name: v.name }; });
                }
                catch (e) {
                    console.log(e);
                }
            },
            get fragmentShader() {
                return fragmentShader;
            },
            set fragmentShader(value) {
                try {
                    var fragTree = parse(value);
                    fragmentShader = value;
                }
                catch (e) {
                    console.log(e);
                }
            },
            get attributes() {
                return attributes;
            },
            get uniforms() {
                return uniforms;
            },
            get varyings() {
                return varyings;
            },
            contextFree: function (context) {
                if (program) {
                    context.deleteProgram(program);
                    program = void 0;
                    programId = void 0;
                    contextGainId = void 0;
                }
            },
            contextGain: function (context, contextId) {
                if (contextGainId !== contextId) {
                    program = makeProgram(context, vertexShader, fragmentShader);
                    programId = uuid4().generate();
                    contextGainId = contextId;
                }
            },
            contextLoss: function () {
                program = void 0;
                programId = void 0;
                contextGainId = void 0;
            },
            hasContext: function () {
                return !!program;
            },
            get program() { return program; },
            get programId() { return programId; }
        };
        return publicAPI;
    };
    /**
     * Creates a WebGLProgram with compiled and linked shaders.
     */
    function makeProgram(gl, vertexShader, fragmentShader) {
        // TODO: Proper cleanup if we throw an error at any point.
        var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertexShader);
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(vs));
        }
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragmentShader);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(fs));
        }
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program));
        }
        return program;
    }
    return shaderMaterial;
});