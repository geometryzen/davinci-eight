define(["require", "exports", '../utils/uuid4', '../core/ShaderAttribLocation', '../core/ShaderUniformLocation', '../programs/createAttributeSetters', '../programs/setUniforms', '../programs/glslType'], function (require, exports, uuid4, ShaderAttribLocation, ShaderUniformLocation, createAttributeSetters, setUniforms, glslType) {
    var shaderProgram = function (vertexShader, fragmentShader) {
        if (typeof vertexShader !== 'string') {
            throw new Error("vertexShader argument must be a string.");
        }
        if (typeof fragmentShader !== 'string') {
            throw new Error("fragmentShader argument must be a string.");
        }
        var program;
        var programId;
        var context;
        var contextGainId;
        var attributeLocations = {};
        var attribSetters = {};
        var uniformLocations = {};
        var uniformSetters = {};
        var publicAPI = {
            get vertexShader() {
                return vertexShader;
            },
            get fragmentShader() {
                return fragmentShader;
            },
            get attributeLocations() {
                return attributeLocations;
            },
            get attribSetters() {
                return attribSetters;
            },
            get uniformLocations() {
                return uniformLocations;
            },
            get uniformSetters() {
                return uniformSetters;
            },
            contextFree: function () {
                if (program) {
                    context.deleteProgram(program);
                    program = void 0;
                    programId = void 0;
                    context = void 0;
                    contextGainId = void 0;
                    for (var aName in attributeLocations) {
                        attributeLocations[aName].contextFree();
                    }
                    for (var uName in uniformLocations) {
                        uniformLocations[uName].contextFree();
                    }
                }
            },
            contextGain: function (contextArg, contextId) {
                context = contextArg;
                if (contextGainId !== contextId) {
                    program = makeWebGLProgram(context, vertexShader, fragmentShader);
                    programId = uuid4().generate();
                    contextGainId = contextId;
                    var activeAttributes = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
                    for (var a = 0; a < activeAttributes; a++) {
                        var activeInfo = context.getActiveAttrib(program, a);
                        activeInfo.size; // What is this used for?
                        activeInfo.type;
                        if (!attributeLocations[activeInfo.name]) {
                            attributeLocations[activeInfo.name] = new ShaderAttribLocation(activeInfo.name, glslType(activeInfo.type, context));
                        }
                    }
                    var activeUniforms = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
                    for (var u = 0; u < activeUniforms; u++) {
                        var activeInfo = context.getActiveUniform(program, u);
                        if (!uniformLocations[activeInfo.name]) {
                            uniformLocations[activeInfo.name] = new ShaderUniformLocation(activeInfo.name, glslType(activeInfo.type, context));
                            uniformSetters[activeInfo.name] = uniformLocations[activeInfo.name].createSetter(context, activeInfo);
                        }
                    }
                    // Broadcast contextGain to attribute and uniform locations.
                    for (var aName in attributeLocations) {
                        attributeLocations[aName].contextGain(contextArg, program, contextId);
                    }
                    Object.keys(uniformLocations).forEach(function (uName) {
                        uniformLocations[uName].contextGain(contextArg, program, contextId);
                    });
                    attribSetters = createAttributeSetters(contextArg, program);
                }
            },
            contextLoss: function () {
                program = void 0;
                programId = void 0;
                context = void 0;
                contextGainId = void 0;
                for (var aName in attributeLocations) {
                    attributeLocations[aName].contextLoss();
                }
                for (var uName in uniformLocations) {
                    uniformLocations[uName].contextLoss();
                }
            },
            hasContext: function () {
                return !!program;
            },
            get program() { return program; },
            get programId() { return programId; },
            use: function () {
                if (context) {
                    context.useProgram(program);
                }
                return publicAPI;
            },
            setUniforms: function (values) {
                setUniforms(uniformSetters, values);
            }
        };
        return publicAPI;
    };
    function makeWebGLShader(gl, source, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        }
        else {
            var message = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error("Error compiling shader: " + message);
        }
    }
    /**
     * Creates a WebGLProgram with compiled and linked shaders.
     */
    function makeWebGLProgram(gl, vertexShader, fragmentShader) {
        var vs = makeWebGLShader(gl, vertexShader, gl.VERTEX_SHADER);
        var fs = makeWebGLShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return program;
        }
        else {
            var message = gl.getProgramInfoLog(program);
            gl.detachShader(program, vs);
            gl.deleteShader(vs);
            gl.detachShader(program, fs);
            gl.deleteShader(fs);
            gl.deleteProgram(program);
            throw new Error("Error linking program: " + message);
        }
    }
    return shaderProgram;
});
