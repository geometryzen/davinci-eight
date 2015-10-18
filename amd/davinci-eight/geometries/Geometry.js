var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeInteger', '../checks/mustBeString', '../utils/Shareable', '../geometries/Simplex', '../core/Symbolic', '../geometries/toGeometryData', '../geometries/toGeometryMeta', '../math/MutableNumber', '../math/Vector3'], function (require, exports, mustBeInteger, mustBeString, Shareable, Simplex, Symbolic, toGeometryData, toGeometryMeta, MutableNumber, Vector3) {
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
             * The geometry as a list of simplices.
             * A simplex, in the context of WebGL, will usually represent a triangle, line or point.
             * @property data
             * @type {Simplex[]}
             */
            this.data = [];
            /**
             * The dimensionality of the simplices in this geometry.
             * @property _k
             * @type {number}
             * @private
             */
            this._k = new MutableNumber([Simplex.TRIANGLE]);
            /**
             * Specifies the number of segments to use in curved directions.
             * @property curvedSegments
             * @type {number}
             */
            this.curvedSegments = 16;
            /**
             * Specifies the number of segments to use on flat surfaces.
             * @property flatSegments
             * @type {number}
             */
            this.flatSegments = 1;
            /**
             * <p>
             * Specifies that the geometry should set colors on vertex attributes
             * for visualizing orientation of triangles
             * </p>
             * @property orientationColors
             * @type {boolean}
             */
            this.orientationColors = false;
            // Force regenerate, even if derived classes don't call setModified.
            this._k.modified = true;
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
        Object.defineProperty(Geometry.prototype, "k", {
            /**
             * <p>
             * The dimensionality of the simplices in this geometry.
             * </p>
             * <p>
             * The <code>k</code> parameter affects geometry generation.
             * </p>
             * <code>k</code> must be an integer.
             * @property k
             * @type {number}
             */
            get: function () {
                return this._k.x;
            },
            set: function (k) {
                this._k.x = mustBeInteger('k', k);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Used to regenerate the simplex data from geometry parameters.
         * This method should be implemented by the derived geometry class.
         * @method regenerate
         * @return {void}
         */
        Geometry.prototype.regenerate = function () {
            console.warn("`public regenerate(): void` method should be implemented by `" + this._type + "`.");
        };
        /**
         * Used to determine whether the geometry must be recalculated.
         * The base implementation is pessimistic and returns <code>true</code>.
         * This method should be implemented by the derived class to reduce frequent recalculation.
         * @method isModified
         * @return {boolean} if the parameters defining the geometry have been modified.
         */
        Geometry.prototype.isModified = function () {
            return this._k.modified;
        };
        /**
         * Sets the modification state of <code>this</code> instance.
         * Derived classes should override this method if they contain parameters which affect geometry calculation.
         * @method setModified
         * @param modified {boolean} The value that the modification state will be set to.
         * @return {Geometry} `this` instance.
         * @chainable
         */
        Geometry.prototype.setModified = function (modified) {
            this._k.modified = modified;
            return this;
        };
        /**
         * <p>
         * Applies the <em>boundary</em> operation to each Simplex in this instance the specified number of times.
         * </p>
         * <p>
         * The boundary operation converts simplices of dimension `n` to `n - 1`.
         * For example, triangles are converted to lines.
         * </p>
         *
         * @method boundary
         * @param times {number} Determines the number of times the boundary operation is applied to this instance.
         * @return {Geometry}
         */
        Geometry.prototype.boundary = function (times) {
            if (this.isModified()) {
                this.regenerate();
            }
            this.data = Simplex.boundary(this.data, times);
            return this.check();
        };
        /**
         * Updates the meta property of this instance to match the data.
         *
         * @method check
         * @return {Geometry}
         * @beta
         */
        // FIXME: Rename to something more suggestive.
        Geometry.prototype.check = function () {
            this.meta = toGeometryMeta(this.data);
            return this;
        };
        /**
         * <p>
         * Applies the subdivide operation to each Simplex in this instance the specified number of times.
         * </p>
         * <p>
         * The subdivide operation creates new simplices of the same dimension as the originals.
         * </p>
         *
         * @method subdivide
         * @param times {number} Determines the number of times the subdivide operation is applied to this instance.
         * @return {Geometry}
         */
        Geometry.prototype.subdivide = function (times) {
            if (this.isModified()) {
                this.regenerate();
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
                this.regenerate();
            }
            this.check();
            return toGeometryData(this.data, this.meta);
        };
        /**
         * @method mergeVertices
         * @param precisionPonts [number = 4]
         * @return {void}
         * @protected
         * @beta
         */
        Geometry.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            // console.warn("Geometry.mergeVertices not yet implemented");
        };
        /**
         * Convenience method for pushing attribute data as a triangular simplex
         * @method triangle
         * @param positions {Vector3[]}
         * @param normals {Vector3[]}
         * @param uvs {Vector2[]}
         * @return {number}
         * @beta
         */
        Geometry.prototype.triangle = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.TRIANGLE);
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[1];
            simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[2];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[1];
            simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[2];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
            simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[2];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e1.clone();
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e2.clone();
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e3.clone();
            }
            return this.data.push(simplex);
        };
        Geometry.prototype.lineSegment = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.LINE);
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[1];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[1];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e1.clone();
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e2.clone();
            }
            return this.data.push(simplex);
        };
        Geometry.prototype.point = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.POINT);
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = Vector3.e1.clone();
            }
            return this.data.push(simplex);
        };
        Geometry.prototype.empty = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.EMPTY);
            return this.data.push(simplex);
        };
        return Geometry;
    })(Shareable);
    return Geometry;
});
