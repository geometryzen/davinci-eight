define(["require", "exports", '../scene/MonitorList', '../collections/NumberIUnknownMap', '../checks/mustBeInteger', '../checks/mustBeString', '../utils/uuid4', '../utils/refChange', '../programs/SimpleWebGLProgram'], function (require, exports, MonitorList, NumberIUnknownMap, mustBeInteger, mustBeString, uuid4, refChange, SimpleWebGLProgram) {
    // We should be able to set this to any integer.
    var DEFAULT_CANVAS_ID = 0;
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_IMATERIAL = 'IGraphicsProgram';
    /**
     * Creates a WebGLProgram with compiled and linked shaders.
     */
    // FIXME: Handle list of shaders? Else createSimpleProgram
    var createGraphicsProgram = function (monitors, vertexShader, fragmentShader, attribs) {
        MonitorList.verify('monitors', monitors, function () { return "createGraphicsProgram"; });
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
        var programsByCanvasId = new NumberIUnknownMap();
        var uuid = uuid4().generate();
        var self = {
            get vertexShader() {
                return vertexShader;
            },
            get fragmentShader() {
                return fragmentShader;
            },
            attributes: function (canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    return program.attributes;
                }
            },
            uniforms: function (canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    return program.uniforms;
                }
            },
            addRef: function () {
                refChange(uuid, LOGGING_NAME_IMATERIAL, +1);
                refCount++;
                return refCount;
            },
            release: function () {
                refChange(uuid, LOGGING_NAME_IMATERIAL, -1);
                refCount--;
                if (refCount === 0) {
                    MonitorList.removeContextListener(self, monitors);
                    programsByCanvasId.release();
                }
                return refCount;
            },
            contextFree: function (canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    program.contextFree(canvasId);
                    programsByCanvasId.remove(canvasId);
                }
            },
            contextGain: function (manager) {
                var canvasId;
                var sprog;
                canvasId = manager.canvasId;
                if (!programsByCanvasId.exists(canvasId)) {
                    sprog = new SimpleWebGLProgram(manager, vertexShader, fragmentShader, attribs);
                    programsByCanvasId.putWeakRef(canvasId, sprog);
                }
                else {
                    sprog = programsByCanvasId.getWeakRef(canvasId);
                }
                sprog.contextGain(manager);
            },
            contextLost: function (canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    program.contextLost(canvasId);
                    programsByCanvasId.remove(canvasId);
                }
            },
            get uuid() {
                return uuid;
            },
            use: function (canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    program.use();
                }
                else {
                    console.warn(LOGGING_NAME_IMATERIAL + " use(canvasId: number) missing WebGLRenderingContext");
                }
            },
            enableAttrib: function (name, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var attribLoc = program.attributes[name];
                    if (attribLoc) {
                        attribLoc.enable();
                    }
                    else {
                    }
                }
                else {
                }
            },
            disableAttrib: function (name, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var attribLoc = program.attributes[name];
                    if (attribLoc) {
                        attribLoc.enable();
                    }
                    else {
                    }
                }
                else {
                }
            },
            uniform1f: function (name, x, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform1f(x);
                    }
                    else {
                    }
                }
                else {
                }
            },
            uniform2f: function (name, x, y, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform2f(x, y);
                    }
                }
            },
            uniform3f: function (name, x, y, z, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform3f(x, y, z);
                    }
                }
            },
            uniform4f: function (name, x, y, z, w, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform4f(x, y, z, w);
                    }
                }
            },
            uniformMatrix2: function (name, transpose, matrix, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.matrix2(transpose, matrix);
                    }
                }
            },
            uniformMatrix3: function (name, transpose, matrix, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.matrix3(transpose, matrix);
                    }
                }
            },
            uniformMatrix4: function (name, transpose, matrix, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.matrix4(transpose, matrix);
                    }
                }
            },
            uniformVectorE2: function (name, vector, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.cartesian2(vector);
                    }
                }
            },
            uniformVectorE3: function (name, vector, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.cartesian3(vector);
                    }
                }
            },
            uniformVectorE4: function (name, vector, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.cartesian4(vector);
                    }
                }
            },
            vector2: function (name, data, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vector2(data);
                    }
                }
            },
            vector3: function (name, data, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vector3(data);
                    }
                }
            },
            vector4: function (name, data, canvasId) {
                if (canvasId === void 0) { canvasId = DEFAULT_CANVAS_ID; }
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vector4(data);
                    }
                }
            }
        };
        MonitorList.addContextListener(self, monitors);
        MonitorList.synchronize(self, monitors);
        refChange(uuid, LOGGING_NAME_IMATERIAL, +1);
        return self;
    };
    return createGraphicsProgram;
});
