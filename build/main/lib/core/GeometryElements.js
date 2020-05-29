"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryElements = void 0;
var tslib_1 = require("tslib");
var DataType_1 = require("./DataType");
var GeometryBase_1 = require("./GeometryBase");
var IndexBuffer_1 = require("./IndexBuffer");
var isArray_1 = require("../checks/isArray");
var isNull_1 = require("../checks/isNull");
var isUndefined_1 = require("../checks/isUndefined");
var mustBeArray_1 = require("../checks/mustBeArray");
var mustBeNonNullObject_1 = require("../checks/mustBeNonNullObject");
var vertexArraysFromPrimitive_1 = require("./vertexArraysFromPrimitive");
var VertexBuffer_1 = require("./VertexBuffer");
var Usage_1 = require("./Usage");
/**
 * A Geometry that supports interleaved vertex buffers.
 */
var GeometryElements = /** @class */ (function (_super) {
    tslib_1.__extends(GeometryElements, _super);
    /**
     *
     */
    function GeometryElements(contextManager, primitive, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, levelUp + 1) || this;
        /**
         * Hard-coded to zero right now.
         * This suggests that the index buffer could be used for several gl.drawElements(...)
         */
        _this.offset = 0;
        _this.setLoggingName('GeometryElements');
        mustBeNonNullObject_1.mustBeNonNullObject('primitive', primitive);
        var vertexArrays = vertexArraysFromPrimitive_1.vertexArraysFromPrimitive(primitive, options.order);
        _this.mode = vertexArrays.mode;
        _this.count = vertexArrays.indices.length;
        _this.ibo = new IndexBuffer_1.IndexBuffer(contextManager, new Uint16Array(vertexArrays.indices), Usage_1.Usage.STATIC_DRAW);
        _this.stride = vertexArrays.stride;
        if (!isNull_1.isNull(vertexArrays.pointers) && !isUndefined_1.isUndefined(vertexArrays.pointers)) {
            if (isArray_1.isArray(vertexArrays.pointers)) {
                _this.pointers = vertexArrays.pointers;
            }
            else {
                mustBeArray_1.mustBeArray('data.pointers', vertexArrays.pointers);
            }
        }
        else {
            _this.pointers = [];
        }
        _this.vbo = new VertexBuffer_1.VertexBuffer(contextManager, new Float32Array(vertexArrays.attributes), Usage_1.Usage.STATIC_DRAW);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GeometryElements.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('GeometryElements');
        this.ibo.addRef();
        this.vbo.addRef();
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    GeometryElements.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this.ibo.release();
        this.vbo.release();
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    GeometryElements.prototype.contextFree = function () {
        this.ibo.contextFree();
        this.vbo.contextFree();
        _super.prototype.contextFree.call(this);
    };
    GeometryElements.prototype.contextGain = function () {
        this.ibo.contextGain();
        this.vbo.contextGain();
        _super.prototype.contextGain.call(this);
    };
    GeometryElements.prototype.contextLost = function () {
        this.ibo.contextLost();
        this.vbo.contextLost();
        _super.prototype.contextLost.call(this);
    };
    GeometryElements.prototype.bind = function (material) {
        this.vbo.bind();
        var pointers = this.pointers;
        if (pointers) {
            var iLength = pointers.length;
            for (var i = 0; i < iLength; i++) {
                var pointer = pointers[i];
                var attrib = material.getAttrib(pointer.name);
                if (attrib) {
                    attrib.config(pointer.size, pointer.type, pointer.normalized, this.stride, pointer.offset);
                    attrib.enable();
                }
            }
        }
        this.ibo.bind();
        return this;
    };
    GeometryElements.prototype.unbind = function (material) {
        this.ibo.unbind();
        var pointers = this.pointers;
        if (pointers) {
            var iLength = pointers.length;
            for (var i = 0; i < iLength; i++) {
                var pointer = pointers[i];
                var attrib = material.getAttrib(pointer.name);
                if (attrib) {
                    attrib.disable();
                }
            }
        }
        this.vbo.unbind();
        return this;
    };
    GeometryElements.prototype.draw = function () {
        if (this.gl) {
            if (this.count) {
                this.gl.drawElements(this.mode, this.count, DataType_1.DataType.UNSIGNED_SHORT, this.offset);
            }
        }
        return this;
    };
    return GeometryElements;
}(GeometryBase_1.GeometryBase));
exports.GeometryElements = GeometryElements;
