var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../topologies/GridTopology', '../geometries/Geometry', '../checks/mustBeNumber', '../math/R3', '../core/GraphicsProgramSymbols', '../math/R2'], function (require, exports, Euclidean3, GridTopology, Geometry, mustBeNumber, R3, GraphicsProgramSymbols, R2) {
    function side(basis, uSegments, vSegments) {
        var normal = R3.copy(basis[0]).cross(basis[1]).direction();
        var aNeg = R3.copy(basis[0]).scale(-0.5);
        var aPos = R3.copy(basis[0]).scale(+0.5);
        var bNeg = R3.copy(basis[1]).scale(-0.5);
        var bPos = R3.copy(basis[1]).scale(+0.5);
        var cPos = R3.copy(basis[2]).scale(+0.5);
        var side = new GridTopology(uSegments, vSegments);
        for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
            for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
                var u = uIndex / uSegments;
                var v = vIndex / vSegments;
                var a = R3.copy(aNeg).lerp(aPos, u);
                var b = R3.copy(bNeg).lerp(bPos, v);
                var vertex = side.vertex(uIndex, vIndex);
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = R3.copy(a).add(b).add(cPos);
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal;
                vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = new R2([u, v]);
            }
        }
        return side;
    }
    /**
     * @class CuboidGeometry
     */
    var CuboidGeometry = (function (_super) {
        __extends(CuboidGeometry, _super);
        /**
         * @class CuboidGeometry
         * @constructor
         */
        function CuboidGeometry() {
            _super.call(this);
            this.iSegments = 1;
            this.jSegments = 1;
            this.kSegments = 1;
            this._a = R3.copy(Euclidean3.e1);
            this._b = R3.copy(Euclidean3.e2);
            this._c = R3.copy(Euclidean3.e3);
            this.sides = [];
        }
        Object.defineProperty(CuboidGeometry.prototype, "width", {
            /**
             * @property width
             * @type {number}
             */
            get: function () {
                return this._a.magnitude();
            },
            set: function (width) {
                mustBeNumber('width', width);
                this._a.direction().scale(width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidGeometry.prototype, "height", {
            /**
             * @property height
             * @type {number}
             */
            get: function () {
                return this._b.magnitude();
            },
            set: function (height) {
                mustBeNumber('height', height);
                this._b.direction().scale(height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidGeometry.prototype, "depth", {
            /**
             * @property depth
             * @type {number}
             */
            get: function () {
                return this._c.magnitude();
            },
            set: function (depth) {
                mustBeNumber('depth', depth);
                this._c.direction().scale(depth);
            },
            enumerable: true,
            configurable: true
        });
        CuboidGeometry.prototype.regenerate = function () {
            this.sides = [];
            // front
            this.sides.push(side([this._a, this._b, this._c], this.iSegments, this.jSegments));
            // right
            this.sides.push(side([R3.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments));
            // left
            this.sides.push(side([this._c, this._b, R3.copy(this._a).scale(-1)], this.kSegments, this.jSegments));
            // back
            this.sides.push(side([R3.copy(this._a).scale(-1), this._b, R3.copy(this._c).scale(-1)], this.iSegments, this.jSegments));
            // top
            this.sides.push(side([this._a, R3.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments));
            // bottom
            this.sides.push(side([this._a, this._c, R3.copy(this._b).scale(-1)], this.iSegments, this.kSegments));
        };
        /**
         * @method setPosition
         * @param position {VectorE3}
         * @return {CuboidGeometry}
         */
        CuboidGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        /**
         * @method toPrimitives
         * @return {DrawPrimitive[]}
         */
        CuboidGeometry.prototype.toPrimitives = function () {
            this.regenerate();
            return this.sides.map(function (side) { return side.toDrawPrimitive(); });
        };
        CuboidGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return CuboidGeometry;
    })(Geometry);
    return CuboidGeometry;
});
