var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Face3 = require('../core/Face3');
var Geometry = require('../geometries/Geometry');
var Vector2 = require('../math/Vector2');
var Vector3 = require('../math/Vector3');
/**
 * @author zz85 / https://github.com/zz85
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 *
 * new ParametricSurfaceGeometry( parametricFunction, uSegments, vSegments );
 */
var ParametricSurfaceGeometry = (function (_super) {
    __extends(ParametricSurfaceGeometry, _super);
    function ParametricSurfaceGeometry(parametricFunction, uSegments, vSegments) {
        _super.call(this);
        var vertices = this.vertices;
        var faces = this.faces;
        var uvs = this.faceVertexUvs[0];
        var i;
        var j;
        var sliceCount = uSegments + 1;
        for (i = 0; i <= vSegments; i++) {
            var v = i / vSegments;
            for (j = 0; j <= uSegments; j++) {
                var u = j / uSegments;
                var p = parametricFunction(u, v);
                vertices.push(new Vector3([p.x, p.y, p.z]));
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
                uva = new Vector2([j / uSegments, i / vSegments]);
                uvb = new Vector2([(j + 1) / uSegments, i / vSegments]);
                uvc = new Vector2([(j + 1) / uSegments, (i + 1) / vSegments]);
                uvd = new Vector2([j / uSegments, (i + 1) / vSegments]);
                faces.push(new Face3(a, b, d));
                uvs.push([uva, uvb, uvd]);
                faces.push(new Face3(b, c, d));
                uvs.push([uvb.clone(), uvc, uvd.clone()]);
            }
        }
        this.computeFaceNormals();
        this.computeVertexNormals();
    }
    return ParametricSurfaceGeometry;
})(Geometry);
module.exports = ParametricSurfaceGeometry;