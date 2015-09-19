define(["require", "exports", '../dfx/checkGeometry', '../geometries/Geometry', '../dfx/Simplex', '../dfx/toDrawElements'], function (require, exports, checkGeometry, Geometry, Simplex, toDrawElements) {
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
        /**
         * <p>
         * Applies the <em>boundary</em> operation to each Simplex in this instance the specified number of times.
         * </p>
         *
         * @method boundary
         * @param times {number} Determines the number of times the boundary operation is applied to this instance.
         * @return {Complex}
         */
        Complex.prototype.boundary = function (times) {
            this.data = Simplex.boundary(this.data, times);
            return this.check();
        };
        /**
         * Updates the meta property of this instance to match the data.
         *
         * @method check
         * @return {Complex}
         */
        Complex.prototype.check = function () {
            this.meta = checkGeometry(this.data);
            return this;
        };
        /**
         * Applies the subdivide operation to each Simplex in this instance the specified number of times.
         *
         * @method subdivide
         * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
         * @return {Complex}
         */
        Complex.prototype.subdivide = function (times) {
            this.data = Simplex.subdivide(this.data, times);
            this.check();
            return this;
        };
        /**
         * @method toGeometry
         * @return {Geometry}
         */
        Complex.prototype.toGeometry = function () {
            var elements = toDrawElements(this.data, this.meta);
            return new Geometry(elements, this.meta);
        };
        /**
         *
         */
        Complex.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            // console.warn("Complex.mergeVertices not yet implemented");
        };
        return Complex;
    })();
    return Complex;
});
