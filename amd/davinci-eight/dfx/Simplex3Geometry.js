define(["require", "exports"], function (require, exports) {
    var Simplex3Geometry = (function () {
        function Simplex3Geometry() {
            this.faces = [];
        }
        Simplex3Geometry.prototype.addFace = function (face) {
            var newLength = this.faces.push(face);
            var index = newLength - 1;
            return index;
        };
        Simplex3Geometry.prototype.accept = function (visitor) {
            visitor.faces(this.faces);
        };
        return Simplex3Geometry;
    })();
    return Simplex3Geometry;
});
