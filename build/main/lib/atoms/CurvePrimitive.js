"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mustBeGE_1 = require("../checks/mustBeGE");
var mustBeLT_1 = require("../checks/mustBeLT");
var mustBeBoolean_1 = require("../checks/mustBeBoolean");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var numPostsForFence_1 = require("./numPostsForFence");
var numVerticesForCurve_1 = require("./numVerticesForCurve");
var readOnly_1 = require("../i18n/readOnly");
var VertexPrimitive_1 = require("./VertexPrimitive");
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
        var _this = _super.call(this, mode, numVerticesForCurve_1.numVerticesForCurve(uSegments), 1) || this;
        mustBeInteger_1.mustBeInteger('uSegments', uSegments);
        mustBeGE_1.mustBeGE('uSegments', uSegments, 0);
        mustBeBoolean_1.mustBeBoolean('uClosed', uClosed);
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
            mustBeInteger_1.mustBeInteger('uSegments', uSegments);
            throw new Error(readOnly_1.readOnly('uSegments').message);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CurvePrimitive.prototype, "uLength", {
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
    CurvePrimitive.prototype.vertexTransform = function (transform) {
        var iLen = this.vertices.length;
        for (var i = 0; i < iLen; i++) {
            var vertex = this.vertices[i];
            var u = vertex.coords.getComponent(0);
            transform.exec(vertex, u, 0, this.uLength, 0);
        }
    };
    CurvePrimitive.prototype.vertex = function (uIndex) {
        mustBeInteger_1.mustBeInteger('uIndex', uIndex);
        mustBeGE_1.mustBeGE('uIndex', uIndex, 0);
        mustBeLT_1.mustBeLT('uIndex', uIndex, this.uLength);
        return this.vertices[uIndex];
    };
    return CurvePrimitive;
}(VertexPrimitive_1.VertexPrimitive));
exports.CurvePrimitive = CurvePrimitive;
