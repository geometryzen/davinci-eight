var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Geometry = require('../geometries/Geometry');
var mustBeInteger = require('../checks/mustBeInteger');
var mustBeNumber = require('../checks/mustBeNumber');
var Simplex = require('../dfx/Simplex');
var Symbolic = require('../core/Symbolic');
var Vector1 = require('../math/Vector1');
var Vector2 = require('../math/Vector2');
var Vector3 = require('../math/Vector3');
function boxCtor() {
    return "BoxGeometry constructor";
}
/**
 * @class BoxGeometry
 * @extends Geometry
 */
var BoxGeometry = (function (_super) {
    __extends(BoxGeometry, _super);
    function BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments, wireFrame) {
        if (width === void 0) { width = 1; }
        if (height === void 0) { height = 1; }
        if (depth === void 0) { depth = 1; }
        if (widthSegments === void 0) { widthSegments = 1; }
        if (heightSegments === void 0) { heightSegments = 1; }
        if (depthSegments === void 0) { depthSegments = 1; }
        if (wireFrame === void 0) { wireFrame = false; }
        _super.call(this);
        mustBeNumber('width', width, boxCtor);
        mustBeNumber('height', height, boxCtor);
        mustBeNumber('depth', depth, boxCtor);
        mustBeInteger('widthSegments', widthSegments, boxCtor);
        mustBeInteger('heightSegments', heightSegments, boxCtor);
        mustBeInteger('depthSegments', depthSegments, boxCtor);
        // Temporary storage for points.
        // The approach is:
        // 1. Compute the points first.
        // 2. Compute the faces and have them reference the points.
        // 3. Throw away the temporary storage of points. 
        var points = [];
        var geometry = this;
        var width_half = width / 2;
        var height_half = height / 2;
        var depth_half = depth / 2;
        buildPlane('z', 'y', -1, -1, depth, height, +width_half, new Vector1([0])); // positive-x
        buildPlane('z', 'y', +1, -1, depth, height, -width_half, new Vector1([1])); // negative-x
        buildPlane('x', 'z', +1, +1, width, depth, +height_half, new Vector1([2])); // positive-y
        buildPlane('x', 'z', +1, -1, width, depth, -height_half, new Vector1([3])); // negative-y
        buildPlane('x', 'y', +1, -1, width, height, +depth_half, new Vector1([4])); // positive-z
        buildPlane('x', 'y', -1, -1, width, height, -depth_half, new Vector1([5])); // negative-z
        function buildPlane(u, v, udir, vdir, width, height, depth, materialIndex) {
            var w;
            var ix;
            var iy;
            var gridX = widthSegments;
            var gridY = heightSegments;
            var width_half = width / 2;
            var height_half = height / 2;
            var offset = points.length;
            if ((u === 'x' && v === 'y') || (u === 'y' && v === 'x')) {
                w = 'z';
            }
            else if ((u === 'x' && v === 'z') || (u === 'z' && v === 'x')) {
                w = 'y';
                gridY = depthSegments;
            }
            else if ((u === 'z' && v === 'y') || (u === 'y' && v === 'z')) {
                w = 'x';
                gridX = depthSegments;
            }
            var gridX1 = gridX + 1;
            var gridY1 = gridY + 1;
            var segment_width = width / gridX;
            var segment_height = height / gridY;
            // The normal starts out as all zeros.
            var normal = new Vector3();
            // This bit of code sets the appropriate coordinate in the normal vector.
            normal[w] = depth > 0 ? 1 : -1;
            // Compute the points.
            for (iy = 0; iy < gridY1; iy++) {
                for (ix = 0; ix < gridX1; ix++) {
                    var point = new Vector3();
                    // This bit of code sets the appropriate coordinate in the position vector.
                    point[u] = (ix * segment_width - width_half) * udir;
                    point[v] = (iy * segment_height - height_half) * vdir;
                    point[w] = depth;
                    points.push(point);
                }
            }
            // Compute the triangular faces using the pre-computed points.
            for (iy = 0; iy < gridY; iy++) {
                for (ix = 0; ix < gridX; ix++) {
                    var a = ix + gridX1 * iy;
                    var b = ix + gridX1 * (iy + 1);
                    var c = (ix + 1) + gridX1 * (iy + 1);
                    var d = (ix + 1) + gridX1 * iy;
                    var uva = new Vector2([ix / gridX, 1 - iy / gridY]);
                    var uvb = new Vector2([ix / gridX, 1 - (iy + 1) / gridY]);
                    var uvc = new Vector2([(ix + 1) / gridX, 1 - (iy + 1) / gridY]);
                    var uvd = new Vector2([(ix + 1) / gridX, 1 - iy / gridY]);
                    var face = new Simplex(Simplex.K_FOR_TRIANGLE);
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[a + offset];
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uva;
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b + offset];
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d + offset];
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                    geometry.simplices.push(face);
                    face = new Simplex(Simplex.K_FOR_TRIANGLE);
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b + offset];
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb;
                    face.vertices[0].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[c + offset];
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvc;
                    face.vertices[1].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d + offset];
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd;
                    face.vertices[2].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;
                    geometry.simplices.push(face);
                }
            }
        }
        if (wireFrame) {
            this.boundary();
        }
        // This construction duplicates vertices along the edges of the cube.
        this.mergeVertices();
    }
    return BoxGeometry;
})(Geometry);
module.exports = BoxGeometry;
