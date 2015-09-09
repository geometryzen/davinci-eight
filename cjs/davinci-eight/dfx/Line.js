var Line = (function () {
    /**
     * @class Line
     * @constructor
     * @param a {LineVertex}
     * @param b {LineVertex}
     */
    function Line(a, b) {
        this.a = a;
        this.b = b;
        a.parent = this;
        b.parent = this;
    }
    return Line;
})();
module.exports = Line;
