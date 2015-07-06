define(["require", "exports"], function (require, exports) {
    var GeometryVertexAttributeProvider = (function () {
        function GeometryVertexAttributeProvider(geometry) {
        }
        GeometryVertexAttributeProvider.prototype.draw = function (context) {
        };
        GeometryVertexAttributeProvider.prototype.dynamic = function () {
            return true;
        };
        GeometryVertexAttributeProvider.prototype.hasElements = function () {
            return false;
        };
        GeometryVertexAttributeProvider.prototype.getElements = function () {
            return null;
        };
        GeometryVertexAttributeProvider.prototype.getVertexAttributeData = function (name) {
            return null;
        };
        GeometryVertexAttributeProvider.prototype.getAttributeMetaInfos = function () {
            return null;
        };
        GeometryVertexAttributeProvider.prototype.update = function (time, attributes) {
        };
        return GeometryVertexAttributeProvider;
    })();
    return GeometryVertexAttributeProvider;
});
