var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../topologies/GridTopology', '../geometries/PrimitivesBuilder', '../core/GraphicsProgramSymbols', '../checks/mustBeNumber', '../math/R3', '../math/R2'], function (require, exports, Euclidean3_1, GridTopology_1, PrimitivesBuilder_1, GraphicsProgramSymbols_1, mustBeNumber_1, R3_1, R2_1) {
    function side(basis, uSegments, vSegments) {
        var normal = R3_1.default.copy(basis[0]).cross(basis[1]).direction();
        var aNeg = R3_1.default.copy(basis[0]).scale(-0.5);
        var aPos = R3_1.default.copy(basis[0]).scale(+0.5);
        var bNeg = R3_1.default.copy(basis[1]).scale(-0.5);
        var bPos = R3_1.default.copy(basis[1]).scale(+0.5);
        var cPos = R3_1.default.copy(basis[2]).scale(+0.5);
        var side = new GridTopology_1.default(uSegments, vSegments);
        for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
            for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
                var u = uIndex / uSegments;
                var v = vIndex / vSegments;
                var a = R3_1.default.copy(aNeg).lerp(aPos, u);
                var b = R3_1.default.copy(bNeg).lerp(bPos, v);
                var vertex = side.vertex(uIndex, vIndex);
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = R3_1.default.copy(a).add(b).add(cPos);
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normal;
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new R2_1.default([u, v]);
            }
        }
        return side;
    }
    var CuboidGeometry = (function (_super) {
        __extends(CuboidGeometry, _super);
        function CuboidGeometry() {
            _super.call(this);
            this.iSegments = 1;
            this.jSegments = 1;
            this.kSegments = 1;
            this._a = R3_1.default.copy(Euclidean3_1.default.e1);
            this._b = R3_1.default.copy(Euclidean3_1.default.e2);
            this._c = R3_1.default.copy(Euclidean3_1.default.e3);
            this.sides = [];
        }
        Object.defineProperty(CuboidGeometry.prototype, "width", {
            get: function () {
                return this._a.magnitude();
            },
            set: function (width) {
                mustBeNumber_1.default('width', width);
                this._a.direction().scale(width);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidGeometry.prototype, "height", {
            get: function () {
                return this._b.magnitude();
            },
            set: function (height) {
                mustBeNumber_1.default('height', height);
                this._b.direction().scale(height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CuboidGeometry.prototype, "depth", {
            get: function () {
                return this._c.magnitude();
            },
            set: function (depth) {
                mustBeNumber_1.default('depth', depth);
                this._c.direction().scale(depth);
            },
            enumerable: true,
            configurable: true
        });
        CuboidGeometry.prototype.regenerate = function () {
            this.sides = [];
            this.sides.push(side([this._a, this._b, this._c], this.iSegments, this.jSegments));
            this.sides.push(side([R3_1.default.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments));
            this.sides.push(side([this._c, this._b, R3_1.default.copy(this._a).scale(-1)], this.kSegments, this.jSegments));
            this.sides.push(side([R3_1.default.copy(this._a).scale(-1), this._b, R3_1.default.copy(this._c).scale(-1)], this.iSegments, this.jSegments));
            this.sides.push(side([this._a, R3_1.default.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments));
            this.sides.push(side([this._a, this._c, R3_1.default.copy(this._b).scale(-1)], this.iSegments, this.kSegments));
        };
        CuboidGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        CuboidGeometry.prototype.toPrimitives = function () {
            this.regenerate();
            return this.sides.map(function (side) { return side.toDrawPrimitive(); });
        };
        CuboidGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return CuboidGeometry;
    })(PrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CuboidGeometry;
});
