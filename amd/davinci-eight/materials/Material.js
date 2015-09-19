define(["require", "exports", '../core', '../scene/MonitorList', '../checks/mustBeInteger', '../checks/mustBeString', '../utils/refChange', '../utils/uuid4'], function (require, exports, core, MonitorList, mustBeInteger, mustBeString, refChange, uuid4) {
    function consoleWarnDroppedUniform(clazz, suffix, name) {
        console.warn(clazz + " dropped uniform" + suffix + " " + name);
    }
    /**
     * @module EIGHT
     * @class Material
     * @implements IProgram
     */
    var Material = (function () {
        /**
         * @class Material
         * @constructor
         * @param contexts {ContextMonitor[]}
         * @param type {string} The class name, used for logging and serialization.
         */
        function Material(contexts, type) {
            this.readyPending = false;
            this.programId = uuid4().generate();
            this._refCount = 1;
            MonitorList.verify('contexts', contexts);
            mustBeString('type', type);
            this._monitors = MonitorList.copy(contexts);
            // FIXME multi-context support.
            this.type = type;
            refChange(this.programId, this.type, this._refCount);
        }
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
        /**
         * @method addRef
         * @return {number}
         */
        Material.prototype.addRef = function () {
            this._refCount++;
            refChange(this.programId, this.type, +1);
            return this._refCount;
        };
        Material.prototype.release = function () {
            this._refCount--;
            refChange(this.programId, this.type, -1);
            if (this._refCount === 0) {
                this._monitors.removeContextListener(this);
                if (this.inner) {
                    this.inner.release();
                    this.inner = void 0;
                }
            }
            return this._refCount;
        };
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
                    console.warn(this.type + " use()");
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
        };
        Material.prototype.contextLoss = function (canvasId) {
            if (this.inner) {
                this.inner.contextLoss(canvasId);
            }
        };
        Material.prototype.createProgram = function () {
            // FIXME; Since we get contextGain by canvas, expect canvasId to be an argument?
            // FIXME: We just delegate contextGain to the program.
            console.warn("Material createProgram method is virtual and should be implemented by " + this.type);
            return void 0;
        };
        Material.prototype.uniform1f = function (name, x) {
            if (this.inner) {
                this.inner.uniform1f(name, x);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform1f(name, x);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '1f', name);
                    }
                }
            }
        };
        Material.prototype.uniform2f = function (name, x, y) {
            if (this.inner) {
                this.inner.uniform2f(name, x, y);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform2f(name, x, y);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '2f', name);
                    }
                }
            }
        };
        Material.prototype.uniform3f = function (name, x, y, z) {
            if (this.inner) {
                this.inner.uniform3f(name, x, y, z);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform3f(name, x, y, z);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '3f', name);
                    }
                }
            }
        };
        Material.prototype.uniform4f = function (name, x, y, z, w) {
            if (this.inner) {
                this.inner.uniform4f(name, x, y, z, w);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniform4f(name, x, y, z, w);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, '4f', name);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix1 = function (name, transpose, matrix) {
            if (this.inner) {
                this.inner.uniformMatrix1(name, transpose, matrix);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix1(name, transpose, matrix);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix1', name);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix2 = function (name, transpose, matrix) {
            if (this.inner) {
                this.inner.uniformMatrix2(name, transpose, matrix);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix2(name, transpose, matrix);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix2', name);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix3 = function (name, transpose, matrix) {
            if (this.inner) {
                this.inner.uniformMatrix3(name, transpose, matrix);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix3(name, transpose, matrix);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix3', name);
                    }
                }
            }
        };
        Material.prototype.uniformMatrix4 = function (name, transpose, matrix) {
            if (this.inner) {
                this.inner.uniformMatrix4(name, transpose, matrix);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformMatrix4(name, transpose, matrix);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Matrix4', name);
                    }
                }
            }
        };
        Material.prototype.uniformVector1 = function (name, vector) {
            if (this.inner) {
                this.inner.uniformVector1(name, vector);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector1(name, vector);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector1', name);
                    }
                }
            }
        };
        Material.prototype.uniformVector2 = function (name, vector) {
            if (this.inner) {
                this.inner.uniformVector2(name, vector);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector2(name, vector);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector2', name);
                    }
                }
            }
        };
        Material.prototype.uniformVector3 = function (name, vector) {
            if (this.inner) {
                this.inner.uniformVector3(name, vector);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector3(name, vector);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector3', name);
                    }
                }
            }
        };
        Material.prototype.uniformVector4 = function (name, vector) {
            if (this.inner) {
                this.inner.uniformVector4(name, vector);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVector4(name, vector);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'Vector4', name);
                    }
                }
            }
        };
        return Material;
    })();
    return Material;
});
