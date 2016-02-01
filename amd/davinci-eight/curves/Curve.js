define(["require", "exports"], function (require, exports) {
    var Curve = (function () {
        function Curve() {
        }
        Curve.prototype.getPoint = function (t) {
            throw new Error("Curve.getPoint() not implemented!");
        };
        Curve.prototype.getPointAt = function (u) {
            var t = this.getUtoTmapping(u);
            return this.getPoint(t);
        };
        Curve.prototype.getPoints = function (divisions) {
            if (!divisions) {
                divisions = 5;
            }
            var d;
            var pts = [];
            for (d = 0; d <= divisions; d++) {
                pts.push(this.getPoint(d / divisions));
            }
            return pts;
        };
        Curve.prototype.getSpacedPoints = function (divisions) {
            if (!divisions) {
                divisions = 5;
            }
            var d;
            var pts = [];
            for (d = 0; d <= divisions; d++) {
                pts.push(this.getPointAt(d / divisions));
            }
            return pts;
        };
        Curve.prototype.getLength = function () {
            var lengths = this.getLengths();
            return lengths[lengths.length - 1];
        };
        Curve.prototype.getLengths = function (divisions) {
            if (!divisions)
                divisions = (this.__arcLengthDivisions) ? (this.__arcLengthDivisions) : 200;
            if (this.cacheArcLengths
                && (this.cacheArcLengths.length == divisions + 1)
                && !this.needsUpdate) {
                return this.cacheArcLengths;
            }
            this.needsUpdate = false;
            var cache = [];
            var current;
            var last = this.getPoint(0);
            var p;
            var sum = 0;
            cache.push(0);
            for (p = 1; p <= divisions; p++) {
                current = this.getPoint(p / divisions);
                sum += current.distanceTo(last);
                cache.push(sum);
                last = current;
            }
            this.cacheArcLengths = cache;
            return cache;
        };
        Curve.prototype.updateArcLengths = function () {
            this.needsUpdate = true;
            this.getLengths();
        };
        Curve.prototype.getUtoTmapping = function (u, distance) {
            var arcLengths = this.getLengths();
            var i = 0, il = arcLengths.length;
            var targetArcLength;
            if (distance) {
                targetArcLength = distance;
            }
            else {
                targetArcLength = u * arcLengths[il - 1];
            }
            var low = 0;
            var high = il - 1;
            var comparison;
            while (low <= high) {
                i = Math.floor(low + (high - low) / 2);
                comparison = arcLengths[i] - targetArcLength;
                if (comparison < 0) {
                    low = i + 1;
                }
                else if (comparison > 0) {
                    high = i - 1;
                }
                else {
                    high = i;
                    break;
                }
            }
            i = high;
            if (arcLengths[i] == targetArcLength) {
                var t = i / (il - 1);
                return t;
            }
            var lengthBefore = arcLengths[i];
            var lengthAfter = arcLengths[i + 1];
            var segmentLength = lengthAfter - lengthBefore;
            var segmentFraction = (targetArcLength - lengthBefore) / segmentLength;
            var t = (i + segmentFraction) / (il - 1);
            return t;
        };
        Curve.prototype.getTangent = function (t) {
            var delta = 0.0001;
            var t1 = t - delta;
            var t2 = t + delta;
            if (t1 < 0)
                t1 = 0;
            if (t2 > 1)
                t2 = 1;
            var pt1 = this.getPoint(t1);
            var pt2 = this.getPoint(t2);
            var tangent = pt2.sub(pt1);
            return tangent.direction();
        };
        Curve.prototype.getTangentAt = function (u) {
            var t = this.getUtoTmapping(u);
            return this.getTangent(t);
        };
        return Curve;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Curve;
});
