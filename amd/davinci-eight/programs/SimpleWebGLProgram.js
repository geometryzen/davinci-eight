var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/AttribLocation', '../programs/makeWebGLProgram', '../core/UniformLocation', '../utils/Shareable'], function (require, exports, AttribLocation, makeWebGLProgram, UniformLocation, Shareable) {
    /**
     * This class is "simple because" it assumes exactly one vertex shader and on fragment shader.
     * This class assumes that it will only be supporting a single WebGL rendering context.
     * The existence of the manager in the constructor enables it to enforce this invariant.
     */
    var SimpleWebGLProgram = (function (_super) {
        __extends(SimpleWebGLProgram, _super);
        function SimpleWebGLProgram(manager, vertexShader, fragmentShader, attribs) {
            _super.call(this, 'SimpleWebGLProgram');
            this.attributes = {};
            this.uniforms = {};
            this.manager = manager;
            // Interesting. CM can't be addRefd!
            // manager.addRef()
            this.vertexShader = vertexShader;
            this.fragmentShader = fragmentShader;
            this.attribs = attribs;
            this.manager.addContextListener(this);
            this.manager.synchronize(this);
        }
        SimpleWebGLProgram.prototype.destructor = function () {
            var manager = this.manager;
            var canvasId = manager.canvasId;
            // If the program has been allocated, find out what to do with it.
            // (we may have been disconnected from listening)
            if (this.program) {
                var gl = manager.gl;
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
            manager.removeContextListener(this);
            // this.manager.release()
            this.manager = void 0;
        };
        SimpleWebGLProgram.prototype.contextGain = function (manager) {
            if (!this.program) {
                this.program = makeWebGLProgram(manager.gl, this.vertexShader, this.fragmentShader, this.attribs);
                var context = manager.gl;
                var program = this.program;
                var attributes = this.attributes;
                var uniforms = this.uniforms;
                var activeAttributes = context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
                for (var a = 0; a < activeAttributes; a++) {
                    var activeAttribInfo = context.getActiveAttrib(program, a);
                    var name_1 = activeAttribInfo.name;
                    if (!attributes[name_1]) {
                        attributes[name_1] = new AttribLocation(manager, name_1);
                    }
                }
                var activeUniforms = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
                for (var u = 0; u < activeUniforms; u++) {
                    var activeUniformInfo = context.getActiveUniform(program, u);
                    var name_2 = activeUniformInfo.name;
                    if (!uniforms[name_2]) {
                        uniforms[name_2] = new UniformLocation(manager, name_2);
                    }
                }
                for (var aName in attributes) {
                    attributes[aName].contextGain(context, program);
                }
                for (var uName in uniforms) {
                    uniforms[uName].contextGain(context, program);
                }
            }
        };
        SimpleWebGLProgram.prototype.contextLost = function (canvasId) {
            this.program = void 0;
            for (var aName in this.attributes) {
                this.attributes[aName].contextLost();
            }
            for (var uName in this.uniforms) {
                this.uniforms[uName].contextLost();
            }
        };
        SimpleWebGLProgram.prototype.contextFree = function (canvasId) {
            if (this.program) {
                var gl = this.manager.gl;
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
        SimpleWebGLProgram.prototype.use = function () {
            this.manager.gl.useProgram(this.program);
        };
        return SimpleWebGLProgram;
    })(Shareable);
    return SimpleWebGLProgram;
});
