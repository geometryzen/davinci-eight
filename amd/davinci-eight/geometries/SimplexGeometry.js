var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../math/Euclidean3', '../checks/mustBeBoolean', '../checks/mustBeInteger', '../geometries/PrimitivesBuilder', '../geometries/Simplex', '../core/GraphicsProgramSymbols', '../geometries/simplicesToDrawPrimitive', '../geometries/simplicesToGeometryMeta', '../math/R1', '../math/R3'], function (require, exports, Euclidean3_1, mustBeBoolean_1, mustBeInteger_1, PrimitivesBuilder_1, Simplex_1, GraphicsProgramSymbols_1, simplicesToDrawPrimitive_1, simplicesToGeometryMeta_1, R1_1, R3_1) {
    var SimplexGeometry = (function (_super) {
        __extends(SimplexGeometry, _super);
        function SimplexGeometry() {
            _super.call(this);
            this.data = [];
            this._k = new R1_1.default([Simplex_1.default.TRIANGLE]);
            this.curvedSegments = 16;
            this.flatSegments = 1;
            this.orientationColors = false;
            this._k.modified = true;
        }
        Object.defineProperty(SimplexGeometry.prototype, "k", {
            get: function () {
                return this._k.x;
            },
            set: function (k) {
                this._k.x = mustBeInteger_1.default('k', k);
            },
            enumerable: true,
            configurable: true
        });
        SimplexGeometry.prototype.regenerate = function () {
            console.warn("`public regenerate(): void` method should be implemented in derived class.");
        };
        SimplexGeometry.prototype.isModified = function () {
            return this._k.modified;
        };
        SimplexGeometry.prototype.setModified = function (modified) {
            mustBeBoolean_1.default('modified', modified);
            this._k.modified = modified;
            return this;
        };
        SimplexGeometry.prototype.boundary = function (times) {
            if (this.isModified()) {
                this.regenerate();
            }
            this.data = Simplex_1.default.boundary(this.data, times);
            return this.check();
        };
        SimplexGeometry.prototype.check = function () {
            this.meta = simplicesToGeometryMeta_1.default(this.data);
            return this;
        };
        SimplexGeometry.prototype.subdivide = function (times) {
            if (this.isModified()) {
                this.regenerate();
            }
            this.data = Simplex_1.default.subdivide(this.data, times);
            this.check();
            return this;
        };
        SimplexGeometry.prototype.setPosition = function (position) {
            _super.prototype.setPosition.call(this, position);
            return this;
        };
        SimplexGeometry.prototype.toPrimitives = function () {
            if (this.isModified()) {
                this.regenerate();
            }
            this.check();
            return [simplicesToDrawPrimitive_1.default(this.data, this.meta)];
        };
        SimplexGeometry.prototype.mergeVertices = function (precisionPoints) {
            if (precisionPoints === void 0) { precisionPoints = 4; }
        };
        SimplexGeometry.prototype.triangle = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[1];
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[2];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[1];
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[2];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[2];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e1);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e2);
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e3);
            }
            return this.data.push(simplex);
        };
        SimplexGeometry.prototype.lineSegment = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(Simplex_1.default.LINE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[1];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[1];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e1);
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e2);
            }
            return this.data.push(simplex);
        };
        SimplexGeometry.prototype.point = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(Simplex_1.default.POINT);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
            if (this.orientationColors) {
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = R3_1.default.copy(Euclidean3_1.default.e1);
            }
            return this.data.push(simplex);
        };
        SimplexGeometry.prototype.empty = function (positions, normals, uvs) {
            var simplex = new Simplex_1.default(Simplex_1.default.EMPTY);
            return this.data.push(simplex);
        };
        SimplexGeometry.prototype.enableTextureCoords = function (enable) {
            _super.prototype.enableTextureCoords.call(this, enable);
            return this;
        };
        return SimplexGeometry;
    })(PrimitivesBuilder_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimplexGeometry;
});
