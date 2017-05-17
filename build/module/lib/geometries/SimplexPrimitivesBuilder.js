import * as tslib_1 from "tslib";
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeInteger } from '../checks/mustBeInteger';
import { PrimitivesBuilder } from '../geometries/PrimitivesBuilder';
import { Simplex } from '../geometries/Simplex';
import { SimplexMode } from '../geometries/SimplexMode';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { simplicesToPrimitive } from '../geometries/simplicesToPrimitive';
import { simplicesToGeometryMeta } from '../geometries/simplicesToGeometryMeta';
import { Vector1 } from '../math/Vector1';
import { Vector3 } from '../math/Vector3';
var SimplexPrimitivesBuilder = (function (_super) {
    tslib_1.__extends(SimplexPrimitivesBuilder, _super);
    function SimplexPrimitivesBuilder() {
        var _this = _super.call(this) || this;
        _this.data = [];
        _this._k = new Vector1([SimplexMode.TRIANGLE]);
        _this.curvedSegments = 16;
        _this.flatSegments = 1;
        _this.orientationColors = false;
        // Force regenerate, even if derived classes don't call setModified.
        _this._k.modified = true;
        return _this;
    }
    Object.defineProperty(SimplexPrimitivesBuilder.prototype, "k", {
        get: function () {
            return this._k.x;
        },
        set: function (k) {
            this._k.x = mustBeInteger('k', k);
        },
        enumerable: true,
        configurable: true
    });
    SimplexPrimitivesBuilder.prototype.regenerate = function () {
        throw new Error("`protected regenerate(): void` method should be implemented in derived class.");
    };
    /**
     *
     */
    SimplexPrimitivesBuilder.prototype.isModified = function () {
        return this._k.modified;
    };
    SimplexPrimitivesBuilder.prototype.setModified = function (modified) {
        mustBeBoolean('modified', modified);
        this._k.modified = modified;
        return this;
    };
    SimplexPrimitivesBuilder.prototype.boundary = function (times) {
        this.regenerate();
        this.data = Simplex.boundary(this.data, times);
        return this.check();
    };
    SimplexPrimitivesBuilder.prototype.check = function () {
        this.meta = simplicesToGeometryMeta(this.data);
        return this;
    };
    SimplexPrimitivesBuilder.prototype.subdivide = function (times) {
        this.regenerate();
        this.data = Simplex.subdivide(this.data, times);
        this.check();
        return this;
    };
    SimplexPrimitivesBuilder.prototype.toPrimitives = function () {
        this.regenerate();
        this.check();
        return [simplicesToPrimitive(this.data, this.meta)];
    };
    SimplexPrimitivesBuilder.prototype.mergeVertices = function () {
        // console.warn("SimplexPrimitivesBuilder.mergeVertices not yet implemented");
    };
    SimplexPrimitivesBuilder.prototype.triangle = function (positions, normals, uvs) {
        var simplex = new Simplex(SimplexMode.TRIANGLE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1];
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[2];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1];
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[2];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[1];
        simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[2];
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(1, 0, 0);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(0, 1, 0);
            simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(0, 0, 1);
        }
        return this.data.push(simplex);
    };
    SimplexPrimitivesBuilder.prototype.lineSegment = function (positions, normals, uvs) {
        var simplex = new Simplex(SimplexMode.LINE);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[1];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[1];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0];
        simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[1];
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(1, 0, 0);
            simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(0, 1, 0);
        }
        return this.data.push(simplex);
    };
    SimplexPrimitivesBuilder.prototype.point = function (positions, normals, uvs) {
        var simplex = new Simplex(SimplexMode.POINT);
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = positions[0];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normals[0];
        simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvs[0];
        if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] = Vector3.vector(1, 0, 0);
        }
        return this.data.push(simplex);
    };
    return SimplexPrimitivesBuilder;
}(PrimitivesBuilder));
export { SimplexPrimitivesBuilder };
