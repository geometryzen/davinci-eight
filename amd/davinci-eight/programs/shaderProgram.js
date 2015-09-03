define(["require", "exports", '../checks/expectArg', '../checks/isDefined', '../utils/uuid4', '../core/ShaderAttribLocation', '../core/ShaderUniformLocation', '../programs/setUniforms'], function (require, exports, expectArg, isDefined, uuid4, ShaderAttribLocation, ShaderUniformLocation, setUniforms) {
    var shaderProgram = function (vertexShader, fragmentShader, uuid) {
        if (uuid === void 0) { uuid = uuid4().generate(); }
        if (typeof vertexShader !== 'string') {
            throw new Error("vertexShader argument must be a string.");
        }
        if (typeof fragmentShader !== 'string') {
            throw new Error("fragmentShader argument must be a string.");
        }
        var refCount = 0;
        var program;
        var $context;
        var attributeLocations = {};
        var uniformLocations = {};
        var uniformSetters = {};
        var self = {
            get vertexShader() {
                return vertexShader;
            },
            get fragmentShader() {
                return fragmentShader;
            },
            get attributeLocations() {
                return attributeLocations;
            },
            get uniformLocations() {
                return uniformLocations;
            },
            get uniformSetters() {
                return uniformSetters;
            },
            addRef: function () {
                refCount++;
                // console.log("shaderProgram.addRef() => " + refCount);
            },
            release: function () {
                refCount--;
                // console.log("shaderProgram.release() => " + refCount);
                if (refCount === 0) {
                    self.contextFree();
                }
            },
            contextFree: function () {
                if (isDefined($context)) {
                    if (program) {
                        // console.log("WebGLProgram deleted");
                        $context.deleteProgram(program);
                        program = void 0;
                    }
                    $context = void 0;
                    for (var aName in attributeLocations) {
                        attributeLocations[aName].contextFree();
                    }
                    for (var uName in uniformLocations) {
                        uniformLocations[uName].contextFree();
                    }
                }
            },
            contextGain: function (context) {
                if ($context !== context) {
                    self.contextFree();
                    $context = context;
                    program = makeWebGLProgram(context, vertexShader, fragmentShader);
                    var activeAttributes = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
                    for (var a = 0; a < activeAttributes; a++) {
                        var activeInfo = context.getActiveAttrib(program, a);
                        var name_1 = activeInfo.name;
                        // The following properties don't correspond directly wuth those used.
                        // If the attribute or uniform is an array, this will be the number of elements in the array. Otherwise, this will be 1.
                        var size = activeInfo.size;
                        var type = activeInfo.type;
                        if (!attributeLocations[name_1]) {
                            // TODO: Since name MUST be part of Location, maybe should use an array?
                            attributeLocations[name_1] = new ShaderAttribLocation(name_1, activeInfo.size, activeInfo.type);
                        }
                    }
                    var activeUniforms = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
                    for (var u = 0; u < activeUniforms; u++) {
                        var activeInfo = context.getActiveUniform(program, u);
                        var name_2 = activeInfo.name;
                        if (!uniformLocations[name_2]) {
                            // TODO: Seems like we should be able to make use of the size and type?
                            uniformLocations[name_2] = new ShaderUniformLocation(name_2);
                            // TODO: Seems like create setter S/B redundant.
                            uniformSetters[name_2] = uniformLocations[name_2].createSetter(context, activeInfo);
                        }
                    }
                    for (var aName in attributeLocations) {
                        attributeLocations[aName].contextGain(context, program);
                    }
                    for (var uName in uniformLocations) {
                        uniformLocations[uName].contextGain(context, program);
                    }
                }
            },
            contextLoss: function () {
                program = void 0;
                $context = void 0;
                for (var aName in attributeLocations) {
                    attributeLocations[aName].contextLoss();
                }
                for (var uName in uniformLocations) {
                    uniformLocations[uName].contextLoss();
                }
            },
            hasContext: function () {
                return !!$context;
            },
            get program() { return program; },
            get programId() { return uuid; },
            use: function () {
                if ($context) {
                    $context.useProgram(program);
                }
                else {
                    console.warn("shaderProgram.use() missing WebGLRenderingContext");
                }
                return self;
            },
            setAttributes: function (values) {
                for (var name in attributeLocations) {
                    var slot = attributeLocations[name];
                    var data = values[slot.name];
                    if (data) {
                        data.buffer.bindBuffer();
                        slot.enable();
                        slot.vertexAttribPointer(data.numComponents, data.normalized, data.stride, data.offset);
                    }
                    else {
                        throw new Error("The mesh does not support the attribute variable named " + slot.name);
                    }
                }
            },
            setUniforms: function (values) {
                setUniforms(uniformSetters, values);
            },
            uniform1f: function (name, x, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform1f(x);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            },
            uniform1fv: function (name, data, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform1fv(data);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            },
            uniform2f: function (name, x, y, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform2f(x, y);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            },
            uniform2fv: function (name, data, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform2fv(data);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            },
            uniform3f: function (name, x, y, z, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform3f(x, y, z);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            },
            uniform3fv: function (name, data, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform3fv(data);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            },
            uniform4f: function (name, x, y, z, w, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform4f(x, y, z, w);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            },
            uniform4fv: function (name, data, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniform4fv(data);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            },
            uniformMatrix2fv: function (name, transpose, matrix, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniformMatrix2fv(transpose, matrix);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            },
            uniformMatrix3fv: function (name, transpose, matrix, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniformMatrix3fv(transpose, matrix);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            },
            uniformMatrix4fv: function (name, transpose, matrix, picky) {
                var uniformLoc = uniformLocations[name];
                if (uniformLoc) {
                    uniformLoc.uniformMatrix4fv(transpose, matrix);
                }
                else {
                    if (picky) {
                        expectArg('name', name).toSatisfy(false, name + " must be an active uniform");
                    }
                }
            }
        };
        return self;
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
        // console.log("WebGLProgram created");
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
            // console.log("WebGLProgram deleted");
            throw new Error("Error linking program: " + message);
        }
    }
    return shaderProgram;
});
