var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/AttribLocation', '../programs/makeWebGLProgram', '../checks/mustBeArray', '../checks/mustBeObject', '../checks/mustBeString', '../core/UniformLocation', '../utils/Shareable'], function (require, exports, AttribLocation_1, makeWebGLProgram_1, mustBeArray_1, mustBeObject_1, mustBeString_1, UniformLocation_1, Shareable_1) {
    var SimpleWebGLProgram = (function (_super) {
        __extends(SimpleWebGLProgram, _super);
        function SimpleWebGLProgram(context, vertexShader, fragmentShader, attribs) {
            if (attribs === void 0) { attribs = []; }
            _super.call(this, 'SimpleWebGLProgram');
            this.attributes = {};
            this.uniforms = {};
            this.context = mustBeObject_1.default('context', context);
            context.addRef();
            this.vertexShader = mustBeString_1.default('vertexShader', vertexShader);
            this.fragmentShader = mustBeString_1.default('fragmentShader', fragmentShader);
            this.attribs = mustBeArray_1.default('attribs', attribs);
            context.addContextListener(this);
            context.synchronize(this);
        }
        SimpleWebGLProgram.prototype.destructor = function () {
            var context = this.context;
            var canvasId = context.canvasId;
            if (this.program) {
                var gl = context.gl;
                if (gl) {
                    if (gl.isContextLost()) {
                        this.contextLost(canvasId);
                    }
                    else {
                        this.contextFree(context);
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
        SimpleWebGLProgram.prototype.contextGain = function (manager) {
            var context = this.context;
            var gl = context.gl;
            if (!this.program) {
                this.program = makeWebGLProgram_1.default(context.gl, this.vertexShader, this.fragmentShader, this.attribs);
                var program = this.program;
                var attributes = this.attributes;
                var uniforms = this.uniforms;
                var activeAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
                for (var a = 0; a < activeAttributes; a++) {
                    var activeAttribInfo = gl.getActiveAttrib(program, a);
                    var name_1 = activeAttribInfo.name;
                    if (!attributes[name_1]) {
                        attributes[name_1] = new AttribLocation_1.default(context, name_1);
                    }
                }
                var activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
                for (var u = 0; u < activeUniforms; u++) {
                    var activeUniformInfo = gl.getActiveUniform(program, u);
                    var name_2 = activeUniformInfo.name;
                    if (!uniforms[name_2]) {
                        uniforms[name_2] = new UniformLocation_1.default(context, name_2);
                    }
                }
                for (var aName in attributes) {
                    if (attributes.hasOwnProperty(aName)) {
                        attributes[aName].contextGain(gl, program);
                    }
                }
                for (var uName in uniforms) {
                    if (uniforms.hasOwnProperty(uName)) {
                        uniforms[uName].contextGain(gl, program);
                    }
                }
            }
        };
        SimpleWebGLProgram.prototype.contextLost = function (unused) {
            this.program = void 0;
            for (var aName in this.attributes) {
                if (this.attributes.hasOwnProperty(aName)) {
                    this.attributes[aName].contextLost();
                }
            }
            for (var uName in this.uniforms) {
                if (this.uniforms.hasOwnProperty(uName)) {
                    this.uniforms[uName].contextLost();
                }
            }
        };
        SimpleWebGLProgram.prototype.contextFree = function (manager) {
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
                if (this.attributes.hasOwnProperty(aName)) {
                    this.attributes[aName].contextFree();
                }
            }
            for (var uName in this.uniforms) {
                if (this.uniforms.hasOwnProperty(uName)) {
                    this.uniforms[uName].contextFree();
                }
            }
        };
        SimpleWebGLProgram.prototype.use = function () {
            this.context.gl.useProgram(this.program);
        };
        return SimpleWebGLProgram;
    })(Shareable_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimpleWebGLProgram;
});
