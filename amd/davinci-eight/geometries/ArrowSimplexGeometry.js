var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../geometries/RevolutionSimplexGeometry', '../math/SpinG3', '../math/R3'], function (require, exports, Euclidean3, RevolutionSimplexGeometry, SpinG3, R3) {
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
                return new R3([orientation(cardinalIndex, direction), 0, 0]);
            }
            case 1: {
                return new R3([0, orientation(cardinalIndex, direction), 0]);
            }
            case 2: {
                return new R3([0, 0, orientation(cardinalIndex, direction)]);
            }
        }
        return R3.copy(direction);
    }
    /**
     * @class ArrowSimplexGeometry
     */
    var ArrowSimplexGeometry = (function (_super) {
        __extends(ArrowSimplexGeometry, _super);
        /**
         * @class ArrowSimplexGeometry
         * @constructor
         */
        function ArrowSimplexGeometry() {
            _super.call(this, 'ArrowSimplexGeometry');
            this.lengthCone = 0.20;
            this.radiusCone = 0.08;
            this.radiusShaft = 0.01;
            /**
             * @property vector
             * @type {R3}
             */
            this.vector = R3.copy(Euclidean3.e1);
            this.segments = 12;
            this.setModified(true);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ArrowSimplexGeometry.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        /**
         * @method isModified
         * @return {boolean}
         */
        ArrowSimplexGeometry.prototype.isModified = function () {
            return this.vector.modified;
        };
        /**
         * @method setModified
         * @param modified {boolean}
         * @return {ArrowSimplexGeometry}
         */
        ArrowSimplexGeometry.prototype.setModified = function (modified) {
            this.vector.modified = modified;
            return this;
        };
        /**
         * @method regenerate
         * @return {void}
         */
        ArrowSimplexGeometry.prototype.regenerate = function () {
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
                    return new R3([point[i], point[j], point[k]]);
                });
                // We're essentially computing the dual of the vector as the rotation generator.
                var n = nearest(direction);
                var generator = new SpinG3([n.x, n.y, n.z, 0]);
                return { "points": points, "generator": generator };
            };
            var direction = R3.copy(this.vector).normalize();
            var arrow = computeArrow(direction);
            var R = new SpinG3().rotor(direction, nearest(direction));
            this.data = [];
            _super.prototype.revolve.call(this, arrow.points, arrow.generator, this.segments, 0, 2 * Math.PI, R);
            this.setModified(false);
        };
        return ArrowSimplexGeometry;
    })(RevolutionSimplexGeometry);
    return ArrowSimplexGeometry;
});
