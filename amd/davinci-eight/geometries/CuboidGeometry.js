var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../i18n/cannotAssignTypeToProperty', '../geometries/computeFaceNormals', '../feedback/feedback', '../geometries/Geometry', '../geometries/quadrilateral', '../geometries/Simplex', '../core/Symbolic', '../math/MutableNumber', '../math/Vector3'], function (require, exports, cannotAssignTypeToProperty, computeFaceNormals, feedback, Geometry, quad, Simplex, Symbolic, MutableNumber, Vector3) {
    /**
     * @class CuboidGeometry
     * @extends Geometry
     */
    var CuboidGeometry = (function (_super) {
        __extends(CuboidGeometry, _super);
        /**
         * <p>
         * The <code>CuboidGeometry</code> generates simplices representing a cuboid, or more precisely a parallelepiped.
         * The parallelepiped is parameterized by the three vectors <b>a</b>, <b>b</b>, and <b>c</b>.
         * The property <code>k</code> represents the dimensionality of the vertices.
         * The default settings create a unit cube centered at the origin.
         * </p>
         * @class CuboidGeometry
         * @constructor
         * @param a [Cartesian3 = Vector3.e1]
         * @param b [Cartesian3 = Vector3.e1]
         * @param c [Cartesian3 = Vector3.e1]
         * @param k [number = Simplex.K_FOR_TRIANGLE]
         * @param subdivide [number = 0]
         * @param boundary [number = 0]
         * @example
             var geometry = new EIGHT.CuboidGeometry();
             var elements = geometry.toElements();
             var material = new EIGHT.LineMaterial();
             var cube = new EIGHT.Drawable(elements, material);
         */
        function CuboidGeometry(a, b, c, k, subdivide, boundary) {
            if (a === void 0) { a = Vector3.e1; }
            if (b === void 0) { b = Vector3.e2; }
            if (c === void 0) { c = Vector3.e3; }
            if (k === void 0) { k = Simplex.K_FOR_TRIANGLE; }
            if (subdivide === void 0) { subdivide = 0; }
            if (boundary === void 0) { boundary = 0; }
            _super.call(this, 'CuboidGeometry');
            /**
             * Used to mark the parameters of this object dirty when they are possibly shared.
             * @property _isModified
             * @type {boolean}
             * @private
             */
            this._isModified = true;
            this.a = Vector3.copy(a);
            this.b = Vector3.copy(b);
            this.c = Vector3.copy(c);
            this.k = k;
            this.subdivide(subdivide);
            this.boundary(boundary);
            this.regenerate();
        }
        CuboidGeometry.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        Object.defineProperty(CuboidGeometry.prototype, "a", {
            /**
             * <p>
             * A vector parameterizing the shape of the cuboid.
             * Defaults to the standard basis vector e1.
             * Assignment is by reference making it possible for parameters to be shared references.
             * </p>
             * @property a
             * @type {Vector3}
             */
            get: function () {
                return this._a;
            },
            set: function (a) {
                if (a instanceof Vector3) {
                    this._a = a;
                    this._isModified = true;
                }
                else {
                    feedback.warn(cannotAssignTypeToProperty(typeof a, 'a'));
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidGeometry.prototype, "b", {
            /**
             * <p>
             * A vector parameterizing the shape of the cuboid.
             * Defaults to the standard basis vector e2.
             * Assignment is by reference making it possible for parameters to be shared references.
             * </p>
             * @property b
             * @type {Vector3}
             */
            get: function () {
                return this._b;
            },
            set: function (b) {
                if (b instanceof Vector3) {
                    this._b = b;
                    this._isModified = true;
                }
                else {
                    feedback.warn(cannotAssignTypeToProperty(typeof b, 'b'));
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidGeometry.prototype, "c", {
            /**
             * <p>
             * A vector parameterizing the shape of the cuboid.
             * Defaults to the standard basis vector e3.
             * Assignment is by reference making it possible for parameters to be shared references.
             * </p>
             * @property c
             * @type {Vector3}
             */
            get: function () {
                return this._c;
            },
            set: function (c) {
                if (c instanceof Vector3) {
                    this._c = c;
                    this._isModified = true;
                }
                else {
                    feedback.warn(cannotAssignTypeToProperty(typeof c, 'c'));
                }
            },
            enumerable: true,
            configurable: true
        });
        CuboidGeometry.prototype.isModified = function () {
            return this._isModified || this._a.modified || this._b.modified || this._c.modified || _super.prototype.isModified.call(this);
        };
        /**
         * @method setModified
         * @param modified {boolean} The value that the modification state will be set to.
         * @return {CuboidGeometry} `this` instance.
         */
        CuboidGeometry.prototype.setModified = function (modified) {
            this._isModified = modified;
            this._a.modified = modified;
            this._b.modified = modified;
            this._c.modified = modified;
            _super.prototype.setModified.call(this, modified);
            return this;
        };
        /**
         * regenerate the geometry based upon the current parameters.
         * @method regenerate
         * @return {void}
         */
        CuboidGeometry.prototype.regenerate = function () {
            this.setModified(false);
            var pos = [0, 1, 2, 3, 4, 5, 6, 7].map(function (index) { return void 0; });
            pos[0] = new Vector3().sub(this._a).sub(this._b).add(this._c).divideScalar(2);
            pos[1] = new Vector3().add(this._a).sub(this._b).add(this._c).divideScalar(2);
            pos[2] = new Vector3().add(this._a).add(this._b).add(this._c).divideScalar(2);
            pos[3] = new Vector3().sub(this._a).add(this._b).add(this._c).divideScalar(2);
            pos[4] = new Vector3().copy(pos[3]).sub(this._c);
            pos[5] = new Vector3().copy(pos[2]).sub(this._c);
            pos[6] = new Vector3().copy(pos[1]).sub(this._c);
            pos[7] = new Vector3().copy(pos[0]).sub(this._c);
            function simplex(indices) {
                var simplex = new Simplex(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = pos[indices[i]];
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_GEOMETRY_INDEX] = new MutableNumber([i]);
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
        return CuboidGeometry;
    })(Geometry);
    return CuboidGeometry;
});
