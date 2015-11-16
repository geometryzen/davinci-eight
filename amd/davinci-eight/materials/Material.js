var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core', '../checks/isDefined', '../checks/isUndefined', '../scene/MonitorList', '../checks/mustBeInteger', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, core, isDefined, isUndefined, MonitorList, mustBeInteger, mustBeString, Shareable) {
    function consoleWarnDroppedUniform(clazz, suffix, name, canvasId) {
        console.warn(clazz + " dropped uniform" + suffix + " " + name);
        console.warn("`typeof canvasId` is " + typeof canvasId);
    }
    /**
     * @class Material
     * @extends Shareable
     */
    var Material = (function (_super) {
        __extends(Material, _super);
        // FIXME: Make uuid and use Shareable
        // public programId = uuid4().generate();
        /**
         * @class Material
         * @constructor
         * @param contexts {IContextMonitor[]}
         * @param type {string} The class name, used for logging.
         */
        function Material(contexts, type) {
            _super.call(this, 'Material');
            this.readyPending = false;
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
            this._monitors.release();
            this._monitors = void 0;
            if (this.inner) {
                this.inner.release();
                this.inner = void 0;
            }
        };
        /**
         * @method makeReady
         * @param async {boolean}
         * @protected
         */
        Material.prototype.makeReady = function (async) {
            if (!this.readyPending) {
                this.readyPending = true;
                this._monitors.addContextListener(this);
                this._monitors.synchronize(this);
            }
        };
        Object.defineProperty(Material.prototype, "monitors", {
            /**
             * @property monitors
             * @type {IContextMonitor[]}
             */
            get: function () {
                return this._monitors.toArray();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Material.prototype, "fragmentShader", {
            /**
             * @property fragmentShader
             * @type {string}
             */
            get: function () {
                return this.inner ? this.inner.fragmentShader : void 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method use
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.use = function (canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (core.strict) {
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
                        console.warn(this.type + " is not ready for use. Maybe did not receive contextGain?");
                    }
                }
            }
        };
        /**
         * @method attributes
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {{[name: string]: AttribLocation}}
         */
        Material.prototype.attributes = function (canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            // FIXME: Why is this called?
            // FIXME: The map should be protected but that is slow
            // FIXME Clear need for performant solution.
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
        /**
         * @method uniforms
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {{[name: string]: UniformLocation}}
         */
        Material.prototype.uniforms = function (canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method enableAttrib
         * @param name {string}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.enableAttrib = function (name, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method disableAttrib
         * @param name {string}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.disableAttrib = function (name, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method contextFree
         * @param canvasId {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.contextFree = function (canvasId) {
            if (this.inner) {
                this.inner.contextFree(canvasId);
            }
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        Material.prototype.contextGain = function (manager) {
            if (isUndefined(this.inner)) {
                this.inner = this.createMaterial();
            }
            if (isDefined(this.inner)) {
                this.inner.contextGain(manager);
            }
        };
        /**
         * @method contextLost
         * @param canvasId {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.contextLost = function (canvasId) {
            if (this.inner) {
                this.inner.contextLost(canvasId);
            }
        };
        /**
         * @method createMaterial
         * @return {IMaterial}
         * @protected
         */
        Material.prototype.createMaterial = function () {
            // FIXME Since we get contextGain by canvas, expect canvasId to be an argument?
            throw new Error("Material createMaterial method is virtual and should be implemented by " + this.type);
        };
        /**
         * @method uniform1f
         * @param name {string}
         * @param x {number}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniform1f = function (name, x, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method uniform2f
         * @param name {string}
         * @param x {number}
         * @param y {number}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniform2f = function (name, x, y, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method uniform3f
         * @param name {string}
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniform3f = function (name, x, y, z, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method uniform4f
         * @param name {string}
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param w {number}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniform4f = function (name, x, y, z, w, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method uniformMatrix2
         * @param name {string}
         * @param transpose {boolean}
         * @param matrix {Matrix2}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformMatrix2 = function (name, transpose, matrix, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method uniformMatrix3
         * @param name {string}
         * @param transpose {boolean}
         * @param matrix {Matrix3}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformMatrix3 = function (name, transpose, matrix, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method uniformMatrix4
         * @param name {string}
         * @param transpose {boolean}
         * @param matrix {Matrix4}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformMatrix4 = function (name, transpose, matrix, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method uniformVectorE2
         * @param name {string}
         * @param vector {VectorE2}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformVectorE2 = function (name, vector, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniformVectorE2(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVectorE2(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'R2', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method uniformVectorE3
         * @param name {string}
         * @param vector {VectorE3}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformVectorE3 = function (name, vector, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniformVectorE3(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVectorE3(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'R3', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method uniformVectorE4
         * @param name {string}
         * @param vector {VectorE4}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.uniformVectorE4 = function (name, vector, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
            if (this.inner) {
                this.inner.uniformVectorE4(name, vector, canvasId);
            }
            else {
                var async = false;
                var readyPending = this.readyPending;
                this.makeReady(async);
                if (this.inner) {
                    this.inner.uniformVectorE4(name, vector, canvasId);
                }
                else {
                    if (!readyPending) {
                        consoleWarnDroppedUniform(this.type, 'R4', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method vector2
         * @param name {string}
         * @param data {number[]}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.vector2 = function (name, data, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method vector3
         * @param name {string}
         * @param data {number[]}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.vector3 = function (name, data, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        /**
         * @method vector4
         * @param name {string}
         * @param data {number[]}
         * @param [canvasId = 0] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        Material.prototype.vector4 = function (name, data, canvasId) {
            if (canvasId === void 0) { canvasId = 0; }
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
        Object.defineProperty(Material.prototype, "vertexShader", {
            /**
             * @property vertexShader
             * @type {string}
             */
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
