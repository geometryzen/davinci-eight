import * as tslib_1 from "tslib";
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeLT } from '../checks/mustBeLT';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeInteger } from '../checks/mustBeInteger';
import { numPostsForFence } from './numPostsForFence';
import { numVerticesForCurve } from './numVerticesForCurve';
import { readOnly } from '../i18n/readOnly';
import { VertexPrimitive } from './VertexPrimitive';
/**
 *
 */
var CurvePrimitive = /** @class */ (function (_super) {
    tslib_1.__extends(CurvePrimitive, _super);
    /**
     * @param mode
     * @param uSegments
     * @param uClosed
     */
    function CurvePrimitive(mode, uSegments, uClosed) {
        var _this = _super.call(this, mode, numVerticesForCurve(uSegments), 1) || this;
        mustBeInteger('uSegments', uSegments);
        mustBeGE('uSegments', uSegments, 0);
        mustBeBoolean('uClosed', uClosed);
        _this._uSegments = uSegments;
        _this._uClosed = uClosed;
        var uLength = _this.uLength;
        for (var uIndex = 0; uIndex < uLength; uIndex++) {
            var coords = _this.vertex(uIndex).coords;
            coords.setComponent(0, uIndex);
        }
        return _this;
    }
    Object.defineProperty(CurvePrimitive.prototype, "uSegments", {
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
    Object.defineProperty(CurvePrimitive.prototype, "uLength", {
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
    CurvePrimitive.prototype.vertexTransform = function (transform) {
        var iLen = this.vertices.length;
        for (var i = 0; i < iLen; i++) {
            var vertex = this.vertices[i];
            var u = vertex.coords.getComponent(0);
            transform.exec(vertex, u, 0, this.uLength, 0);
        }
    };
    CurvePrimitive.prototype.vertex = function (uIndex) {
        mustBeInteger('uIndex', uIndex);
        mustBeGE('uIndex', uIndex, 0);
        mustBeLT('uIndex', uIndex, this.uLength);
        return this.vertices[uIndex];
    };
    return CurvePrimitive;
}(VertexPrimitive));
export { CurvePrimitive };
