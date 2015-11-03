var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../checks/mustBeInteger', '../geometries/Geometry', '../geometries/Simplex', '../core/Symbolic', '../geometries/simplicesToDrawPrimitive', '../geometries/simplicesToGeometryMeta', '../math/R1', '../math/R3'], function (require, exports, Euclidean3, mustBeInteger, Geometry, Simplex, Symbolic, simplicesToDrawPrimitive, simplicesToGeometryMeta, R1, R3) {
    /**
     * @class SimplexGeometry
     * @extends Geometry
     */
    var SimplexGeometry = (function (_super) {
        __extends(SimplexGeometry, _super);
        /**
         * <p>
         * A list of simplices (data) with information about dimensionality and vertex properties (meta).
         * This class should be used as an abstract base or concrete class when constructing
         * geometries that are to be manipulated in JavaScript (as opposed to GLSL shaders).
         * </p>
         * @class SimplexGeometry
         * @constructor
         */
        function SimplexGeometry() {
            _super.call(this);
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
            this._k = new R1([Simplex.TRIANGLE]);
            /**
             * Specifies the number of segments to use in curved directions.
             * @property curvedSegments
             * @type {number}
             * @beta
             */
            this.curvedSegments = 16;
            /**
             * Specifies the number of segments to use on flat surfaces.
             * @property flatSegments
             * @type {number}
             * @beta
             */
            this.flatSegments = 1;
            /**
             * <p>
             * Specifies that the geometry should set colors on vertex attributes
             * for visualizing orientation of triangles
             * </p>
             * @property orientationColors
             * @type {boolean}
             * @beta
             */
            this.orientationColors = false;
            // Force regenerate, even if derived classes don't call setModified.
            this._k.modified = true;
        }
        Object.defineProperty(SimplexGeometry.prototype, "k", {
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
        SimplexGeometry.prototype.regenerate = function () {
            console.warn("`public regenerate(): void` method should be implemented in derived class.");
        };
        /**
         * Used to determine whether the geometry must be recalculated.
         * The base implementation is pessimistic and returns <code>true</code>.
         * This method should be implemented by the derived class to reduce frequent recalculation.
         * @method isModified
         * @return {boolean} if the parameters defining the geometry have been modified.
         */
        SimplexGeometry.prototype.isModified = function () {
            return this._k.modified;
        };
        /**
         * Sets the modification state of <code>this</code> instance.
         * Derived classes should override this method if they contain parameters which affect geometry calculation.
         * @method setModified
         * @param modified {boolean} The value that the modification state will be set to.
         * @return {SimplexGeometry} `this` instance.
         * @chainable
         */
        SimplexGeometry.prototype.setModified = function (modified) {
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
         * @return {SimplexGeometry}
         */
        SimplexGeometry.prototype.boundary = function (times) {
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
         * @return {SimplexGeometry}
         * @beta
         */
        // FIXME: Rename to something more suggestive.
        SimplexGeometry.prototype.check = function () {
            this.meta = simplicesToGeometryMeta(this.data);
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
         * @return {SimplexGeometry}
         */
        SimplexGeometry.prototype.subdivide = function (times) {
            if (this.isModified()) {
                this.regenerate();
            }
            this.data = Simplex.subdivide(this.data, times);
            this.check();
            return this;
        };
        /**
         * @method setPosition
         * @param position {{x: number; y: number; z: number}}
         * @return {SimplexGeometry}
         * @chainable
         */
        SimplexGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        SimplexGeometry.prototype.toPrimitives = function () {
            if (this.isModified()) {
                this.regenerate();
            }
            this.check();
            return [simplicesToDrawPrimitive(this.data, this.meta)];
        };
        /**
         * @method mergeVertices
         * @param precisionPonts [number = 4]
         * @return {void}
         * @protected
         * @beta
         */
        SimplexGeometry.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
            // console.warn("SimplexGeometry.mergeVertices not yet implemented");
        };
        /**
         * Convenience method for pushing attribute data as a triangular simplex
         * @method triangle
         * @param positions {R3[]}
         * @param normals {R3[]}
         * @param uvs {R2[]}
         * @return {number}
         * @beta
         */
        SimplexGeometry.prototype.triangle = function (positions, normals, uvs) {
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
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e1);
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e2);
                simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e3);
            }
            return this.data.push(simplex);
        };
        SimplexGeometry.prototype.lineSegment = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.LINE);
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[1];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[1];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e1);
                simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e2);
            }
            return this.data.push(simplex);
        };
        SimplexGeometry.prototype.point = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.POINT);
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_COLOR] = R3.copy(Euclidean3.e1);
            }
            return this.data.push(simplex);
        };
        SimplexGeometry.prototype.empty = function (positions, normals, uvs) {
            var simplex = new Simplex(Simplex.EMPTY);
            return this.data.push(simplex);
        };
        SimplexGeometry.prototype.enableTextureCoords = function (enable) {
            //        mustBeBoolean('enable', enable)
            //        this.useTextureCoords = enable
            return this;
        };
        return SimplexGeometry;
    })(Geometry);
    return SimplexGeometry;
});
