var expectArg = require('../checks/expectArg');
var isDefined = require('../checks/isDefined');
var uuid4 = require('../utils/uuid4');
var ShaderAttribLocation = require('../core/ShaderAttribLocation');
var ShaderUniformLocation = require('../core/ShaderUniformLocation');
var setUniforms = require('../programs/setUniforms');
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
        setUniform3fv: function (name, value) {
            // TODO: Unwrap and make more efficient.
            // TODO: Eliminate setters.
            expectArg('name', name).toBeString();
            var values = {};
            var data = {};
            data.vector = value;
            values[name] = data;
            setUniforms(uniformSetters, values);
        },
        setUniformMatrix4fv: function (name, matrix, transpose) {
            if (transpose === void 0) { transpose = false; }
            expectArg('name', name).toBeString();
            var uniformLocation = uniformLocations[name];
            if (uniformLocation) {
                uniformLocation.uniformMatrix4fv(transpose, matrix);
            }
            else {
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
module.exports = shaderProgram;
