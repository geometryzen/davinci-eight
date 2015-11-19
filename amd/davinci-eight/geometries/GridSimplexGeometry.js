var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/Simplex', '../geometries/SimplexGeometry', '../core/GraphicsProgramSymbols', '../math/R2', '../math/R3', '../checks/mustBeFunction', '../checks/mustBeInteger'], function (require, exports, Simplex, SimplexGeometry, GraphicsProgramSymbols, R2, R3, mustBeFunction, mustBeInteger) {
    /**
     * @class GridSimplexGeometry
     */
    var GridSimplexGeometry = (function (_super) {
        __extends(GridSimplexGeometry, _super);
        /**
         * @class GridSimplexGeometry
         * @constructor
         * @param parametricFunction {(u: number, v: number) => VectorE3}
         * @param uSegments {number}
         * @param vSegments {number}
         */
        function GridSimplexGeometry(parametricFunction, uSegments, vSegments) {
            _super.call(this);
            mustBeFunction('parametricFunction', parametricFunction);
            mustBeInteger('uSegments', uSegments);
            mustBeInteger('vSegments', vSegments);
            /**
             * Temporary array of points.
             */
            var points = [];
            var i;
            var j;
            var sliceCount = uSegments + 1;
            for (i = 0; i <= vSegments; i++) {
                var v = i / vSegments;
                for (j = 0; j <= uSegments; j++) {
                    var u = j / uSegments;
                    var point = parametricFunction(u, v);
                    // Make a copy just in case the function is returning mutable references.
                    points.push(R3.copy(point));
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
                    uva = new R2([j / uSegments, i / vSegments]);
                    uvb = new R2([(j + 1) / uSegments, i / vSegments]);
                    uvc = new R2([(j + 1) / uSegments, (i + 1) / vSegments]);
                    uvd = new R2([j / uSegments, (i + 1) / vSegments]);
                    var simplex = new Simplex(Simplex.TRIANGLE);
                    simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[a];
                    simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uva;
                    simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[b];
                    simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                    simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[d];
                    simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                    this.data.push(simplex);
                    var simplex = new Simplex(Simplex.TRIANGLE);
                    simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[b];
                    simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                    simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[c];
                    simplex.vertices[1].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvc;
                    simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[d];
                    simplex.vertices[2].attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                    this.data.push(simplex);
                }
            }
            //    this.computeFaceNormals();
            //    this.computeVertexNormals();
        }
        return GridSimplexGeometry;
    })(SimplexGeometry);
    return GridSimplexGeometry;
});
