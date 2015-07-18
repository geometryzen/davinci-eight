var DrawMode;
(function (DrawMode) {
    DrawMode[DrawMode["POINTS"] = 0] = "POINTS";
    DrawMode[DrawMode["LINES"] = 1] = "LINES";
    DrawMode[DrawMode["TRIANGLES"] = 2] = "TRIANGLES";
})(DrawMode || (DrawMode = {}));
module.exports = DrawMode;
