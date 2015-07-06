/// <reference path='../geometries/VertexAttributeProvider.d.ts'/>
var cuboid = require('../geometries/cuboid');
var BoxGeometry = (function () {
    function BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
        this.cuboid = cuboid();
        this.cuboid.a = this.cuboid.a.scalarMultiply(width);
        this.cuboid.b = this.cuboid.b.scalarMultiply(height);
        this.cuboid.c = this.cuboid.c.scalarMultiply(depth);
    }
    BoxGeometry.prototype.draw = function (context) {
        return this.cuboid.draw(context);
    };
    BoxGeometry.prototype.dynamic = function () {
        return this.cuboid.dynamic();
    };
    BoxGeometry.prototype.hasElements = function () {
        return this.cuboid.hasElements();
    };
    BoxGeometry.prototype.getElements = function () {
        return this.cuboid.getElements();
    };
    BoxGeometry.prototype.getVertexAttributeData = function (name) {
        return this.cuboid.getVertexAttributeData(name);
    };
    BoxGeometry.prototype.getAttributeMetaInfos = function () {
        return this.cuboid.getAttributeMetaInfos();
    };
    BoxGeometry.prototype.update = function (time, attributes) {
        return this.cuboid.update(time, attributes);
    };
    return BoxGeometry;
})();
module.exports = BoxGeometry;
