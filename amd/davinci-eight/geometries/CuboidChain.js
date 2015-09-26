var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../geometries/buildPlane', '../dfx/Chain', '../checks/mustBeInteger', '../checks/mustBeNumber', '../math/Vector1'], function (require, exports, buildPlane, Chain, mustBeInteger, mustBeNumber, Vector1) {
    function boxCtor() {
        return "CuboidChain constructor";
    }
    /**
     * @class CuboidChain
     * @extends Chain
     */
    var CuboidChain = (function (_super) {
        __extends(CuboidChain, _super);
        function CuboidChain(x, y, z, xSeg, ySeg, zSeg, wireFrame) {
            if (x === void 0) { x = 1; }
            if (y === void 0) { y = 1; }
            if (z === void 0) { z = 1; }
            if (xSeg === void 0) { xSeg = 1; }
            if (ySeg === void 0) { ySeg = 1; }
            if (zSeg === void 0) { zSeg = 1; }
            if (wireFrame === void 0) { wireFrame = false; }
            _super.call(this);
            mustBeNumber('x', x, boxCtor);
            mustBeNumber('y', y, boxCtor);
            mustBeNumber('z', z, boxCtor);
            mustBeInteger('xSeg', xSeg, boxCtor);
            mustBeInteger('ySeg', ySeg, boxCtor);
            mustBeInteger('zSeg', zSeg, boxCtor);
            // Temporary storage for points.
            // The approach is:
            // 1. Compute the points first.
            // 2. Compute the faces and have them reference the points.
            // 3. Throw away the temporary storage of points. 
            var points = [];
            var faces = this.data;
            var xdiv2 = x / 2;
            var ydiv2 = y / 2;
            var zdiv2 = z / 2;
            // FIXME: Possible bug in 4th column? Not symmetric.
            buildPlane('z', 'y', -1, -1, z, y, +xdiv2, xSeg, ySeg, zSeg, new Vector1([0]), points, faces); // +x
            buildPlane('z', 'y', +1, -1, z, y, -xdiv2, xSeg, ySeg, zSeg, new Vector1([1]), points, faces); // -x
            buildPlane('x', 'z', +1, +1, x, z, +ydiv2, xSeg, ySeg, zSeg, new Vector1([2]), points, faces); // +y
            buildPlane('x', 'z', +1, -1, x, z, -ydiv2, xSeg, ySeg, zSeg, new Vector1([3]), points, faces); // -y
            buildPlane('x', 'y', +1, -1, x, y, +zdiv2, xSeg, ySeg, zSeg, new Vector1([4]), points, faces); // +z
            buildPlane('x', 'y', -1, -1, x, y, -zdiv2, xSeg, ySeg, zSeg, new Vector1([5]), points, faces); // -z
            if (wireFrame) {
                this.boundary();
            }
            // This construction duplicates vertices along the edges of the cube.
            this.mergeVertices();
            this.check();
        }
        return CuboidChain;
    })(Chain);
    return CuboidChain;
});
