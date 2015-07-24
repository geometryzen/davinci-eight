var parse = require('../glsl/parse');
var NodeWalker = require('../glsl/NodeWalker');
var ProgramArgs = require('../glsl/ProgramArgs');
var uuid4 = require('../utils/uuid4');
var ShaderAttributeLocation = require('../core/ShaderAttributeLocation');
var ShaderUniformLocation = require('../core/ShaderUniformLocation');
var shaderProgram = function (vertexShader, fragmentShader) {
    if (typeof vertexShader !== 'string') {
        throw new Error("vertexShader argument must be a string.");
    }
    if (typeof fragmentShader !== 'string') {
        throw new Error("fragmentShader argument must be a string.");
    }
    function analyze() {
        // TODO: uniform with same name in both files.
        // TODO: varying correlation.
        function shaderVariable(d) {
            return { modifiers: d.modifiers, type: d.type, name: d.name };
        }
        function analyzeVertexShader() {
            try {
                var vsTree = parse(vertexShader);
                var walker = new NodeWalker();
                var args = new ProgramArgs();
                walker.walk(vsTree, args);
                // attributes
                args.attributes.forEach(function (a) {
                    var attributeDecl = shaderVariable(a);
                    attributeDecls.push(attributeDecl);
                    attributeLocations[attributeDecl.name] = new ShaderAttributeLocation(attributeDecl.name, attributeDecl.type);
                });
                // uniforms
                args.uniforms.forEach(function (u) {
                    var uniformDecl = shaderVariable(u);
                    uniformDecls.push(uniformDecl);
                    uniformLocations[uniformDecl.name] = new ShaderUniformLocation(uniformDecl.name, uniformDecl.type);
                });
                // varyings
                args.varyings.forEach(function (v) {
                    var varyingDecl = shaderVariable(v);
                    varyingDecls.push(varyingDecl);
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        function analyzeFragmentShader() {
            try {
                var fsTree = parse(fragmentShader);
                var walker = new NodeWalker();
                var args = new ProgramArgs();
                walker.walk(fsTree, args);
                // attributes
                // uniforms
                args.uniforms.forEach(function (u) {
                    var uniformDecl = shaderVariable(u);
                    uniformDecls.push(uniformDecl);
                    uniformLocations[uniformDecl.name] = new ShaderUniformLocation(uniformDecl.name, uniformDecl.type);
                });
            }
            catch (e) {
                console.log(e);
            }
        }
        analyzeVertexShader();
        analyzeFragmentShader();
    }
    var program;
    var programId;
    var context;
    var contextGainId;
    var attributeDecls = [];
    var uniformDecls = [];
    var varyingDecls = [];
    var attributeLocations = {};
    var uniformLocations = {};
    var publicAPI = {
        get vertexShader() {
            return vertexShader;
        },
        get fragmentShader() {
            return fragmentShader;
        },
        get attributes() {
            return attributeDecls;
        },
        get uniforms() {
            return uniformDecls;
        },
        get varyings() {
            return varyingDecls;
        },
        contextFree: function () {
            if (program) {
                context.deleteProgram(program);
                program = void 0;
                programId = void 0;
                context = void 0;
                contextGainId = void 0;
                attributeDecls.forEach(function (attributeDecl) {
                    attributeLocations[attributeDecl.name].contextFree();
                });
                uniformDecls.forEach(function (uniformDecl) {
                    uniformLocations[uniformDecl.name].contextFree();
                });
            }
        },
        contextGain: function (contextArg, contextId) {
            context = contextArg;
            if (contextGainId !== contextId) {
                program = makeWebGLProgram(context, vertexShader, fragmentShader);
                programId = uuid4().generate();
                contextGainId = contextId;
                attributeDecls.forEach(function (attributeDecl) {
                    attributeLocations[attributeDecl.name].contextGain(contextArg, program);
                });
                uniformDecls.forEach(function (uniformDecl) {
                    uniformLocations[uniformDecl.name].contextGain(contextArg, program);
                });
            }
        },
        contextLoss: function () {
            program = void 0;
            programId = void 0;
            context = void 0;
            contextGainId = void 0;
            attributeDecls.forEach(function (attributeDecl) {
                attributeLocations[attributeDecl.name].contextLoss();
            });
            uniformDecls.forEach(function (uniformDecl) {
                uniformLocations[uniformDecl.name].contextLoss();
            });
        },
        hasContext: function () {
            return !!program;
        },
        get program() { return program; },
        get programId() { return programId; },
        use: function () {
            if (context) {
                return context.useProgram(program);
            }
        },
        attributeVariable: function (name) {
            if (attributeLocations[name]) {
                return attributeLocations[name];
            }
            else {
                throw new Error(name + " is not an attribute variable in the shader program.");
            }
        },
        uniformVariable: function (name) {
            if (uniformLocations[name]) {
                return uniformLocations[name];
            }
            else {
                throw new Error(name + " is not a uniform variable in the shader program.");
            }
        }
    };
    analyze();
    return publicAPI;
};
/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
function makeWebGLProgram(gl, vertexShader, fragmentShader) {
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
module.exports = shaderProgram;
