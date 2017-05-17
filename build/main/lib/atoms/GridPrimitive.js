"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var numPostsForFence_1 = require("./numPostsForFence");
var numVerticesForGrid_1 = require("./numVerticesForGrid");
var notSupported_1 = require("../i18n/notSupported");
var readOnly_1 = require("../i18n/readOnly");
var VertexPrimitive_1 = require("./VertexPrimitive");
/**
 * Used for creating a VertexPrimitive for a surface.
 * The vertices generated have coordinates (u, v) and the traversal creates
 * counter-clockwise orientation when increasing u is the first direction and
 * increasing v the second direction.
 */
var GridPrimitive = (function (_super) {
    tslib_1.__extends(GridPrimitive, _super);
    function GridPrimitive(mode, uSegments, vSegments) {
        var _this = _super.call(this, mode, numVerticesForGrid_1.numVerticesForGrid(uSegments, vSegments), 2) || this;
        _this._uClosed = false;
        _this._vClosed = false;
        _this._uSegments = uSegments;
        _this._vSegments = vSegments;
        return _this;
    }
    Object.defineProperty(GridPrimitive.prototype, "uSegments", {
        get: function () {
            return this._uSegments;
        },
        set: function (uSegments) {
            mustBeInteger_1.mustBeInteger('uSegments', uSegments);
            throw new Error(readOnly_1.readOnly('uSegments').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPrimitive.prototype, "uLength", {
        /**
         * uLength = uSegments + 1
         */
        get: function () {
            return numPostsForFence_1.numPostsForFence(this._uSegments, this._uClosed);
        },
        set: function (uLength) {
            mustBeInteger_1.mustBeInteger('uLength', uLength);
            throw new Error(readOnly_1.readOnly('uLength').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPrimitive.prototype, "vSegments", {
        get: function () {
            return this._vSegments;
        },
        set: function (vSegments) {
            mustBeInteger_1.mustBeInteger('vSegments', vSegments);
            throw new Error(readOnly_1.readOnly('vSegments').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPrimitive.prototype, "vLength", {
        /**
         * vLength = vSegments + 1
         */
        get: function () {
            return numPostsForFence_1.numPostsForFence(this._vSegments, this._vClosed);
        },
        set: function (vLength) {
            mustBeInteger_1.mustBeInteger('vLength', vLength);
            throw new Error(readOnly_1.readOnly('vLength').message);
        },
        enumerable: true,
        configurable: true
    });
    GridPrimitive.prototype.vertexTransform = function (transform) {
        var iLen = this.vertices.length;
        for (var i = 0; i < iLen; i++) {
            var vertex = this.vertices[i];
            var u = vertex.coords.getComponent(0);
            var v = vertex.coords.getComponent(1);
            transform.exec(vertex, u, v, this.uLength, this.vLength);
        }
    };
    /**
     * Derived classes must override.
     */
    GridPrimitive.prototype.vertex = function (i, j) {
        mustBeInteger_1.mustBeInteger('i', i);
        mustBeInteger_1.mustBeInteger('j', j);
        throw new Error(notSupported_1.notSupported('vertex').message);
    };
    return GridPrimitive;
}(VertexPrimitive_1.VertexPrimitive));
exports.GridPrimitive = GridPrimitive;
