define(["require", "exports"], function (require, exports) {
    var Line3Geometry = (function () {
        function Line3Geometry() {
            this._lines = [];
        }
        Line3Geometry.prototype.addLine = function (line) {
            var newLength = this._lines.push(line);
            var index = newLength - 1;
            return index;
        };
        Line3Geometry.prototype.accept = function (visitor) {
            visitor.lines(this._lines);
        };
        return Line3Geometry;
    })();
    return Line3Geometry;
});
