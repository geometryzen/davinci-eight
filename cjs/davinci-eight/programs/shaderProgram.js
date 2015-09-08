var isDefined = require('../checks/isDefined');
var uuid4 = require('../utils/uuid4');
var AttribLocation = require('../core/AttribLocation');
var UniformLocation = require('../core/UniformLocation');
var shaderProgram = function (monitor, vertexShader, fragmentShader, attribs) {
    if (typeof vertexShader !== 'string') {
        throw new Error("vertexShader argument must be a string.");
    }
    if (typeof fragmentShader !== 'string') {
        throw new Error("fragmentShader argument must be a string.");
    }
    var refCount = 1;
    var program;
    var $context;
    var uuid = uuid4().generate();
    var attributeLocations = {};
    var uniformLocations = {};
    var self = {
        get vertexShader() {
            return vertexShader;
        },
        get fragmentShader() {
            return fragmentShader;
        },
        get attributes() {
            return attributeLocations;
        },
        get uniforms() {
            return uniformLocations;
        },
        addRef: function () {
            refCount++;
            // console.log("shaderProgram.addRef() => " + refCount);
            return refCount;
        },
        release: function () {
            refCount--;
            // console.log("shaderProgram.release() => " + refCount);
            if (refCount === 0) {
                self.contextFree();
            }
            return refCount;
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
                program = makeWebGLProgram(context, vertexShader, fragmentShader, attribs);
                var activeAttributes = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
                for (var a = 0; a < activeAttributes; a++) {
                    var activeInfo = context.getActiveAttrib(program, a);
                    var name_1 = activeInfo.name;
                    if (!attributeLocations[name_1]) {
                        attributeLocations[name_1] = new AttribLocation(monitor, name_1);
                    }
                }
                var activeUniforms = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
                for (var u = 0; u < activeUniforms; u++) {
                    var activeInfo = context.getActiveUniform(program, u);
                    var name_2 = activeInfo.name;
                    if (!uniformLocations[name_2]) {
                        uniformLocations[name_2] = new UniformLocation(monitor, name_2);
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
        enableAttrib: function (name) {
            var attribLoc = attributeLocations[name];
            if (attribLoc) {
                attribLoc.enable();
            }
        },
        setAttributes: function (values) {
            for (var name in attributeLocations) {
                var attribLoc = attributeLocations[name];
                var data = values[name];
                if (data) {
                    data.buffer.bind($context.ARRAY_BUFFER);
                    attribLoc.vertexPointer(data.size, data.normalized, data.stride, data.offset);
                }
                else {
                    throw new Error("The mesh does not support the attribute variable named " + name);
                }
            }
        },
        uniform1f: function (name, x) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.uniform1f(x);
            }
        },
        uniform2f: function (name, x, y) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.uniform2f(x, y);
            }
        },
        uniform3f: function (name, x, y, z) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.uniform3f(x, y, z);
            }
        },
        uniform4f: function (name, x, y, z, w) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.uniform4f(x, y, z, w);
            }
        },
        uniformMatrix1: function (name, transpose, matrix) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.matrix1(transpose, matrix);
            }
        },
        uniformMatrix2: function (name, transpose, matrix) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.matrix2(transpose, matrix);
            }
        },
        uniformMatrix3: function (name, transpose, matrix) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.matrix3(transpose, matrix);
            }
        },
        uniformMatrix4: function (name, transpose, matrix) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.matrix4(transpose, matrix);
            }
        },
        uniformVector1: function (name, vector) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.vector1(vector);
            }
        },
        uniformVector2: function (name, vector) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.vector2(vector);
            }
        },
        uniformVector3: function (name, vector) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.vector3(vector);
            }
        },
        uniformVector4: function (name, vector) {
            var uniformLoc = uniformLocations[name];
            if (uniformLoc) {
                uniformLoc.vector4(vector);
            }
        }
    };
    return self;
};
function makeWebGLShader(ctx, source, type) {
    var shader = ctx.createShader(type);
    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);
    var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
    if (compiled) {
        return shader;
    }
    else {
        if (!ctx.isContextLost()) {
            var message = ctx.getShaderInfoLog(shader);
            ctx.deleteShader(shader);
            throw new Error("Error compiling shader: " + message);
        }
        else {
            throw new Error("Context lost while compiling shader");
        }
    }
}
/**
 * Creates a WebGLProgram with compiled and linked shaders.
 */
function makeWebGLProgram(ctx, vertexShader, fragmentShader, attribs) {
    // create our shaders
    var vs = makeWebGLShader(ctx, vertexShader, ctx.VERTEX_SHADER);
    var fs = makeWebGLShader(ctx, fragmentShader, ctx.FRAGMENT_SHADER);
    // Create the program object.
    var program = ctx.createProgram();
    // console.log("WebGLProgram created");
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
module.exports = shaderProgram;
