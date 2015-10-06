var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../../uniforms/ColorFacet', '../../models/ModelFacet', '../../geometries/CuboidGeometry', '../../scene/Drawable', '../../materials/SmartMaterialBuilder', '../../utils/Shareable', '../../core/Symbolic'], function (require, exports, ColorFacet, ModelFacet, CuboidGeometry, Drawable, SmartMaterialBuilder, Shareable, Symbolic) {
    var CubeTask = (function (_super) {
        __extends(CubeTask, _super);
        function CubeTask(name, sceneNames) {
            _super.call(this, 'CubeTx');
            this.name = name;
            this.sceneNames = sceneNames.map(function (sceneName) { return sceneName; });
        }
        CubeTask.prototype.destructor = function () {
        };
        CubeTask.prototype.exec = function (slide, host) {
            var geometry = new CuboidGeometry();
            geometry.k = 1;
            geometry.calculate();
            var elements = geometry.toElements();
            var smb = new SmartMaterialBuilder(elements);
            smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
            var material = smb.build([]);
            try {
                var thing = new Drawable(elements, material);
                try {
                    thing.setFacet('model', new ModelFacet()).release();
                    thing.setFacet('color', new ColorFacet().setRGB(0, 1, 0)).release();
                    thing.name = this.name;
                    host.addDrawable(this.name, thing);
                    this.sceneNames.forEach(function (sceneName) {
                        host.addToScene(thing.name, sceneName);
                    });
                }
                finally {
                    thing.release();
                }
            }
            finally {
                material.release();
            }
        };
        CubeTask.prototype.undo = function (slide, host) {
            var drawableName = this.name;
            this.sceneNames.forEach(function (sceneName) {
                host.removeFromScene(drawableName, sceneName);
            });
            host.removeDrawable(drawableName);
        };
        return CubeTask;
    })(Shareable);
    return CubeTask;
});
