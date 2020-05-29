"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = exports.TrackGeometry = void 0;
var tslib_1 = require("tslib");
var BeginMode_1 = require("../core/BeginMode");
var Color_1 = require("../core/Color");
var DataType_1 = require("../core/DataType");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var LineMaterial_1 = require("../materials/LineMaterial");
var Matrix4_1 = require("../math/Matrix4");
var Mesh_1 = require("../core/Mesh");
var setColorOption_1 = require("./setColorOption");
var Usage_1 = require("../core/Usage");
var VertexBuffer_1 = require("../core/VertexBuffer");
var FLOATS_PER_VERTEX = 3;
var BYTES_PER_FLOAT = 4;
var STRIDE = BYTES_PER_FLOAT * FLOATS_PER_VERTEX;
/**
 *
 */
var TrackGeometry = /** @class */ (function () {
    function TrackGeometry(contextManager) {
        this.contextManager = contextManager;
        this.scaling = Matrix4_1.Matrix4.one.clone();
        this.count = 0;
        this.N = 2;
        this.dirty = true;
        this.refCount = 1;
        this.data = new Float32Array(this.N * FLOATS_PER_VERTEX);
        this.vbo = new VertexBuffer_1.VertexBuffer(contextManager, this.data, Usage_1.Usage.DYNAMIC_DRAW);
    }
    TrackGeometry.prototype.destructor = function () {
        this.vbo.release();
        this.vbo = void 0;
    };
    TrackGeometry.prototype.bind = function (material) {
        if (this.dirty) {
            this.vbo.bind();
            this.vbo.upload();
            this.vbo.unbind();
            this.dirty = false;
        }
        this.vbo.bind();
        var aPosition = material.getAttrib(GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION);
        aPosition.config(FLOATS_PER_VERTEX, DataType_1.DataType.FLOAT, true, STRIDE, 0);
        aPosition.enable();
        return this;
    };
    TrackGeometry.prototype.unbind = function (material) {
        var aPosition = material.getAttrib(GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION);
        aPosition.disable();
        this.vbo.unbind();
        return this;
    };
    TrackGeometry.prototype.draw = function () {
        this.contextManager.gl.drawArrays(BeginMode_1.BeginMode.LINE_STRIP, 0, this.count);
        return this;
    };
    TrackGeometry.prototype.contextFree = function () {
        this.vbo.contextFree();
    };
    TrackGeometry.prototype.contextGain = function () {
        this.vbo.contextGain();
    };
    TrackGeometry.prototype.contextLost = function () {
        this.vbo.contextLost();
    };
    TrackGeometry.prototype.addRef = function () {
        this.refCount++;
        return this.refCount;
    };
    TrackGeometry.prototype.release = function () {
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        return this.refCount;
    };
    /**
     *
     */
    TrackGeometry.prototype.addPoint = function (x, y, z) {
        if (this.count === this.N) {
            this.N = this.N * 2;
            var temp = new Float32Array(this.N * FLOATS_PER_VERTEX);
            temp.set(this.data);
            this.data = temp;
            this.vbo.release();
            this.vbo = new VertexBuffer_1.VertexBuffer(this.contextManager, this.data, Usage_1.Usage.DYNAMIC_DRAW);
        }
        var offset = this.count * FLOATS_PER_VERTEX;
        this.data[offset + 0] = x;
        this.data[offset + 1] = y;
        this.data[offset + 2] = z;
        this.count++;
        this.dirty = true;
    };
    /**
     *
     */
    TrackGeometry.prototype.erase = function () {
        this.count = 0;
    };
    return TrackGeometry;
}());
exports.TrackGeometry = TrackGeometry;
/**
 *
 */
var Track = /** @class */ (function (_super) {
    tslib_1.__extends(Track, _super);
    function Track(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = 
        // The TrackGeometry cannot be cached because it is dynamic.
        // The LineMaterial can be cached.
        _super.call(this, new TrackGeometry(contextManager), new LineMaterial_1.LineMaterial(contextManager), contextManager, {}, levelUp + 1) || this;
        _this.setLoggingName('Track');
        // Adjust geometry reference count resulting from construction.
        var geometry = _this.geometry;
        geometry.release();
        geometry.release();
        // Adjust material reference count resulting from construction.
        var material = _this.material;
        material.release();
        material.release();
        setColorOption_1.setColorOption(_this, options, Color_1.Color.gray);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    Track.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    /**
     *
     */
    Track.prototype.addPoint = function (point) {
        if (point) {
            var geometry = this.geometry;
            geometry.addPoint(point.x, point.y, point.z);
            geometry.release();
        }
    };
    /**
     *
     */
    Track.prototype.clear = function () {
        var geometry = this.geometry;
        geometry.erase();
        geometry.release();
    };
    return Track;
}(Mesh_1.Mesh));
exports.Track = Track;
