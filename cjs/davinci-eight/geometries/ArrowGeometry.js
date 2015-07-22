var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RevolutionGeometry = require('../geometries/RevolutionGeometry');
var Spinor3 = require('../math/Spinor3');
var Vector3 = require('../math/Vector3');
var ArrowGeometry = (function (_super) {
    __extends(ArrowGeometry, _super);
    function ArrowGeometry(scale, attitude, segments, length, radiusShaft, radiusCone, lengthCone, axis) {
        if (scale === void 0) { scale = 1; }
        if (attitude === void 0) { attitude = new Spinor3(); }
        if (segments === void 0) { segments = 12; }
        if (length === void 0) { length = 1; }
        if (radiusShaft === void 0) { radiusShaft = 0.01; }
        if (radiusCone === void 0) { radiusCone = 0.08; }
        if (lengthCone === void 0) { lengthCone = 0.20; }
        if (axis === void 0) { axis = Vector3.e3.clone(); }
        scale = scale || 1;
        attitude = attitude || new Spinor3();
        length = (length || 1) * scale;
        radiusShaft = (radiusShaft || 0.01) * scale;
        radiusCone = (radiusCone || 0.08) * scale;
        lengthCone = (lengthCone || 0.20) * scale;
        axis = axis || Vector3.e3.clone();
        var lengthShaft = length - lengthCone;
        var halfLength = length / 2;
        var permutation = function (direction) {
            if (direction.x) {
                return 2;
            }
            else if (direction.y) {
                return 1;
            }
            else {
                return 0;
            }
        };
        var orientation = function (direction) {
            if (direction.x > 0) {
                return +1;
            }
            else if (direction.x < 0) {
                return -1;
            }
            else if (direction.y > 0) {
                return +1;
            }
            else if (direction.y < 0) {
                return -1;
            }
            else if (direction.z > 0) {
                return +1;
            }
            else if (direction.z < 0) {
                return -1;
            }
            else {
                return 0;
            }
        };
        var computeArrow = function (direction) {
            var cycle = permutation(direction);
            var sign = orientation(direction);
            var i = (cycle + 0) % 3;
            var j = (cycle + 1) % 3;
            var k = (cycle + 2) % 3;
            var shL = halfLength * sign;
            var data = [
                [0, 0, halfLength * sign],
                [radiusCone, 0, (lengthShaft - halfLength) * sign],
                [radiusShaft, 0, (lengthShaft - halfLength) * sign],
                [radiusShaft, 0, (-halfLength) * sign],
                [0, 0, (-halfLength) * sign]
            ];
            var points = data.map(function (point) {
                return new Vector3({ x: point[i], y: point[j], z: point[k] });
            });
            var generator = new Spinor3({ yz: direction.x, zx: direction.y, xy: direction.z, w: 0 });
            return { "points": points, "generator": generator };
        };
        var arrow = computeArrow(axis);
        _super.call(this, arrow.points, arrow.generator, segments, 0, 2 * Math.PI, attitude);
    }
    return ArrowGeometry;
})(RevolutionGeometry);
module.exports = ArrowGeometry;
