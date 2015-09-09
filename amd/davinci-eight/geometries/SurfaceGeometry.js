var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../core/Face3', '../geometries/Geometry3', '../math/Vector2', '../checks/expectArg'], function (require, exports, Face3, Geometry3, Vector2, expectArg) {
    /**
     * @author zz85 / https://github.com/zz85
     * Parametric Surfaces Geometry
     * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
     *
     * new SurfaceGeometry( parametricFunction, uSegments, vSegments );
     */
    var SurfaceGeometry = (function (_super) {
        __extends(SurfaceGeometry, _super);
        function SurfaceGeometry(parametricFunction, uSegments, vSegments) {
            _super.call(this);
            expectArg('parametricFunction', parametricFunction).toBeFunction();
            expectArg('uSegments', uSegments).toBeNumber();
            expectArg('vSegments', vSegments).toBeNumber();
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
                    var point = parametricFunction(u, v);
                    // Make a copy just in case the function is returning mutable references.
                    vertices.push({ x: point.x, y: point.y, z: point.z });
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
        return SurfaceGeometry;
    })(Geometry3);
    return SurfaceGeometry;
});
