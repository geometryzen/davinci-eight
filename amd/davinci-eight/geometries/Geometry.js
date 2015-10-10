var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/GeometryElements', '../checks/mustBeString', '../utils/Shareable', '../geometries/Simplex', '../geometries/toGeometryData', '../geometries/toGeometryMeta'], function (require, exports, GeometryElements, mustBeString, Shareable, Simplex, toGeometryData, toGeometryMeta) {
    /**
     * @class Geometry
     * @extends Shareable
     */
    var Geometry = (function (_super) {
        __extends(Geometry, _super);
        // public dynamic = true;
        // public verticesNeedUpdate = false;
        // public elementsNeedUpdate = false;
        // public uvsNeedUpdate = false;
        /**
         * <p>
         * A list of simplices (data) with information about dimensionality and vertex properties (meta).
         * This class should be used as an abstract base or concrete class when constructing
         * geometries that are to be manipulated in JavaScript (as opposed to GLSL shaders).
         * The <code>Geometry</code> class implements IUnknown, as a convenience to implementations
         * requiring special de-allocation of resources, by extending <code>Shareable</code>.
         * </p>
         * @class Geometry
         * @constructor
         * @param type [string = 'Geometry']
         */
        function Geometry(type) {
            if (type === void 0) { type = 'Geometry'; }
            _super.call(this, mustBeString('type', type));
            /**
             * @property data
             * @type {Simplex[]}
             */
            this.data = [];
        }
        /**
         * The destructor method should be implemented in derived classes and the super.destructor called
         * as the last call in the derived class destructor.
         * @method destructor
         * @return {void}
         * @protected
         */
        Geometry.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        Geometry.prototype.recalculate = function () {
            console.warn("`public recalculate(): void` method should be implemented by `" + this._type + "`.");
        };
        Geometry.prototype.isModified = function () {
            // Assume that the Geometry parameters have been modified as the default.
            // Derived classes can be more efficient.
            return true;
        };
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
            if (this.isModified()) {
                this.recalculate();
            }
            this.data = Simplex.boundary(this.data, times);
            return this.check();
        };
        /**
         * Updates the meta property of this instance to match the data.
         *
         * @method check
         * @return {Geometry}
         */
        // FIXME: Rename to something more suggestive.
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
            if (this.isModified()) {
                this.recalculate();
            }
            this.data = Simplex.subdivide(this.data, times);
            this.check();
            return this;
        };
        /**
         * @method toGeometry
         * @return {GeometryElements}
         */
        Geometry.prototype.toElements = function () {
            if (this.isModified()) {
                this.recalculate();
            }
            this.check();
            var elements = toGeometryData(this.data, this.meta);
            return new GeometryElements(elements, this.meta);
        };
        /**
         *
         */
        Geometry.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            // console.warn("Geometry.mergeVertices not yet implemented");
        };
        return Geometry;
    })(Shareable);
    return Geometry;
});
