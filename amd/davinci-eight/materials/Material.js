var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core', '../scene/MonitorList', '../checks/mustBeInteger', '../checks/mustBeString', '../utils/Shareable', '../utils/uuid4'], function (require, exports, core, MonitorList, mustBeInteger, mustBeString, Shareable, uuid4) {
    function consoleWarnDroppedUniform(clazz, suffix, name, canvasId) {
        console.warn(clazz + " dropped uniform" + suffix + " " + name);
        console.warn("`typeof canvasId` is " + typeof canvasId);
    }
    /**
     * @class Material
     * @implements IMaterial
     */
    var Material = (function (_super) {
        __extends(Material, _super);
        /**
         * @class Material
         * @constructor
         * @param contexts {ContextMonitor[]}
         * @param type {string} The class name, used for logging and serialization.
         */
        function Material(contexts, type) {
            _super.call(this, 'Material');
            this.readyPending = false;
            this.programId = uuid4().generate();
            MonitorList.verify('contexts', contexts);
            mustBeString('type', type);
            this._monitors = MonitorList.copy(contexts);
            this.type = type;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        Material.prototype.destructor = function () {
            this._monitors.removeContextListener(this);
            if (this.inner) {
                this.inner.release();
                this.inner = void 0;
            }
        };
        Material.prototype.makeReady = function (async) {
            if (!this.readyPending) {
                this.readyPending = true;
                this._monitors.addContextListener(this);
            }
        };
        Object.defineProperty(Material.prototype, "monitors", {
            /**
             * @property monitors
             * @type {ContextMonitor[]}
             */
            get: function () {
                return this._monitors.toArray();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "fragmentShader", {
            get: function () {
                return this.inner ? this.inner.fragmentShader : void 0;
            },
            enumerable: true,
            configurable: true
        });
        // FIXME; I'm going to need to know which monitor.
        Material.prototype.use = function (canvasId) {
            if (core.ASSERTIVE) {
                mustBeInteger('canvasid', canvasId);
            }
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
                    if (core.verbose) {
                        console.warn(this.type + " use()");
                    }
                }
            }
        };
        Object.defineProperty(Material.prototype, "attributes", {
            get: function () {
                // FIXME: Why is this called.
                // FIXME: The map should be protected but that is slow
                // FIXME Clear need for performant solution.
                if (this.inner) {
                    return this.inner.attributes;
                }
                else {
                    var async = false;
                    this.makeReady(async);
                    if (this.inner) {
                        return this.inner.attributes;
                    }
                    else {
                        return void 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "uniforms", {
            get: function () {
                if (this.inner) {
                    return this.inner.uniforms;
                }
                else {
                    var async = false;
                    this.makeReady(async);
                    if (this.inner) {
                        return this.inner.uniforms;
                    }
                    else {
                        return void 0;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Material.prototype.enableAttrib = function (name) {
            if (this.inner) {
                return this.inner.enableAttrib(name);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.enableAttrib(name);
                }
                else {
                    console.warn(this.type + " enableAttrib()");
                }
            }
        };
        Material.prototype.disableAttrib = function (name) {
            if (this.inner) {
                return this.inner.disableAttrib(name);
            }
            else {
                var async = false;
                this.makeReady(async);
                if (this.inner) {
                    return this.inner.disableAttrib(name);
                }
                else {
                    console.warn(this.type + " disableAttrib()");
                }
            }
        };
        Material.prototype.contextFree = function (canvasId) {
            if (this.inner) {
                this.inner.contextFree(canvasId);
            }
        };
        Material.prototype.contextGain = function (manager) {
            this.inner = this.createProgram();
            this.inner.contextGain(manager);
        };
        Material.prototype.contextLoss = function (canvasId) {
            if (this.inner) {
                this.inner.contextLoss(canvasId);
            }
        };
        Material.prototype.createProgram = function () {
            // FIXME; Since we get contextGain by canvas, expect canvasId to be an argument?
            throw new Error("Material createProgram method is virtual and should be implemented by " + this.type);
        };
        Material.prototype.uniform1f = function (name, x, canvasId) {
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
        Material.prototype.uniform2f = function (name, x, y, canvasId) {
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
        Material.prototype.uniform3f = function (name, x, y, z, canvasId) {
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
        Material.prototype.uniform4f = function (name, x, y, z, w, canvasId) {
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
        Material.prototype.uniformMatrix1 = function (name, transpose, matrix, canvasId) {
            if (this.inner) {
                this.inner.uniformMatrix1(name, transpose, matrix, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix1(name, transpose, matrix, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix1', name, canvasId);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix2 = function (name, transpose, matrix, canvasId) {
            if (this.inner) {
                this.inner.uniformMatrix2(name, transpose, matrix, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix2(name, transpose, matrix, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix2', name, canvasId);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix3 = function (name, transpose, matrix, canvasId) {
            if (this.inner) {
                this.inner.uniformMatrix3(name, transpose, matrix, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix3(name, transpose, matrix, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix3', name, canvasId);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix4 = function (name, transpose, matrix, canvasId) {
            if (this.inner) {
                this.inner.uniformMatrix4(name, transpose, matrix, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix4(name, transpose, matrix, canvasId);
                }
                else {
                    if (!readyPending) {
                        if (core.verbose) {
                            consoleWarnDroppedUniform(this.type, 'Matrix4', name, canvasId);
                        }
                    }
                }
            }
        };
        Material.prototype.uniformVector1 = function (name, vector, canvasId) {
            if (this.inner) {
                this.inner.uniformVector1(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector1(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector1', name, canvasId);
                    }
                }
            }
        };
        Material.prototype.uniformVector2 = function (name, vector, canvasId) {
            if (this.inner) {
                this.inner.uniformVector2(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector2(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector2', name, canvasId);
                    }
                }
            }
        };
        Material.prototype.uniformVector3 = function (name, vector, canvasId) {
            if (this.inner) {
                this.inner.uniformVector3(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector3(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector3', name, canvasId);
                    }
                }
            }
        };
        Material.prototype.uniformVector4 = function (name, vector, canvasId) {
            if (this.inner) {
                this.inner.uniformVector4(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector4(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector4', name, canvasId);
                    }
                }
            }
        };
        Object.defineProperty(Material.prototype, "vertexShader", {
            get: function () {
                return this.inner ? this.inner.vertexShader : void 0;
            },
            enumerable: true,
            configurable: true
        });
        return Material;
    })(Shareable);
    return Material;
});
