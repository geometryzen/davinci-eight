import * as tslib_1 from "tslib";
import { mustBeInteger } from '../checks/mustBeInteger';
import { numPostsForFence } from './numPostsForFence';
import { numVerticesForGrid } from './numVerticesForGrid';
import { notSupported } from '../i18n/notSupported';
import { readOnly } from '../i18n/readOnly';
import { VertexPrimitive } from './VertexPrimitive';
/**
 * Used for creating a VertexPrimitive for a surface.
 * The vertices generated have coordinates (u, v) and the traversal creates
 * counter-clockwise orientation when increasing u is the first direction and
 * increasing v the second direction.
 */
var GridPrimitive = (function (_super) {
    tslib_1.__extends(GridPrimitive, _super);
    function GridPrimitive(mode, uSegments, vSegments) {
        var _this = _super.call(this, mode, numVerticesForGrid(uSegments, vSegments), 2) || this;
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
            mustBeInteger('uSegments', uSegments);
            throw new Error(readOnly('uSegments').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPrimitive.prototype, "uLength", {
        /**
         * uLength = uSegments + 1
         */
        get: function () {
            return numPostsForFence(this._uSegments, this._uClosed);
        },
        set: function (uLength) {
            mustBeInteger('uLength', uLength);
            throw new Error(readOnly('uLength').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPrimitive.prototype, "vSegments", {
        get: function () {
            return this._vSegments;
        },
        set: function (vSegments) {
            mustBeInteger('vSegments', vSegments);
            throw new Error(readOnly('vSegments').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPrimitive.prototype, "vLength", {
        /**
         * vLength = vSegments + 1
         */
        get: function () {
            return numPostsForFence(this._vSegments, this._vClosed);
        },
        set: function (vLength) {
            mustBeInteger('vLength', vLength);
            throw new Error(readOnly('vLength').message);
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
        mustBeInteger('i', i);
        mustBeInteger('j', j);
        throw new Error(notSupported('vertex').message);
    };
    return GridPrimitive;
}(VertexPrimitive));
export { GridPrimitive };
