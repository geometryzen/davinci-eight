define(["require", "exports"], function (require, exports) {
    /**
     * The enumerated modes of drawing WebGL primitives.
     * @class DrawMode
     */
    var DrawMode;
    (function (DrawMode) {
        /**
         * @property POINTS
         * @type {DrawMode}
         */
        DrawMode[DrawMode["POINTS"] = 0] = "POINTS";
        /**
         * @property LINES
         * @type {DrawMode}
         */
        DrawMode[DrawMode["LINES"] = 1] = "LINES";
        /**
         * @property LINE_STRIP
         * @type {DrawMode}
         */
        DrawMode[DrawMode["LINE_STRIP"] = 2] = "LINE_STRIP";
        /**
         * @property LINE_LOOP
         * @type {DrawMode}
         */
        DrawMode[DrawMode["LINE_LOOP"] = 3] = "LINE_LOOP";
        /**
         * @property TRIANGLES
         * @type {DrawMode}
         */
        DrawMode[DrawMode["TRIANGLES"] = 4] = "TRIANGLES";
        /**
         * @property TRIANGLE_STRIP
         * @type {DrawMode}
         */
        DrawMode[DrawMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        /**
         * @property TRIANGLE_FAN
         * @type {DrawMode}
         */
        DrawMode[DrawMode["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
    })(DrawMode || (DrawMode = {}));
    return DrawMode;
});
