"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridSimplexBuilder = void 0;
var tslib_1 = require("tslib");
var Simplex_1 = require("./Simplex");
var SimplexMode_1 = require("./SimplexMode");
var SimplexPrimitivesBuilder_1 = require("./SimplexPrimitivesBuilder");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var Vector2_1 = require("../math/Vector2");
var Vector3_1 = require("../math/Vector3");
var mustBeFunction_1 = require("../checks/mustBeFunction");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var GridSimplexBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(GridSimplexBuilder, _super);
    function GridSimplexBuilder(parametricFunction, uSegments, vSegments) {
        var _this = _super.call(this) || this;
        mustBeFunction_1.mustBeFunction('parametricFunction', parametricFunction);
        mustBeInteger_1.mustBeInteger('uSegments', uSegments);
        mustBeInteger_1.mustBeInteger('vSegments', vSegments);
        /**
         * Temporary array of points.
         */
        var points = [];
        var sliceCount = uSegments + 1;
        for (var i = 0; i <= vSegments; i++) {
            var v = i / vSegments;
            for (var j = 0; j <= uSegments; j++) {
                var u = j / uSegments;
                var point = parametricFunction(u, v);
                // Make a copy just in case the function is returning mutable references.
                points.push(Vector3_1.Vector3.copy(point));
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
        for (var i = 0; i < vSegments; i++) {
            for (var j = 0; j < uSegments; j++) {
                a = i * sliceCount + j;
                b = i * sliceCount + j + 1;
                c = (i + 1) * sliceCount + j + 1;
                d = (i + 1) * sliceCount + j;
                uva = new Vector2_1.Vector2([j / uSegments, i / vSegments]);
                uvb = new Vector2_1.Vector2([(j + 1) / uSegments, i / vSegments]);
                uvc = new Vector2_1.Vector2([(j + 1) / uSegments, (i + 1) / vSegments]);
                uvd = new Vector2_1.Vector2([j / uSegments, (i + 1) / vSegments]);
                var simplex = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.TRIANGLE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[a];
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uva;
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[b];
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvb;
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[d];
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvd;
                _this.data.push(simplex);
                simplex = new Simplex_1.Simplex(SimplexMode_1.SimplexMode.TRIANGLE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[b];
                simplex.vertices[0].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvb;
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[c];
                simplex.vertices[1].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvc;
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[d];
                simplex.vertices[2].attributes[GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvd;
                _this.data.push(simplex);
            }
        }
        return _this;
        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    }
    return GridSimplexBuilder;
}(SimplexPrimitivesBuilder_1.SimplexPrimitivesBuilder));
exports.GridSimplexBuilder = GridSimplexBuilder;
