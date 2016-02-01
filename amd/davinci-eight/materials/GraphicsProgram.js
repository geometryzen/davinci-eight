var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core', '../checks/isDefined', '../checks/isUndefined', '../scene/MonitorList', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, core_1, isDefined_1, isUndefined_1, MonitorList_1, mustBeString_1, Shareable_1) {
    function consoleWarnDroppedUniform(clazz, suffix, name, canvasId) {
        console.warn(clazz + " dropped uniform" + suffix + " " + name);
        console.warn("`typeof canvasId` is " + typeof canvasId);
    }
    var GraphicsProgram = (function (_super) {
        __extends(GraphicsProgram, _super);
        function GraphicsProgram(type, monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, 'GraphicsProgram');
            this.readyPending = false;
            MonitorList_1.default.verify('monitors', monitors);
            mustBeString_1.default('type', type);
            this._monitors = MonitorList_1.default.copy(monitors);
            this.type = type;
        }
        GraphicsProgram.prototype.destructor = function () {
            this._monitors.removeContextListener(this);
            this._monitors.release();
            this._monitors = void 0;
            if (this.inner) {
                this.inner.release();
                this.inner = void 0;
            }
        };
        GraphicsProgram.prototype.makeReady = function (async) {
            if (!this.readyPending) {
                this.readyPending = true;
                this._monitors.addContextListener(this);
                this._monitors.synchronize(this);
            }
        };
        Object.defineProperty(GraphicsProgram.prototype, "monitors", {
            get: function () {
                return this._monitors.toArray();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphicsProgram.prototype, "fragmentShader", {
            get: function () {
                if (this.inner) {
                    return this.inner.fragmentShader;
                }
                else {
                    var async = false;
                    this.makeReady(async);
                    if (this.inner) {
                        return this.inner.fragmentShader;
                    }
                    else {
                        return void 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        GraphicsProgram.prototype.use = function (canvasId) {
            if (this.inner) {
                return this.inner.use(canvasId);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.use(canvasId);
                }
                else {
                    if (core_1.default.verbose) {
                        console.warn(this.type + " is not ready for use. Maybe did not receive contextGain?");
                    }
                }
            }
        };
        GraphicsProgram.prototype.attributes = function (canvasId) {
            if (this.inner) {
                return this.inner.attributes(canvasId);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.attributes(canvasId);
                }
                else {
                    return void 0;
                }
            }
        };
        GraphicsProgram.prototype.uniforms = function (canvasId) {
            if (this.inner) {
                return this.inner.uniforms(canvasId);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.uniforms(canvasId);
                }
                else {
                    return void 0;
                }
            }
        };
        GraphicsProgram.prototype.enableAttrib = function (name, canvasId) {
            if (this.inner) {
                return this.inner.enableAttrib(name, canvasId);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.enableAttrib(name, canvasId);
                }
                else {
                    console.warn(this.type + " enableAttrib()");
                }
            }
        };
        GraphicsProgram.prototype.disableAttrib = function (name, canvasId) {
            if (this.inner) {
                return this.inner.disableAttrib(name, canvasId);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.disableAttrib(name, canvasId);
                }
                else {
                    console.warn(this.type + " disableAttrib()");
                }
            }
        };
        GraphicsProgram.prototype.contextFree = function (canvasId) {
            if (this.inner) {
                this.inner.contextFree(canvasId);
            }
        };
        GraphicsProgram.prototype.contextGain = function (manager) {
            if (isUndefined_1.default(this.inner)) {
                this.inner = this.createGraphicsProgram();
            }
            if (isDefined_1.default(this.inner)) {
                this.inner.contextGain(manager);
            }
        };
        GraphicsProgram.prototype.contextLost = function (canvasId) {
            if (this.inner) {
                this.inner.contextLost(canvasId);
            }
        };
        GraphicsProgram.prototype.createGraphicsProgram = function () {
            throw new Error("GraphicsProgram createGraphicsProgram method is virtual and should be implemented by " + this.type);
        };
        GraphicsProgram.prototype.uniform1f = function (name, x, canvasId) {
            if (this.inner) {
                this.inner.uniform1f(name, x, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform1f(name, x, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '1f', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.uniform2f = function (name, x, y, canvasId) {
            if (this.inner) {
                this.inner.uniform2f(name, x, y, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform2f(name, x, y, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '2f', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.uniform3f = function (name, x, y, z, canvasId) {
            if (this.inner) {
                this.inner.uniform3f(name, x, y, z, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform3f(name, x, y, z, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '3f', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.uniform4f = function (name, x, y, z, w, canvasId) {
            if (this.inner) {
                this.inner.uniform4f(name, x, y, z, w, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform4f(name, x, y, z, w, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '4f', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.mat2 = function (name, matrix, transpose, canvasId) {
            if (this.inner) {
                this.inner.mat2(name, matrix, transpose, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.mat2(name, matrix, transpose, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Mat2R', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.mat3 = function (name, matrix, transpose, canvasId) {
            if (this.inner) {
                this.inner.mat3(name, matrix, transpose, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.mat3(name, matrix, transpose, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Mat3R', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.mat4 = function (name, matrix, transpose, canvasId) {
            if (this.inner) {
                this.inner.mat4(name, matrix, transpose, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.mat4(name, matrix, transpose, canvasId);
                }
                else {
                    if (!readyPending) {
                        if (core_1.default.verbose) {
                            consoleWarnDroppedUniform(this.type, 'Mat4R', name, canvasId);
                        }
                    }
                }
            }
        };
        GraphicsProgram.prototype.vec2 = function (name, vector, canvasId) {
            if (this.inner) {
                this.inner.vec2(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.vec2(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'VectorE2', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.vec3 = function (name, vector, canvasId) {
            if (this.inner) {
                this.inner.vec3(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.vec3(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'VectorE3', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.vec4 = function (name, vector, canvasId) {
            if (this.inner) {
                this.inner.vec4(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.vec4(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'VectorE4', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.vector2 = function (name, data, canvasId) {
            if (this.inner) {
                this.inner.vector2(name, data, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.vector2(name, data, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'vector2', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.vector3 = function (name, data, canvasId) {
            if (this.inner) {
                this.inner.vector3(name, data, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.vector3(name, data, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'vector3', name, canvasId);
                    }
                }
            }
        };
        GraphicsProgram.prototype.vector4 = function (name, data, canvasId) {
            if (this.inner) {
                this.inner.vector4(name, data, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.vector4(name, data, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'vector4', name, canvasId);
                    }
                }
            }
        };
        Object.defineProperty(GraphicsProgram.prototype, "vertexShader", {
            get: function () {
                if (this.inner) {
                    return this.inner.vertexShader;
                }
                else {
                    var async = false;
                    this.makeReady(async);
                    if (this.inner) {
                        return this.inner.vertexShader;
                    }
                    else {
                        return void 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        return GraphicsProgram;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphicsProgram;
});
