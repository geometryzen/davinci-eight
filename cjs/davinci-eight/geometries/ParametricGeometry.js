var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Face3 = require('../core/Face3');
var Geometry = require('../geometries/Geometry');
var Vector2 = require('../math/Vector2');
/**
 * @author zz85 / https://github.com/zz85
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 *
 * new ParametricGeometry( parametricFunction, uSegments, vSegments );
 */
var ParametricGeometry = (function (_super) {
    __extends(ParametricGeometry, _super);
    function ParametricGeometry(parametricFunction, uSegments, vSegments) {
        _super.call(this);
        var verts = this.vertices;
        var faces = this.faces;
        var uvs = this.faceVertexUvs[0];
        var i;
        var j;
        var p;
        var u;
        var v;
        var sliceCount = uSegments + 1;
        for (i = 0; i <= vSegments; i++) {
            v = i / vSegments;
            for (j = 0; j <= uSegments; j++) {
                u = j / uSegments;
                p = parametricFunction(u, v);
                verts.push(p);
            }
        }
        var a, b, c, d;
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
                uva = new Vector2(j / uSegments, i / vSegments);
                uvb = new Vector2((j + 1) / uSegments, i / vSegments);
                uvc = new Vector2((j + 1) / uSegments, (i + 1) / vSegments);
                uvd = new Vector2(j / uSegments, (i + 1) / vSegments);
                faces.push(new Face3(a, b, d));
                uvs.push([uva, uvb, uvd]);
                faces.push(new Face3(b, c, d));
                uvs.push([uvb.clone(), uvc, uvd.clone()]);
            }
        }
        this.computeFaceNormals();
        this.computeVertexNormals();
    }
    return ParametricGeometry;
})(Geometry);
module.exports = ParametricGeometry;
