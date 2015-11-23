var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core', '../checks/isDefined', '../checks/isUndefined', '../scene/MonitorList', '../checks/mustBeString', '../utils/Shareable'], function (require, exports, core, isDefined, isUndefined, MonitorList, mustBeString, Shareable) {
    function consoleWarnDroppedUniform(clazz, suffix, name, canvasId) {
        console.warn(clazz + " dropped uniform" + suffix + " " + name);
        console.warn("`typeof canvasId` is " + typeof canvasId);
    }
    /**
     * @class GraphicsProgram
     * @extends Shareable
     */
    var GraphicsProgram = (function (_super) {
        __extends(GraphicsProgram, _super);
        /**
         * A GraphicsProgram instance contains one WebGLProgram for each context/canvas that it is associated with.
         * @class GraphicsProgram
         * @constructor
         * @param contexts {IContextMonitor[]} An array of context monitors, one for each HTML canvas you are using.
         * The GraphicsProgram will lazily register itself (call addContextListener) with each context in order to be notified of context loss events.
         * The GraphicsProgram will automatically unregister itself (call removeContextListener) prior to destruction.
         * @param type {string} The class name, used for logging.
         */
        function GraphicsProgram(contexts, type) {
            _super.call(this, 'GraphicsProgram');
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
        GraphicsProgram.prototype.destructor = function () {
            this._monitors.removeContextListener(this);
            this._monitors.release();
            this._monitors = void 0;
            if (this.inner) {
                this.inner.release();
                this.inner = void 0;
            }
        };
        /**
         * Registers this GraphicsProgram with the context monitors and synchronizes the WebGL contexts.
         * This causes this GraphicsProgram instance to receive a contextGain call allowing WebGLProgram initialization.
         * @method makeReady
         * @param async {boolean} Reserved for future use.
         * @protected
         */
        GraphicsProgram.prototype.makeReady = function (async) {
            if (!this.readyPending) {
                this.readyPending = true;
                this._monitors.addContextListener(this);
                this._monitors.synchronize(this);
            }
        };
        Object.defineProperty(GraphicsProgram.prototype, "monitors", {
            /**
             * Returns the context monitors this GraphicsProgram is associated with.
             * @property monitors
             * @type {IContextMonitor[]}
             */
            get: function () {
                return this._monitors.toArray();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphicsProgram.prototype, "fragmentShader", {
            /**
             * Returns the generated fragment shader code as a string.
             * @property fragmentShader
             * @type {string}
             */
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
        /**
         * Makes the WebGLProgram associated with the specified canvas the current program for WebGL.
         * @method use
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
                    if (core.verbose) {
                        console.warn(this.type + " is not ready for use. Maybe did not receive contextGain?");
                    }
                }
            }
        };
        /**
         * Returns a map of GLSL attribute name to <code>AttribLocation</code>.
         * @method attributes
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {{[name: string]: AttribLocation}}
         */
        GraphicsProgram.prototype.attributes = function (canvasId) {
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
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {{[name: string]: UniformLocation}}
         */
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
        /**
         * @method enableAttrib
         * @param name {string}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
        /**
         * @method disableAttrib
         * @param name {string}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
        /**
         * @method contextFree
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        GraphicsProgram.prototype.contextFree = function (canvasId) {
            if (this.inner) {
                this.inner.contextFree(canvasId);
            }
        };
        /**
         * @method contextGain
         * @param manager {IContextProvider}
         * @return {void}
         */
        GraphicsProgram.prototype.contextGain = function (manager) {
            if (isUndefined(this.inner)) {
                this.inner = this.createGraphicsProgram();
            }
            if (isDefined(this.inner)) {
                this.inner.contextGain(manager);
            }
        };
        /**
         * @method contextLost
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
        GraphicsProgram.prototype.contextLost = function (canvasId) {
            if (this.inner) {
                this.inner.contextLost(canvasId);
            }
        };
        /**
         * @method createGraphicsProgram
         * @return {IGraphicsProgram}
         * @protected
         */
        GraphicsProgram.prototype.createGraphicsProgram = function () {
            // FIXME Since we get contextGain by canvas, expect canvasId to be an argument?
            throw new Error("GraphicsProgram createGraphicsProgram method is virtual and should be implemented by " + this.type);
        };
        /**
         * @method uniform1f
         * @param name {string}
         * @param x {number}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
        /**
         * @method uniform2f
         * @param name {string}
         * @param x {number}
         * @param y {number}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
        /**
         * @method uniform3f
         * @param name {string}
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
        /**
         * @method uniform4f
         * @param name {string}
         * @param x {number}
         * @param y {number}
         * @param z {number}
         * @param w {number}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
        /**
         * @method mat2
         * @param name {string}
         * @param matrix {Mat2R}
         * @param [transpose] {boolean}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
        /**
         * @method mat3
         * @param name {string}
         * @param matrix {Mat3R}
         * @param [transpose] {boolean}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
        /**
         * @method mat4
         * @param name {string}
         * @param matrix {Mat4R}
         * @param [transpose] {boolean}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
                        if (core.verbose) {
                            consoleWarnDroppedUniform(this.type, 'Mat4R', name, canvasId);
                        }
                    }
                }
            }
        };
        /**
         * @method vec2
         * @param name {string}
         * @param vector {VectorE2}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
                        consoleWarnDroppedUniform(this.type, 'R2', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method vec3
         * @param name {string}
         * @param vector {VectorE3}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
                        consoleWarnDroppedUniform(this.type, 'R3', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method vec4
         * @param name {string}
         * @param vector {VectorE4}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
                        consoleWarnDroppedUniform(this.type, 'R4', name, canvasId);
                    }
                }
            }
        };
        /**
         * @method vector2
         * @param name {string}
         * @param data {number[]}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
        /**
         * @method vector3
         * @param name {string}
         * @param data {number[]}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
        /**
         * @method vector4
         * @param name {string}
         * @param data {number[]}
         * @param [canvasId] {number} Determines which WebGLProgram to use.
         * @return {void}
         */
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
            /**
             * Returns the generated shader vertex code as a string.
             * @property vertexShader
             * @type {string}
             */
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
    })(Shareable);
    return GraphicsProgram;
});
