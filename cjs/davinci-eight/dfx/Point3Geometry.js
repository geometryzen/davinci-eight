var Point3Geometry = (function () {
    function Point3Geometry() {
        this._points = [];
    }
    Point3Geometry.prototype.addPoint = function (point) {
        var newLength = this._points.push(point);
        var index = newLength - 1;
        return index;
    };
    Point3Geometry.prototype.accept = function (visitor) {
        visitor.points(this._points);
    };
    return Point3Geometry;
})();
module.exports = Point3Geometry;
