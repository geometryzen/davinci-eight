define(["require", "exports", '../core', '../scene/MonitorList', '../collections/NumberIUnknownMap', '../checks/mustBeInteger', '../checks/mustBeString', '../utils/uuid4', '../utils/refChange', '../programs/SimpleWebGLProgram'], function (require, exports, core, MonitorList, NumberIUnknownMap, mustBeInteger, mustBeString, uuid4, refChange, SimpleWebGLProgram) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME_IMATERIAL = 'IMaterial';
    /**
     * Creates a WebGLProgram with compiled and linked shaders.
     */
    // FIXME: Handle list of shaders? Else createSimpleProgram
    var createMaterial = function (monitors, vertexShader, fragmentShader, attribs) {
        MonitorList.verify('monitors', monitors, function () { return "createMaterial"; });
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
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    return program.attributes;
                }
            },
            uniforms: function (canvasId) {
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
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    program.contextLost(canvasId);
                    programsByCanvasId.remove(canvasId);
                }
            },
            get programId() {
                return uuid;
            },
            use: function (canvasId) {
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
                mustBeString('name', name);
                mustBeInteger('canvasId', canvasId);
                var program = programsByCanvasId.getWeakRef(canvasId);
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.matrix4(transpose, matrix);
                    }
                }
                else {
                    if (core.verbose) {
                        console.warn("Ignoring uniformMatrix4 for " + name + " because `typeof canvasId` is " + typeof canvasId);
                    }
                }
            },
            uniformCartesian2: function (name, vector, canvasId) {
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
            uniformCartesian3: function (name, vector, canvasId) {
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
            uniformCartesian4: function (name, vector, canvasId) {
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
    return createMaterial;
});
