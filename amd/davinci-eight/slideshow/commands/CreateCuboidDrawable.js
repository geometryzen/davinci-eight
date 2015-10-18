var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../uniforms/ColorFacet', '../../geometries/CuboidGeometry', '../../scene/Drawable', '../../materials/PointMaterial', '../../materials/LineMaterial', '../../materials/MeshMaterial', '../../models/ModelFacet', '../../utils/Shareable', '../../geometries/Simplex', '../../math/Vector3'], function (require, exports, ColorFacet, CuboidGeometry, Drawable, PointMaterial, LineMaterial, MeshMaterial, ModelFacet, Shareable, Simplex, Vector3) {
    function createMaterial(geometry) {
        switch (geometry.meta.k) {
            case Simplex.POINT:
                {
                    return new PointMaterial();
                }
            case Simplex.LINE:
                {
                    return new LineMaterial();
                }
            case Simplex.TRIANGLE:
                {
                    return new MeshMaterial();
                }
            default: {
                throw new Error('Unexpected dimensions for simplex: ' + geometry.meta.k);
            }
        }
    }
    var CreateCuboidDrawable = (function (_super) {
        __extends(CreateCuboidDrawable, _super);
        function CreateCuboidDrawable(name, a, b, c, k, subdivide, boundary) {
            if (a === void 0) { a = Vector3.e1; }
            if (b === void 0) { b = Vector3.e2; }
            if (c === void 0) { c = Vector3.e3; }
            if (k === void 0) { k = Simplex.TRIANGLE; }
            if (subdivide === void 0) { subdivide = 0; }
            if (boundary === void 0) { boundary = 0; }
            _super.call(this, 'CreateCuboidDrawable');
            this.name = name;
            this.a = Vector3.copy(a);
            this.b = Vector3.copy(b);
            this.c = Vector3.copy(c);
            this.k = k;
            this.subdivide = subdivide;
            this.boundary = boundary;
        }
        CreateCuboidDrawable.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        CreateCuboidDrawable.prototype.redo = function (slide, director) {
            var geometry = new CuboidGeometry();
            geometry.a.copy(this.a);
            geometry.b.copy(this.b);
            geometry.c.copy(this.c);
            geometry.k = this.k;
            geometry.subdivide(this.subdivide);
            geometry.boundary(this.boundary);
            var elements = geometry.toElements();
            var material = createMaterial(geometry);
            var drawable = new Drawable(elements, material);
            drawable.setFacet('model', new ModelFacet()).decRef();
            drawable.setFacet('color', new ColorFacet()).decRef().setRGB(1, 1, 1);
            director.addDrawable(drawable, this.name);
        };
        CreateCuboidDrawable.prototype.undo = function (slide, director) {
            director.removeDrawable(this.name).release();
        };
        return CreateCuboidDrawable;
    })(Shareable);
    return CreateCuboidDrawable;
});
