var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/CartesianE3', '../geometries/computeFaceNormals', '../geometries/SimplexGeometry', '../geometries/quadrilateral', '../geometries/Simplex', '../core/Symbolic', '../math/R1', '../math/R3'], function (require, exports, CartesianE3, computeFaceNormals, SimplexGeometry, quad, Simplex, Symbolic, R1, R3) {
    /**
     * @class CuboidSimplexGeometry
     * @extends SimplexGeometry
     */
    var CuboidSimplexGeometry = (function (_super) {
        __extends(CuboidSimplexGeometry, _super);
        /**
         * <p>
         * The <code>CuboidSimplexGeometry</code> generates simplices representing a cuboid, or more precisely a parallelepiped.
         * The parallelepiped is parameterized by the three vectors <b>a</b>, <b>b</b>, and <b>c</b>.
         * The property <code>k</code> represents the dimensionality of the vertices.
         * The default settings create a unit cube centered at the origin.
         * </p>
         * @class CuboidSimplexGeometry
         * @constructor
         * @param a [VectorE3 = CartesianE3.e1]
         * @param b [VectorE3 = CartesianE3.e2]
         * @param c [VectorE3 = CartesianE3.e3]
         * @param k [number = Simplex.TRIANGLE]
         * @param subdivide [number = 0]
         * @param boundary [number = 0]
         * @example
             var geometry = new EIGHT.CuboidSimplexGeometry();
             var primitive = geometry.toDrawPrimitive();
             var material = new EIGHT.MeshMaterial();
             var cube = new EIGHT.Drawable([primitive], material);
         */
        function CuboidSimplexGeometry(a, b, c, k, subdivide, boundary) {
            if (a === void 0) { a = CartesianE3.e1; }
            if (b === void 0) { b = CartesianE3.e2; }
            if (c === void 0) { c = CartesianE3.e3; }
            if (k === void 0) { k = Simplex.TRIANGLE; }
            if (subdivide === void 0) { subdivide = 0; }
            if (boundary === void 0) { boundary = 0; }
            _super.call(this);
            /**
             * Used to mark the parameters of this object dirty when they are possibly shared.
             * @property _isModified
             * @type {boolean}
             * @private
             */
            this._isModified = true;
            this._a = CartesianE3.fromVectorE3(a);
            this._b = CartesianE3.fromVectorE3(b);
            this._c = CartesianE3.fromVectorE3(c);
            this.k = k;
            this.subdivide(subdivide);
            this.boundary(boundary);
            this.regenerate();
        }
        Object.defineProperty(CuboidSimplexGeometry.prototype, "a", {
            /**
             * <p>
             * A vector parameterizing the shape of the cuboid.
             * Defaults to the standard basis vector e1.
             * Assignment is by reference making it possible for parameters to be shared references.
             * </p>
             * @property a
             * @type {CartesianE3}
             */
            get: function () {
                return this._a;
            },
            set: function (a) {
                this._a = a;
                this._isModified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidSimplexGeometry.prototype, "b", {
            /**
             * <p>
             * A vector parameterizing the shape of the cuboid.
             * Defaults to the standard basis vector e2.
             * Assignment is by reference making it possible for parameters to be shared references.
             * </p>
             * @property b
             * @type {CartesianE3}
             */
            get: function () {
                return this._b;
            },
            set: function (b) {
                this._b = b;
                this._isModified = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidSimplexGeometry.prototype, "c", {
            /**
             * <p>
             * A vector parameterizing the shape of the cuboid.
             * Defaults to the standard basis vector e3.
             * Assignment is by reference making it possible for parameters to be shared references.
             * </p>
             * @property c
             * @type {CartesianE3}
             */
            get: function () {
                return this._c;
            },
            set: function (c) {
                this._c = c;
                this._isModified = true;
            },
            enumerable: true,
            configurable: true
        });
        CuboidSimplexGeometry.prototype.isModified = function () {
            return this._isModified || _super.prototype.isModified.call(this);
        };
        /**
         * @method setModified
         * @param modified {boolean} The value that the modification state will be set to.
         * @return {CuboidSimplexGeometry} `this` instance.
         */
        CuboidSimplexGeometry.prototype.setModified = function (modified) {
            this._isModified = modified;
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        /**
         * regenerate the geometry based upon the current parameters.
         * @method regenerate
         * @return {void}
         */
        CuboidSimplexGeometry.prototype.regenerate = function () {
            this.setModified(false);
            var pos = [0, 1, 2, 3, 4, 5, 6, 7].map(function (index) { return void 0; });
            pos[0] = new R3().sub(this._a).sub(this._b).add(this._c).divByScalar(2);
            pos[1] = new R3().add(this._a).sub(this._b).add(this._c).divByScalar(2);
            pos[2] = new R3().add(this._a).add(this._b).add(this._c).divByScalar(2);
            pos[3] = new R3().sub(this._a).add(this._b).add(this._c).divByScalar(2);
            pos[4] = new R3().copy(pos[3]).sub(this._c);
            pos[5] = new R3().copy(pos[2]).sub(this._c);
            pos[6] = new R3().copy(pos[1]).sub(this._c);
            pos[7] = new R3().copy(pos[0]).sub(this._c);
            function simplex(indices) {
                var simplex = new Simplex(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = pos[indices[i]];
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_GEOMETRY_INDEX] = new R1([i]);
                }
                return simplex;
            }
            switch (this.k) {
                case 0:
                    {
                        var points = [[0], [1], [2], [3], [4], [5], [6], [7]];
                        this.data = points.map(function (point) { return simplex(point); });
                    }
                    break;
                case 1:
                    {
                        var lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]];
                        this.data = lines.map(function (line) { return simplex(line); });
                    }
                    break;
                case 2:
                    {
                        var faces = [0, 1, 2, 3, 4, 5].map(function (index) { return void 0; });
                        faces[0] = quad(pos[0], pos[1], pos[2], pos[3]);
                        faces[1] = quad(pos[1], pos[6], pos[5], pos[2]);
                        faces[2] = quad(pos[7], pos[0], pos[3], pos[4]);
                        faces[3] = quad(pos[6], pos[7], pos[4], pos[5]);
                        faces[4] = quad(pos[3], pos[2], pos[5], pos[4]);
                        faces[5] = quad(pos[7], pos[6], pos[1], pos[0]);
                        this.data = faces.reduce(function (a, b) { return a.concat(b); }, []);
                        this.data.forEach(function (simplex) {
                            computeFaceNormals(simplex);
                        });
                    }
                    break;
                default: {
                }
            }
            // Compute the meta data.
            this.check();
        };
        return CuboidSimplexGeometry;
    })(SimplexGeometry);
    return CuboidSimplexGeometry;
});
