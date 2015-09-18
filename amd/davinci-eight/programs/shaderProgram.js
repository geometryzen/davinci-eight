define(["require", "exports", '../core/AttribLocation', '../scene/MonitorList', '../utils/uuid4', '../core/UniformLocation', '../utils/refChange'], function (require, exports, AttribLocation, MonitorList, uuid4, UniformLocation, refChange) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_IPROGRAM = 'IProgram';
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
    // FIXME: Rename to program or createProgram
    // FIXME: Handle list of shaders? Else createSimpleProgram
    var shaderProgram = function (monitors, vertexShader, fragmentShader, attribs) {
        MonitorList.verify('monitors', monitors, function () { return "shaderProgram"; });
        // FIXME multi-context
        if (typeof vertexShader !== 'string') {
            throw new Error("vertexShader argument must be a string.");
        }
        if (typeof fragmentShader !== 'string') {
            throw new Error("fragmentShader argument must be a string.");
        }
        var refCount = 1;
        /**
         * Because we are multi-canvas aware, programs are tracked by the canvas id.
         */
        var programs = {};
        /**
         * Because we are multi-canvas aware, gls are tracked by the canvas id.
         * We need to hold onto a WebGLRenderingContext so that we can delete programs.
         */
        var gls = {};
        var uuid = uuid4().generate();
        // This looks wrong.
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
                refChange(uuid, LOGGING_NAME_IPROGRAM, +1);
                refCount++;
                return refCount;
            },
            release: function () {
                refChange(uuid, LOGGING_NAME_IPROGRAM, -1);
                refCount--;
                if (refCount === 0) {
                    MonitorList.removeContextListener(self, monitors);
                    var keys = Object.keys(gls).map(function (key) { return parseInt(key); });
                    var keysLength = keys.length;
                    for (var k = 0; k < keysLength; k++) {
                        var canvasId = keys[k];
                        self.contextFree(canvasId);
                    }
                }
                return refCount;
            },
            contextFree: function (canvasId) {
                var $context = gls[canvasId];
                if ($context) {
                    var program = programs[canvasId];
                    if (program) {
                        $context.deleteProgram(program);
                        programs[canvasId] = void 0;
                    }
                    gls[canvasId] = void 0;
                    for (var aName in attributeLocations) {
                        attributeLocations[aName].contextFree();
                    }
                    for (var uName in uniformLocations) {
                        uniformLocations[uName].contextFree();
                    }
                }
            },
            contextGain: function (manager) {
                // FIXME: multi-canvas
                var canvasId = manager.canvasId;
                if (gls[canvasId] !== manager.gl) {
                    self.contextFree(canvasId);
                    gls[canvasId] = manager.gl;
                    var context = manager.gl;
                    var program = makeWebGLProgram(context, vertexShader, fragmentShader, attribs);
                    programs[manager.canvasId] = program;
                    var activeAttributes = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
                    for (var a = 0; a < activeAttributes; a++) {
                        var activeAttribInfo = context.getActiveAttrib(program, a);
                        var name_1 = activeAttribInfo.name;
                        if (!attributeLocations[name_1]) {
                            attributeLocations[name_1] = new AttribLocation(manager, name_1);
                        }
                    }
                    var activeUniforms = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
                    for (var u = 0; u < activeUniforms; u++) {
                        var activeUniformInfo = context.getActiveUniform(program, u);
                        var name_2 = activeUniformInfo.name;
                        if (!uniformLocations[name_2]) {
                            uniformLocations[name_2] = new UniformLocation(manager, name_2);
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
            contextLoss: function (canvasId) {
                programs[canvasId] = void 0;
                gls[canvasId] = void 0;
                for (var aName in attributeLocations) {
                    attributeLocations[aName].contextLoss();
                }
                for (var uName in uniformLocations) {
                    uniformLocations[uName].contextLoss();
                }
            },
            // FIXME: Dead code?
            /*
            get program() {
              console.warn("shaderProgram program property is assuming canvas id = 0");
              let canvasId = 0;
              let program: WebGLProgram = programs[canvasId];
              // It's a WebGLProgram, no reference count management required.
              return program;
            },
            */
            get programId() {
                return uuid;
            },
            use: function (canvasId) {
                var gl = gls[canvasId];
                if (gl) {
                    var program = programs[canvasId];
                    gl.useProgram(program);
                }
                else {
                    console.warn(LOGGING_NAME_IPROGRAM + " use(canvasId: number) missing WebGLRenderingContext");
                }
            },
            enableAttrib: function (name) {
                var attribLoc = attributeLocations[name];
                if (attribLoc) {
                    attribLoc.enable();
                }
            },
            disableAttrib: function (name) {
                var attribLoc = attributeLocations[name];
                if (attribLoc) {
                    attribLoc.disable();
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
        MonitorList.addContextListener(self, monitors);
        refChange(uuid, LOGGING_NAME_IPROGRAM, +1);
        return self;
    };
    return shaderProgram;
});
