"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaderMaterial = void 0;
var tslib_1 = require("tslib");
var Attrib_1 = require("../core/Attrib");
var DataType_1 = require("../core/DataType");
var isDefined_1 = require("../checks/isDefined");
var isString_1 = require("../checks/isString");
var isNull_1 = require("../checks/isNull");
var makeWebGLProgram_1 = require("../core/makeWebGLProgram");
var mustBeArray_1 = require("../checks/mustBeArray");
var mustBeString_1 = require("../checks/mustBeString");
var mustBeUndefined_1 = require("../checks/mustBeUndefined");
var readOnly_1 = require("../i18n/readOnly");
var ShareableContextConsumer_1 = require("../core/ShareableContextConsumer");
var Uniform_1 = require("../core/Uniform");
/**
 *
 */
var ShaderMaterial = /** @class */ (function (_super) {
    tslib_1.__extends(ShaderMaterial, _super);
    /**
     * @param vertexShaderSrc The vertex shader source code.
     * @param fragmentShaderSrc The fragment shader source code.
     * @param attribs The attribute ordering.
     * @param engine The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
     */
    function ShaderMaterial(vertexShaderSrc, fragmentShaderSrc, attribs, contextManager, levelUp) {
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager) || this;
        /**
         *
         */
        _this._attributesByName = {};
        _this._attributesByIndex = [];
        /**
         *
         */
        _this._uniforms = {};
        _this.setLoggingName('ShaderMaterial');
        if (isDefined_1.isDefined(vertexShaderSrc) && !isNull_1.isNull(vertexShaderSrc)) {
            _this._vertexShaderSrc = mustBeString_1.mustBeString('vertexShaderSrc', vertexShaderSrc);
        }
        if (isDefined_1.isDefined(fragmentShaderSrc) && !isNull_1.isNull(fragmentShaderSrc)) {
            _this._fragmentShaderSrc = mustBeString_1.mustBeString('fragmentShaderSrc', fragmentShaderSrc);
        }
        _this._attribs = mustBeArray_1.mustBeArray('attribs', attribs);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    ShaderMaterial.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('ShaderMaterial');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    ShaderMaterial.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        mustBeUndefined_1.mustBeUndefined(this.getLoggingName(), this._program);
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    ShaderMaterial.prototype.contextGain = function () {
        var gl = this.contextManager.gl;
        if (!this._program && isString_1.isString(this._vertexShaderSrc) && isString_1.isString(this._fragmentShaderSrc)) {
            this._program = makeWebGLProgram_1.makeWebGLProgram(gl, this._vertexShaderSrc, this._fragmentShaderSrc, this._attribs);
            this._attributesByName = {};
            this._attributesByIndex = [];
            this._uniforms = {};
            var aLen = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
            for (var a = 0; a < aLen; a++) {
                var attribInfo = gl.getActiveAttrib(this._program, a);
                var attrib = new Attrib_1.Attrib(this.contextManager, attribInfo);
                this._attributesByName[attribInfo.name] = attrib;
                this._attributesByIndex.push(attrib);
            }
            var uLen = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
            for (var u = 0; u < uLen; u++) {
                var uniformInfo = gl.getActiveUniform(this._program, u);
                this._uniforms[uniformInfo.name] = new Uniform_1.Uniform(uniformInfo);
            }
            // TODO: This would be more efficient over the array.
            for (var aName in this._attributesByName) {
                if (this._attributesByName.hasOwnProperty(aName)) {
                    this._attributesByName[aName].contextGain(gl, this._program);
                }
            }
            for (var uName in this._uniforms) {
                if (this._uniforms.hasOwnProperty(uName)) {
                    this._uniforms[uName].contextGain(gl, this._program);
                }
            }
        }
        _super.prototype.contextGain.call(this);
    };
    /**
     *
     */
    ShaderMaterial.prototype.contextLost = function () {
        this._program = void 0;
        for (var aName in this._attributesByName) {
            // TODO: This would be better over the array.
            if (this._attributesByName.hasOwnProperty(aName)) {
                this._attributesByName[aName].contextLost();
            }
        }
        for (var uName in this._uniforms) {
            if (this._uniforms.hasOwnProperty(uName)) {
                this._uniforms[uName].contextLost();
            }
        }
        _super.prototype.contextLost.call(this);
    };
    /**
     *
     */
    ShaderMaterial.prototype.contextFree = function () {
        if (this._program) {
            var gl = this.contextManager.gl;
            if (gl) {
                if (!gl.isContextLost()) {
                    gl.deleteProgram(this._program);
                }
                else {
                    // WebGL has lost the context, effectively cleaning up everything.
                }
            }
            else {
                console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.");
            }
            this._program = void 0;
        }
        // TODO
        for (var aName in this._attributesByName) {
            if (this._attributesByName.hasOwnProperty(aName)) {
                this._attributesByName[aName].contextFree();
            }
        }
        for (var uName in this._uniforms) {
            if (this._uniforms.hasOwnProperty(uName)) {
                this._uniforms[uName].contextFree();
            }
        }
        _super.prototype.contextFree.call(this);
    };
    Object.defineProperty(ShaderMaterial.prototype, "vertexShaderSrc", {
        /**
         *
         */
        get: function () {
            return this._vertexShaderSrc;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShaderMaterial.prototype, "fragmentShaderSrc", {
        /**
         *
         */
        get: function () {
            return this._fragmentShaderSrc;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShaderMaterial.prototype, "attributeNames", {
        /**
         *
         */
        get: function () {
            // I wonder if it might be better to use the array and preserve order. 
            var attributes = this._attributesByName;
            if (attributes) {
                return Object.keys(attributes);
            }
            else {
                return void 0;
            }
        },
        set: function (unused) {
            throw new Error(readOnly_1.readOnly('attributeNames').message);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Convenience method for dereferencing the name to an attribute location, followed by enabling the attribute.
     */
    ShaderMaterial.prototype.enableAttrib = function (indexOrName) {
        if (typeof indexOrName === 'number') {
            if (this.gl) {
                this.gl.enableVertexAttribArray(indexOrName);
            }
        }
        else if (typeof indexOrName === 'string') {
            var attribLoc = this._attributesByName[indexOrName];
            if (attribLoc) {
                attribLoc.enable();
            }
        }
        else {
            throw new TypeError("indexOrName must have type number or string.");
        }
    };
    /**
     *
     */
    ShaderMaterial.prototype.enableAttribs = function () {
        var attribLocations = this._attributesByName;
        if (attribLocations) {
            // TODO: Store loactions as a plain array in order to avoid temporaries (aNames)
            var aNames = Object.keys(attribLocations);
            for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                attribLocations[aNames[i]].enable();
            }
        }
    };
    /**
     *
     */
    ShaderMaterial.prototype.disableAttrib = function (indexOrName) {
        if (typeof indexOrName === 'number') {
            if (this.gl) {
                this.gl.disableVertexAttribArray(indexOrName);
            }
        }
        else if (typeof indexOrName === 'string') {
            var attribLoc = this._attributesByName[indexOrName];
            if (attribLoc) {
                attribLoc.disable();
            }
        }
        else {
            throw new TypeError("indexOrName must have type number or string.");
        }
    };
    /**
     *
     */
    ShaderMaterial.prototype.disableAttribs = function () {
        var attribLocations = this._attributesByName;
        if (attribLocations) {
            // TODO: Store loactions as a plain array in order to avoid temporaries (aNames)
            var aNames = Object.keys(attribLocations);
            for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                attribLocations[aNames[i]].disable();
            }
        }
    };
    ShaderMaterial.prototype.attrib = function (name, value, size, normalized, stride, offset) {
        if (normalized === void 0) { normalized = false; }
        if (stride === void 0) { stride = 0; }
        if (offset === void 0) { offset = 0; }
        var attrib = this.getAttrib(name);
        if (attrib) {
            value.bind();
            attrib.enable();
            attrib.config(size, DataType_1.DataType.FLOAT, normalized, stride, offset);
        }
        return this;
    };
    ShaderMaterial.prototype.getAttrib = function (indexOrName) {
        if (typeof indexOrName === 'number') {
            // FIXME
            return this._attributesByIndex[indexOrName];
        }
        else if (typeof indexOrName === 'string') {
            return this._attributesByName[indexOrName];
        }
        else {
            throw new TypeError("indexOrName must be a number or a string");
        }
    };
    /**
     * Returns the location (index) of the attribute with the specified name.
     * Returns <code>-1</code> if the name does not correspond to an attribute.
     */
    ShaderMaterial.prototype.getAttribLocation = function (name) {
        var attribLoc = this._attributesByName[name];
        if (attribLoc) {
            return attribLoc.index;
        }
        else {
            return -1;
        }
    };
    /**
     * Returns a <code>Uniform</code> object corresponding to the <code>uniform</code>
     * parameter of the same name in the shader code. If a uniform parameter of the specified name
     * does not exist, this method returns undefined (void 0).
     */
    ShaderMaterial.prototype.getUniform = function (name) {
        var uniforms = this._uniforms;
        if (uniforms[name]) {
            return uniforms[name];
        }
        else {
            return void 0;
        }
    };
    /**
     * <p>
     * Determines whether a <code>uniform</code> with the specified <code>name</code> exists in the <code>WebGLProgram</code>.
     * </p>
     */
    ShaderMaterial.prototype.hasUniform = function (name) {
        mustBeString_1.mustBeString('name', name);
        return isDefined_1.isDefined(this._uniforms[name]);
    };
    ShaderMaterial.prototype.activeTexture = function (texture) {
        if (this.gl) {
            this.gl.activeTexture(texture);
        }
    };
    ShaderMaterial.prototype.uniform1i = function (name, x) {
        var uniformLoc = this.getUniform(name);
        if (uniformLoc) {
            uniformLoc.uniform1i(x);
        }
    };
    ShaderMaterial.prototype.uniform1f = function (name, x) {
        var uniformLoc = this.getUniform(name);
        if (uniformLoc) {
            uniformLoc.uniform1f(x);
        }
    };
    ShaderMaterial.prototype.uniform2f = function (name, x, y) {
        var uniformLoc = this._uniforms[name];
        if (uniformLoc) {
            uniformLoc.uniform2f(x, y);
        }
    };
    ShaderMaterial.prototype.uniform3f = function (name, x, y, z) {
        var uniformLoc = this._uniforms[name];
        if (uniformLoc) {
            uniformLoc.uniform3f(x, y, z);
        }
    };
    ShaderMaterial.prototype.uniform4f = function (name, x, y, z, w) {
        var uniformLoc = this._uniforms[name];
        if (uniformLoc) {
            uniformLoc.uniform4f(x, y, z, w);
        }
    };
    ShaderMaterial.prototype.uniform = function (name, value) {
        var uniformLoc = this._uniforms[name];
        if (uniformLoc) {
            if (typeof value === 'number') {
                uniformLoc.uniform1f(value);
            }
            else if (value) {
                switch (value.length) {
                    case 1: {
                        uniformLoc.uniform1f(value[0]);
                        break;
                    }
                    case 2: {
                        uniformLoc.uniform2f(value[0], value[1]);
                        break;
                    }
                    case 3: {
                        uniformLoc.uniform3f(value[0], value[1], value[2]);
                        break;
                    }
                    case 4: {
                        uniformLoc.uniform4f(value[0], value[1], value[2], value[3]);
                        break;
                    }
                }
            }
        }
        return this;
    };
    /**
     *
     */
    ShaderMaterial.prototype.use = function () {
        var gl = this.gl;
        if (gl) {
            gl.useProgram(this._program);
        }
        else {
            console.warn(this.getLoggingName() + ".use() missing WebGL rendering context.");
        }
        return this;
    };
    ShaderMaterial.prototype.matrix2fv = function (name, matrix, transpose) {
        if (transpose === void 0) { transpose = false; }
        var uniformLoc = this._uniforms[name];
        if (uniformLoc) {
            uniformLoc.matrix2fv(transpose, matrix);
        }
        return this;
    };
    ShaderMaterial.prototype.matrix3fv = function (name, matrix, transpose) {
        if (transpose === void 0) { transpose = false; }
        var uniformLoc = this._uniforms[name];
        if (uniformLoc) {
            uniformLoc.matrix3fv(transpose, matrix);
        }
        return this;
    };
    ShaderMaterial.prototype.matrix4fv = function (name, matrix, transpose) {
        if (transpose === void 0) { transpose = false; }
        var uniformLoc = this._uniforms[name];
        if (uniformLoc) {
            uniformLoc.matrix4fv(transpose, matrix);
        }
        return this;
    };
    ShaderMaterial.prototype.vector2fv = function (name, data) {
        var uniformLoc = this._uniforms[name];
        if (uniformLoc) {
            uniformLoc.uniform2fv(data);
        }
    };
    ShaderMaterial.prototype.vector3fv = function (name, data) {
        var uniformLoc = this._uniforms[name];
        if (uniformLoc) {
            uniformLoc.uniform3fv(data);
        }
    };
    ShaderMaterial.prototype.vector4fv = function (name, data) {
        var uniformLoc = this._uniforms[name];
        if (uniformLoc) {
            uniformLoc.uniform4fv(data);
        }
    };
    /**
     * @param mode Specifies the type of the primitive being rendered.
     * @param first Specifies the starting index in the array of vector points.
     * @param count The number of points to be rendered.
     */
    ShaderMaterial.prototype.drawArrays = function (mode, first, count) {
        var gl = this.gl;
        if (gl) {
            gl.drawArrays(mode, first, count);
        }
        return this;
    };
    /**
     * @param mode Specifies the type of the primitive being rendered.
     * @param count The number of elements to be rendered.
     * @param type The type of the values in the element array buffer.
     * @param offset Specifies an offset into the element array buffer.
     */
    ShaderMaterial.prototype.drawElements = function (mode, count, type, offset) {
        var gl = this.gl;
        if (gl) {
            gl.drawElements(mode, count, type, offset);
        }
        return this;
    };
    return ShaderMaterial;
}(ShareableContextConsumer_1.ShareableContextConsumer));
exports.ShaderMaterial = ShaderMaterial;
