var Face3Geometry = (function () {
    function Face3Geometry() {
        this.faces = [];
    }
    Face3Geometry.prototype.addFace = function (face) {
        var newLength = this.faces.push(face);
        var index = newLength - 1;
        return index;
    };
    Face3Geometry.prototype.accept = function (visitor) {
        visitor.faces(this.faces);
    };
    return Face3Geometry;
})();
module.exports = Face3Geometry;
