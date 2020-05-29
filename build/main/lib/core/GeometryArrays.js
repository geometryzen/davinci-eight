"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeometryArrays = void 0;
var tslib_1 = require("tslib");
var GeometryBase_1 = require("./GeometryBase");
var mustBeNonNullObject_1 = require("../checks/mustBeNonNullObject");
var Usage_1 = require("./Usage");
var vertexArraysFromPrimitive_1 = require("./vertexArraysFromPrimitive");
var VertexBuffer_1 = require("./VertexBuffer");
/**
 * A concrete Geometry for supporting drawArrays.
 */
var GeometryArrays = /** @class */ (function (_super) {
    tslib_1.__extends(GeometryArrays, _super);
    /**
     *
     */
    function GeometryArrays(contextManager, primitive, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, levelUp + 1) || this;
        /**
         * The <code>first</code> parameter in the drawArrays call.
         * This is currently hard-code to zero because this class only supportes buffering one primitive.
         */
        _this.first = 0;
        mustBeNonNullObject_1.mustBeNonNullObject('primitive', primitive);
        _this.setLoggingName('GeometryArrays');
        // FIXME: order as an option
        var vertexArrays = vertexArraysFromPrimitive_1.vertexArraysFromPrimitive(primitive, options.order);
        _this.mode = vertexArrays.mode;
        _this.vbo = new VertexBuffer_1.VertexBuffer(contextManager, new Float32Array(vertexArrays.attributes), Usage_1.Usage.STATIC_DRAW);
        // FIXME: Hacky
        _this.count = vertexArrays.attributes.length / (vertexArrays.stride / 4);
        // FIXME: stride is not quite appropriate here because we don't have BYTES.
        _this.stride = vertexArrays.stride;
        _this.pointers = vertexArrays.pointers;
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    GeometryArrays.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('GeometryArrays');
        this.vbo.addRef();
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    GeometryArrays.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this.vbo.release();
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    GeometryArrays.prototype.bind = function (material) {
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
        return this;
    };
    GeometryArrays.prototype.draw = function () {
        if (this.gl) {
            this.gl.drawArrays(this.mode, this.first, this.count);
        }
        return this;
    };
    GeometryArrays.prototype.unbind = function (material) {
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
    return GeometryArrays;
}(GeometryBase_1.GeometryBase));
exports.GeometryArrays = GeometryArrays;
