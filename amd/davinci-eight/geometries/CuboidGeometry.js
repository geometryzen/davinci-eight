var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/computeFaceNormals', '../geometries/Geometry', '../checks/mustBeInteger', '../checks/mustBeString', '../geometries/quadrilateral', '../geometries/Simplex', '../core/Symbolic', '../math/Vector1', '../math/Vector3'], function (require, exports, computeFaceNormals, Geometry, mustBeInteger, mustBeString, quad, Simplex, Symbolic, Vector1, Vector3) {
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
         * @param type [string = 'CuboidGeometry']
         * @example
             var geometry = new EIGHT.CuboidGeometry();
             var elements = geometry.toElements();
             var material = new EIGHT.LineMaterial();
             var cube = new EIGHT.Drawable(elements, material);
         */
        function CuboidGeometry(type) {
            if (type === void 0) { type = 'CuboidGeometry'; }
            _super.call(this, mustBeString('type', type));
            /**
             * @property a {Vector3} A vector parameterizing the shape of the cuboid. Defaults to the standard basis vector e1.
             */
            this.a = Vector3.e1.clone();
            /**
             * @property b {Vector3} A vector parameterizing the shape of the cuboid. Defaults to the standard basis vector e2.
             */
            this.b = Vector3.e2.clone();
            /**
             * @property c {Vector3} A vector parameterizing the shape of the cuboid. Defaults to the standard basis vector e3.
             */
            this.c = Vector3.e3.clone();
            /**
             * @property _k {number} The dimensionality of the simplices representing the cuboid.
             * @private
             */
            this._k = new Vector1([Simplex.K_FOR_TRIANGLE]);
            this.recalculate();
        }
        Object.defineProperty(CuboidGeometry.prototype, "k", {
            /**
             *
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
        CuboidGeometry.prototype.isModified = function () {
            return this.a.modified || this.b.modified || this.c.modified || this._k.modified;
        };
        /**
         * @method setModified
         * @param modified {boolean} The value that the modification state will be set to.
         * @return {CuboidGeometry} `this` instance.
         */
        CuboidGeometry.prototype.setModified = function (modified) {
            this.a.modified = modified;
            this.b.modified = modified;
            this.c.modified = modified;
            this._k.modified = modified;
            return this;
        };
        /**
         * recalculate the geometry based upon the current parameters.
         * @method recalculate
         * @return {void}
         */
        CuboidGeometry.prototype.recalculate = function () {
            this.setModified(false);
            var pos = [0, 1, 2, 3, 4, 5, 6, 7].map(function (index) { return void 0; });
            pos[0] = new Vector3().sub(this.a).sub(this.b).add(this.c).divideScalar(2);
            pos[1] = new Vector3().add(this.a).sub(this.b).add(this.c).divideScalar(2);
            pos[2] = new Vector3().add(this.a).add(this.b).add(this.c).divideScalar(2);
            pos[3] = new Vector3().sub(this.a).add(this.b).add(this.c).divideScalar(2);
            pos[4] = new Vector3().copy(pos[3]).sub(this.c);
            pos[5] = new Vector3().copy(pos[2]).sub(this.c);
            pos[6] = new Vector3().copy(pos[1]).sub(this.c);
            pos[7] = new Vector3().copy(pos[0]).sub(this.c);
            function simplex(indices) {
                var simplex = new Simplex(indices.length - 1);
                for (var i = 0; i < indices.length; i++) {
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = pos[indices[i]];
                    simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_GEOMETRY_INDEX] = new Vector1([i]);
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
