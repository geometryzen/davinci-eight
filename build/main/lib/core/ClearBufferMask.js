"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearBufferMask = void 0;
var ClearBufferMask;
(function (ClearBufferMask) {
    ClearBufferMask[ClearBufferMask["DEPTH_BUFFER_BIT"] = 256] = "DEPTH_BUFFER_BIT";
    ClearBufferMask[ClearBufferMask["STENCIL_BUFFER_BIT"] = 1024] = "STENCIL_BUFFER_BIT";
    ClearBufferMask[ClearBufferMask["COLOR_BUFFER_BIT"] = 16384] = "COLOR_BUFFER_BIT";
})(ClearBufferMask = exports.ClearBufferMask || (exports.ClearBufferMask = {}));
