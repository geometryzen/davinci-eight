"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The enumerated modes of drawing WebGL primitives.
 *
 * https://www.khronos.org/registry/webgl/specs/1.0/
 */
var BeginMode;
(function (BeginMode) {
    BeginMode[BeginMode["POINTS"] = 0] = "POINTS";
    BeginMode[BeginMode["LINES"] = 1] = "LINES";
    BeginMode[BeginMode["LINE_LOOP"] = 2] = "LINE_LOOP";
    BeginMode[BeginMode["LINE_STRIP"] = 3] = "LINE_STRIP";
    BeginMode[BeginMode["TRIANGLES"] = 4] = "TRIANGLES";
    BeginMode[BeginMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
    BeginMode[BeginMode["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
})(BeginMode = exports.BeginMode || (exports.BeginMode = {}));
