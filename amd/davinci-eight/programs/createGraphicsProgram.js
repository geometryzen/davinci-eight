define(["require", "exports", '../scene/MonitorList', '../utils/uuid4', '../utils/refChange', '../programs/SimpleWebGLProgram'], function (require, exports, MonitorList_1, uuid4_1, refChange_1, SimpleWebGLProgram_1) {
    var LOGGING_NAME_IMATERIAL = 'IGraphicsProgram';
    function createGraphicsProgram(monitors, vertexShader, fragmentShader, attribs) {
        MonitorList_1.default.verify('monitors', monitors, function () { return "createGraphicsProgram"; });
        if (typeof vertexShader !== 'string') {
            throw new Error("vertexShader argument must be a string.");
        }
        if (typeof fragmentShader !== 'string') {
            throw new Error("fragmentShader argument must be a string.");
        }
        var refCount = 1;
        var program;
        var uuid = uuid4_1.default().generate();
        var self = {
            get vertexShader() {
                return vertexShader;
            },
            get fragmentShader() {
                return fragmentShader;
            },
            attributes: function () {
                if (program) {
                    return program.attributes;
                }
            },
            uniforms: function () {
                if (program) {
                    return program.uniforms;
                }
            },
            addRef: function () {
                refChange_1.default(uuid, LOGGING_NAME_IMATERIAL, +1);
                refCount++;
                return refCount;
            },
            release: function () {
                refChange_1.default(uuid, LOGGING_NAME_IMATERIAL, -1);
                refCount--;
                if (refCount === 0) {
                    MonitorList_1.default.removeContextListener(self, monitors);
                    if (program) {
                        program.release();
                    }
                }
                return refCount;
            },
            contextFree: function (manager) {
                if (program) {
                    program.contextFree(manager);
                    program = void 0;
                }
            },
            contextGain: function (manager) {
                if (!program) {
                    program = new SimpleWebGLProgram_1.default(manager, vertexShader, fragmentShader, attribs);
                }
                program.contextGain(manager);
            },
            contextLost: function () {
                if (program) {
                    program.contextLost();
                    program = void 0;
                }
            },
            get uuid() {
                return uuid;
            },
            use: function () {
                if (program) {
                    program.use();
                }
            },
            enableAttrib: function (name) {
                if (program) {
                    var attribLoc = program.attributes[name];
                    if (attribLoc) {
                        attribLoc.enable();
                    }
                    else {
                    }
                }
            },
            disableAttrib: function (name) {
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
            uniform1f: function (name, x) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform1f(x);
                    }
                }
            },
            uniform2f: function (name, x, y) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform2f(x, y);
                    }
                }
            },
            uniform3f: function (name, x, y, z) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform3f(x, y, z);
                    }
                }
            },
            uniform4f: function (name, x, y, z, w) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.uniform4f(x, y, z, w);
                    }
                }
            },
            mat2: function (name, matrix, transpose) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.mat2(matrix, transpose);
                    }
                }
            },
            mat3: function (name, matrix, transpose) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.mat3(matrix, transpose);
                    }
                }
            },
            mat4: function (name, matrix, transpose) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.mat4(matrix, transpose);
                    }
                }
            },
            vec2: function (name, vector) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vec2(vector);
                    }
                }
            },
            vec3: function (name, vector) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vec3(vector);
                    }
                }
            },
            vec4: function (name, vector) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vec4(vector);
                    }
                }
            },
            vector2: function (name, data) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vector2(data);
                    }
                }
            },
            vector3: function (name, data) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vector3(data);
                    }
                }
            },
            vector4: function (name, data) {
                if (program) {
                    var uniformLoc = program.uniforms[name];
                    if (uniformLoc) {
                        uniformLoc.vector4(data);
                    }
                }
            }
        };
        MonitorList_1.default.addContextListener(self, monitors);
        MonitorList_1.default.synchronize(self, monitors);
        refChange_1.default(uuid, LOGGING_NAME_IMATERIAL, +1);
        return self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createGraphicsProgram;
});
