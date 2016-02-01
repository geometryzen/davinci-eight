define(["require", "exports"], function (require, exports) {
    var DrawMode;
    (function (DrawMode) {
        DrawMode[DrawMode["POINTS"] = 0] = "POINTS";
        DrawMode[DrawMode["LINES"] = 1] = "LINES";
        DrawMode[DrawMode["LINE_STRIP"] = 2] = "LINE_STRIP";
        DrawMode[DrawMode["LINE_LOOP"] = 3] = "LINE_LOOP";
        DrawMode[DrawMode["TRIANGLES"] = 4] = "TRIANGLES";
        DrawMode[DrawMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        DrawMode[DrawMode["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
    })(DrawMode || (DrawMode = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DrawMode;
});
