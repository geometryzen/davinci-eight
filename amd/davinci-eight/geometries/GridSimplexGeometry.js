var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/Simplex', '../geometries/SimplexGeometry', '../core/GraphicsProgramSymbols', '../math/R2', '../math/R3', '../checks/mustBeFunction', '../checks/mustBeInteger'], function (require, exports, Simplex_1, SimplexGeometry_1, GraphicsProgramSymbols_1, R2_1, R3_1, mustBeFunction_1, mustBeInteger_1) {
    var GridSimplexGeometry = (function (_super) {
        __extends(GridSimplexGeometry, _super);
        function GridSimplexGeometry(parametricFunction, uSegments, vSegments) {
            _super.call(this);
            mustBeFunction_1.default('parametricFunction', parametricFunction);
            mustBeInteger_1.default('uSegments', uSegments);
            mustBeInteger_1.default('vSegments', vSegments);
            var points = [];
            var i;
            var j;
            var sliceCount = uSegments + 1;
            for (i = 0; i <= vSegments; i++) {
                var v = i / vSegments;
                for (j = 0; j <= uSegments; j++) {
                    var u = j / uSegments;
                    var point = parametricFunction(u, v);
                    points.push(R3_1.default.copy(point));
                }
            }
            var a;
            var b;
            var c;
            var d;
            var uva;
            var uvb;
            var uvc;
            var uvd;
            for (i = 0; i < vSegments; i++) {
                for (j = 0; j < uSegments; j++) {
                    a = i * sliceCount + j;
                    b = i * sliceCount + j + 1;
                    c = (i + 1) * sliceCount + j + 1;
                    d = (i + 1) * sliceCount + j;
                    uva = new R2_1.default([j / uSegments, i / vSegments]);
                    uvb = new R2_1.default([(j + 1) / uSegments, i / vSegments]);
                    uvc = new R2_1.default([(j + 1) / uSegments, (i + 1) / vSegments]);
                    uvd = new R2_1.default([j / uSegments, (i + 1) / vSegments]);
                    var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
                    simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[a];
                    simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uva;
                    simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[b];
                    simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                    simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[d];
                    simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                    this.data.push(simplex);
                    var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
                    simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[b];
                    simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                    simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[c];
                    simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvc;
                    simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = points[d];
                    simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                    this.data.push(simplex);
                }
            }
        }
        return GridSimplexGeometry;
    })(SimplexGeometry_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridSimplexGeometry;
});
