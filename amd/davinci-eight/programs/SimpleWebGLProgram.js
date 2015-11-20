var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/AttribLocation', '../programs/makeWebGLProgram', '../checks/mustBeArray', '../checks/mustBeObject', '../checks/mustBeString', '../core/UniformLocation', '../utils/Shareable'], function (require, exports, AttribLocation, makeWebGLProgram, mustBeArray, mustBeObject, mustBeString, UniformLocation, Shareable) {
    /**
     * @class SimpleWebGLProgram
     * @extends Shareable
     */
    var SimpleWebGLProgram = (function (_super) {
        __extends(SimpleWebGLProgram, _super);
        /**
         * This class is <em>simple</em> because it assumes exactly
         * one vertex shader and one fragment shader.
         * This class assumes that it will only be supporting a single WebGL rendering context.
         * The existence of the context in the constructor enables it to enforce this invariant.
         * @class SimpleWebGLProgram
         * @constructor
         * @param context {IContextProvider} The context that this program will work with.
         * @param vertexShader {string} The vertex shader source code.
         * @param fragmentShader {string} The fragment shader source code.
         * @param [attribs] {Array&lt;string&gt;} The attribute ordering.
         */
        function SimpleWebGLProgram(context, vertexShader, fragmentShader, attribs) {
            if (attribs === void 0) { attribs = []; }
            _super.call(this, 'SimpleWebGLProgram');
            /**
             * @property attributes
             * @type {{[name: string]: AttribLocation}}
             */
            this.attributes = {};
            /**
             * @property uniforms
             * @type {{[name: string]: UniformLocation}}
             */
            this.uniforms = {};
            this.context = mustBeObject('context', context);
            context.addRef();
            this.vertexShader = mustBeString('vertexShader', vertexShader);
            this.fragmentShader = mustBeString('fragmentShader', fragmentShader);
            this.attribs = mustBeArray('attribs', attribs);
            context.addContextListener(this);
            context.synchronize(this);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        SimpleWebGLProgram.prototype.destructor = function () {
            var context = this.context;
            var canvasId = context.canvasId;
            // If the program has been allocated, find out what to do with it.
            // (we may have been disconnected from listening)
            if (this.program) {
                var gl = context.gl;
                if (gl) {
                    if (gl.isContextLost()) {
                        this.contextLost(canvasId);
                    }
                    else {
                        this.contextFree(canvasId);
                    }
                }
                else {
                    console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.");
                }
            }
            context.removeContextListener(this);
            this.context.release();
            this.context = void 0;
        };
        /**
         * @method contextGain
         * @param context {IContextProvider}
         * @return {void}
         */
        SimpleWebGLProgram.prototype.contextGain = function (unused) {
            var context = this.context;
            var gl = context.gl;
            if (!this.program) {
                this.program = makeWebGLProgram(context.gl, this.vertexShader, this.fragmentShader, this.attribs);
                var program = this.program;
                var attributes = this.attributes;
                var uniforms = this.uniforms;
                var activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
                for (var a = 0; a < activeAttributes; a++) {
                    var activeAttribInfo = gl.getActiveAttrib(program, a);
                    var name_1 = activeAttribInfo.name;
                    if (!attributes[name_1]) {
                        attributes[name_1] = new AttribLocation(context, name_1);
                    }
                }
                var activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
                for (var u = 0; u < activeUniforms; u++) {
                    var activeUniformInfo = gl.getActiveUniform(program, u);
                    var name_2 = activeUniformInfo.name;
                    if (!uniforms[name_2]) {
                        uniforms[name_2] = new UniformLocation(context, name_2);
                    }
                }
                for (var aName in attributes) {
                    attributes[aName].contextGain(gl, program);
                }
                for (var uName in uniforms) {
                    uniforms[uName].contextGain(gl, program);
                }
            }
        };
        /**
         * @method contextLost
         * @param [canvasId] {number}
         * @return {void}
         */
        SimpleWebGLProgram.prototype.contextLost = function (unused) {
            this.program = void 0;
            for (var aName in this.attributes) {
                this.attributes[aName].contextLost();
            }
            for (var uName in this.uniforms) {
                this.uniforms[uName].contextLost();
            }
        };
        /**
         * @method contextFree
         * @param [canvasId] number
         * @return {void}
         */
        SimpleWebGLProgram.prototype.contextFree = function (unused) {
            if (this.program) {
                var gl = this.context.gl;
                if (gl) {
                    if (!gl.isContextLost()) {
                        gl.deleteProgram(this.program);
                    }
                    else {
                    }
                }
                else {
                    console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.");
                }
                this.program = void 0;
            }
            for (var aName in this.attributes) {
                this.attributes[aName].contextFree();
            }
            for (var uName in this.uniforms) {
                this.uniforms[uName].contextFree();
            }
        };
        /**
         * @method use
         * @return {void}
         */
        SimpleWebGLProgram.prototype.use = function () {
            this.context.gl.useProgram(this.program);
        };
        return SimpleWebGLProgram;
    })(Shareable);
    return SimpleWebGLProgram;
});
