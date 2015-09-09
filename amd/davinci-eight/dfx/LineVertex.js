define(["require", "exports"], function (require, exports) {
    var LineVertex = (function () {
        function LineVertex(position, normal) {
            this.position = position;
            this.normal = normal;
        }
        return LineVertex;
    })();
    return LineVertex;
});
