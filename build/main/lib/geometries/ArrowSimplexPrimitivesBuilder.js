"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowSimplexPrimitivesBuilder = void 0;
var tslib_1 = require("tslib");
var RevolutionSimplexPrimitivesBuilder_1 = require("../geometries/RevolutionSimplexPrimitivesBuilder");
var Spinor3_1 = require("../math/Spinor3");
var Vector3_1 = require("../math/Vector3");
function signum(x) {
    return x >= 0 ? +1 : -1;
}
function bigger(a, b) {
    return a >= b;
}
var permutation = function (direction) {
    var x = Math.abs(direction.x);
    var y = Math.abs(direction.y);
    var z = Math.abs(direction.z);
    return bigger(x, z) ? (bigger(x, y) ? 0 : 1) : (bigger(y, z) ? 1 : 2);
};
var orientation = function (cardinalIndex, direction) {
    return signum(direction.getComponent(cardinalIndex));
};
function nearest(direction) {
    var cardinalIndex = permutation(direction);
    switch (cardinalIndex) {
        case 0: {
            return new Vector3_1.Vector3([orientation(cardinalIndex, direction), 0, 0]);
        }
        case 1: {
            return new Vector3_1.Vector3([0, orientation(cardinalIndex, direction), 0]);
        }
        case 2: {
            return new Vector3_1.Vector3([0, 0, orientation(cardinalIndex, direction)]);
        }
    }
    return Vector3_1.Vector3.copy(direction);
}
var ArrowSimplexPrimitivesBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(ArrowSimplexPrimitivesBuilder, _super);
    function ArrowSimplexPrimitivesBuilder() {
        var _this = _super.call(this) || this;
        _this.lengthCone = 0.20;
        _this.radiusCone = 0.08;
        _this.radiusShaft = 0.01;
        _this.vector = Vector3_1.Vector3.vector(1, 0, 0);
        _this.segments = 12;
        _this.modified_ = true;
        return _this;
    }
    ArrowSimplexPrimitivesBuilder.prototype.isModified = function () {
        return this.modified_;
    };
    ArrowSimplexPrimitivesBuilder.prototype.setModified = function (modified) {
        this.modified_ = modified;
        return this;
    };
    ArrowSimplexPrimitivesBuilder.prototype.regenerate = function () {
        var length = this.vector.magnitude();
        var lengthShaft = length - this.lengthCone;
        var halfLength = length / 2;
        var radiusCone = this.radiusCone;
        var radiusShaft = this.radiusShaft;
        var computeArrow = function (direction) {
            var cycle = permutation(direction);
            var sign = orientation(cycle, direction);
            var i = (cycle + 0) % 3;
            var j = (cycle + 2) % 3;
            var k = (cycle + 1) % 3;
            var a = halfLength * sign;
            var b = lengthShaft * sign;
            // data is for an arrow pointing in the e1 direction in the xy-plane.
            var data = [
                [a, 0, 0],
                [b - a, radiusCone, 0],
                [b - a, radiusShaft, 0],
                [-a, radiusShaft, 0],
                [-a, 0, 0] // tail end
            ];
            var points = data.map(function (point) {
                return new Vector3_1.Vector3([point[i], point[j], point[k]]);
            });
            var generator = Spinor3_1.Spinor3.dual(nearest(direction), false);
            return { "points": points, "generator": generator };
        };
        var direction = Vector3_1.Vector3.copy(this.vector).normalize();
        var arrow = computeArrow(direction);
        // TODO: The directions may be wrong here and need revesing.
        // The convention is that we rotate from a to b.
        var R = Spinor3_1.Spinor3.rotorFromDirections(nearest(direction), direction);
        this.data = [];
        _super.prototype.revolve.call(this, arrow.points, arrow.generator, this.segments, 0, 2 * Math.PI, R);
        this.setModified(false);
    };
    return ArrowSimplexPrimitivesBuilder;
}(RevolutionSimplexPrimitivesBuilder_1.RevolutionSimplexPrimitivesBuilder));
exports.ArrowSimplexPrimitivesBuilder = ArrowSimplexPrimitivesBuilder;
