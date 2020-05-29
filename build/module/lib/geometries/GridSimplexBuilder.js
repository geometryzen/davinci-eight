import { __extends } from "tslib";
import { Simplex } from './Simplex';
import { SimplexMode } from './SimplexMode';
import { SimplexPrimitivesBuilder } from './SimplexPrimitivesBuilder';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { mustBeFunction } from '../checks/mustBeFunction';
import { mustBeInteger } from '../checks/mustBeInteger';
var GridSimplexBuilder = /** @class */ (function (_super) {
    __extends(GridSimplexBuilder, _super);
    function GridSimplexBuilder(parametricFunction, uSegments, vSegments) {
        var _this = _super.call(this) || this;
        mustBeFunction('parametricFunction', parametricFunction);
        mustBeInteger('uSegments', uSegments);
        mustBeInteger('vSegments', vSegments);
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
                points.push(Vector3.copy(point));
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
                uva = new Vector2([j / uSegments, i / vSegments]);
                uvb = new Vector2([(j + 1) / uSegments, i / vSegments]);
                uvc = new Vector2([(j + 1) / uSegments, (i + 1) / vSegments]);
                uvd = new Vector2([j / uSegments, (i + 1) / vSegments]);
                var simplex = new Simplex(SimplexMode.TRIANGLE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[a];
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uva;
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[b];
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvb;
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[d];
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvd;
                _this.data.push(simplex);
                simplex = new Simplex(SimplexMode.TRIANGLE);
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[b];
                simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvb;
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[c];
                simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvc;
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[d];
                simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = uvd;
                _this.data.push(simplex);
            }
        }
        return _this;
        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
    }
    return GridSimplexBuilder;
}(SimplexPrimitivesBuilder));
export { GridSimplexBuilder };
