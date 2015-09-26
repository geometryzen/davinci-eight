define(["require", "exports", '../dfx/toGeometryMeta', '../geometries/Geometry', '../dfx/Simplex', '../dfx/toGeometryData'], function (require, exports, toGeometryMeta, Geometry, Simplex, toGeometryData) {
    /**
     * @class Chain
     */
    var Chain = (function () {
        /**
         * A list of simplices (data) with information about dimensionality and vertex properties (meta).
         * @class Chain
         * @constructor
         */
        function Chain() {
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
         * @return {Chain}
         */
        Chain.prototype.boundary = function (times) {
            this.data = Simplex.boundary(this.data, times);
            return this.check();
        };
        /**
         * Updates the meta property of this instance to match the data.
         *
         * @method check
         * @return {Chain}
         */
        Chain.prototype.check = function () {
            this.meta = toGeometryMeta(this.data);
            return this;
        };
        /**
         * Applies the subdivide operation to each Simplex in this instance the specified number of times.
         *
         * @method subdivide
         * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
         * @return {Chain}
         */
        Chain.prototype.subdivide = function (times) {
            this.data = Simplex.subdivide(this.data, times);
            this.check();
            return this;
        };
        /**
         * @method toGeometry
         * @return {Geometry}
         */
        Chain.prototype.toGeometry = function () {
            var elements = toGeometryData(this.data, this.meta);
            return new Geometry(elements, this.meta);
        };
        /**
         *
         */
        Chain.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            // console.warn("Chain.mergeVertices not yet implemented");
        };
        return Chain;
    })();
    return Chain;
});
