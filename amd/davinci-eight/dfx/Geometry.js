define(["require", "exports", '../dfx/toGeometryMeta', '../geometries/SerialGeometry', '../dfx/Simplex', '../dfx/toSerialGeometryElements'], function (require, exports, toGeometryMeta, SerialGeometry, Simplex, toSerialGeometryElements) {
    /**
     * @class Geometry
     */
    var Geometry = (function () {
        /**
         * A list of simplices (data) with information about dimensionality and vertex properties (meta).
         * @class Geometry
         * @constructor
         */
        function Geometry() {
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
         * @return {Geometry}
         */
        Geometry.prototype.boundary = function (times) {
            this.data = Simplex.boundary(this.data, times);
            return this.check();
        };
        /**
         * Updates the meta property of this instance to match the data.
         *
         * @method check
         * @return {Geometry}
         */
        Geometry.prototype.check = function () {
            this.meta = toGeometryMeta(this.data);
            return this;
        };
        /**
         * Applies the subdivide operation to each Simplex in this instance the specified number of times.
         *
         * @method subdivide
         * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
         * @return {Geometry}
         */
        Geometry.prototype.subdivide = function (times) {
            this.data = Simplex.subdivide(this.data, times);
            this.check();
            return this;
        };
        /**
         * @method toGeometry
         * @return {SerialGeometry}
         */
        Geometry.prototype.toSerialGeometry = function () {
            var elements = toSerialGeometryElements(this.data, this.meta);
            return new SerialGeometry(elements, this.meta);
        };
        /**
         *
         */
        Geometry.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            // console.warn("Geometry.mergeVertices not yet implemented");
        };
        return Geometry;
    })();
    return Geometry;
});
