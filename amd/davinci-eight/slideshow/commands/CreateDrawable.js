var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../uniforms/ColorFacet', '../../scene/Drawable', '../../materials/EmptyMaterial', '../../materials/PointMaterial', '../../materials/LineMaterial', '../../materials/MeshMaterial', '../../models/ModelFacet', '../../utils/Shareable', '../../geometries/Simplex'], function (require, exports, ColorFacet, Drawable, EmptyMaterial, PointMaterial, LineMaterial, MeshMaterial, ModelFacet, Shareable, Simplex) {
    function createMaterial(geometry) {
        switch (geometry.meta.k) {
            case Simplex.TRIANGLE:
                {
                    return new MeshMaterial();
                }
            case Simplex.LINE:
                {
                    return new LineMaterial();
                }
            case Simplex.POINT:
                {
                    return new PointMaterial();
                }
            case Simplex.EMPTY:
                {
                    return new EmptyMaterial();
                }
            default: {
                throw new Error('Unexpected dimensionality for simplex: ' + geometry.meta.k);
            }
        }
    }
    var CreateDrawable = (function (_super) {
        __extends(CreateDrawable, _super);
        function CreateDrawable(name, geometry) {
            _super.call(this, 'CreateDrawable');
            this.name = name;
            this.geometry = geometry;
            this.geometry.addRef();
        }
        CreateDrawable.prototype.destructor = function () {
            this.geometry.release();
            this.geometry = void 0;
            _super.prototype.destructor.call(this);
        };
        CreateDrawable.prototype.redo = function (slide, director) {
            var primitives = this.geometry.toPrimitives();
            var material = createMaterial(this.geometry);
            var drawable = new Drawable(primitives, material);
            drawable.setFacet('model', new ModelFacet()).decRef();
            drawable.setFacet('color', new ColorFacet()).decRef().setRGB(1, 1, 1);
            director.addDrawable(drawable, this.name);
        };
        CreateDrawable.prototype.undo = function (slide, director) {
            director.removeDrawable(this.name).release();
        };
        return CreateDrawable;
    })(Shareable);
    return CreateDrawable;
});
