import * as tslib_1 from "tslib";
import { DataType } from './DataType';
import { GeometryBase } from './GeometryBase';
import { IndexBuffer } from './IndexBuffer';
import { isArray } from '../checks/isArray';
import { isNull } from '../checks/isNull';
import { isUndefined } from '../checks/isUndefined';
import { mustBeArray } from '../checks/mustBeArray';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { vertexArraysFromPrimitive } from './vertexArraysFromPrimitive';
import { VertexBuffer } from './VertexBuffer';
import { Usage } from './Usage';
/**
 * A Geometry that supports interleaved vertex buffers.
 */
var GeometryElements = (function (_super) {
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
        mustBeNonNullObject('primitive', primitive);
        var vertexArrays = vertexArraysFromPrimitive(primitive, options.order);
        _this.mode = vertexArrays.mode;
        _this.count = vertexArrays.indices.length;
        _this.ibo = new IndexBuffer(contextManager, new Uint16Array(vertexArrays.indices), Usage.STATIC_DRAW);
        _this.stride = vertexArrays.stride;
        if (!isNull(vertexArrays.pointers) && !isUndefined(vertexArrays.pointers)) {
            if (isArray(vertexArrays.pointers)) {
                _this.pointers = vertexArrays.pointers;
            }
            else {
                mustBeArray('data.pointers', vertexArrays.pointers);
            }
        }
        else {
            _this.pointers = [];
        }
        _this.vbo = new VertexBuffer(contextManager, new Float32Array(vertexArrays.attributes), Usage.STATIC_DRAW);
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
                this.gl.drawElements(this.mode, this.count, DataType.UNSIGNED_SHORT, this.offset);
            }
        }
        return this;
    };
    return GeometryElements;
}(GeometryBase));
export { GeometryElements };
