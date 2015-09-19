define(["require", "exports", '../dfx/checkGeometry', '../dfx/Simplex'], function (require, exports, checkGeometry, Simplex) {
    /**
     * @class Complex
     */
    var Complex = (function () {
        // TODO: public boundingSphere: Sphere = new Sphere({x: 0, y: 0, z: 0}, Infinity);
        /**
         * @class Complex
         * @constructor
         */
        function Complex() {
            /**
             * @property data
             * @type {Simplex[]}
             */
            this.data = [];
            this.dynamic = true;
            this.verticesNeedUpdate = false;
            this.elementsNeedUpdate = false;
            this.uvsNeedUpdate = false;
        }
        Complex.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            // console.warn("Complex.mergeVertices not yet implemented");
        };
        /**
         * <p>
         * Applies the <em>boundary</em> operation to each Simplex in this instance the specified number of times.
         * </p>
         *
         * @method boundary
         * @param times {number} Determines the number of times the boundary operation is applied to this instance.
         * @return {void}
         */
        Complex.prototype.boundary = function (times) {
            this.data = Simplex.boundary(this.data, times);
            this.check();
        };
        /**
         * Applies the subdivide operation to each Simplex in this instance the specified number of times.
         *
         * @method subdivide
         * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
         * @return {void}
         */
        Complex.prototype.subdivide = function (times) {
            this.data = Simplex.subdivide(this.data, times);
            this.check();
        };
        /**
         * Updates the meta property of this instance to match the data.
         *
         * @method check
         * @return {void}
         */
        Complex.prototype.check = function () {
            this.meta = checkGeometry(this.data);
        };
        return Complex;
    })();
    return Complex;
});
