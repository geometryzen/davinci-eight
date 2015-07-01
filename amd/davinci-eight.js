/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define(["require", "exports", 'davinci-eight/core', 'davinci-eight/core/object3D', 'davinci-eight/cameras/perspectiveCamera', 'davinci-eight/scenes/scene', 'davinci-eight/renderers/webGLRenderer', 'davinci-eight/objects/mesh', 'davinci-eight/utils/webGLContextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner', 'davinci-eight/geometries/box', 'davinci-eight/geometries/CurveGeometry', 'davinci-eight/geometries/LatticeGeometry', 'davinci-eight/geometries/RGBGeometry', 'davinci-eight/geometries/prism', 'davinci-eight/materials/rawShaderMaterial', 'davinci-eight/objects/VertexAttribArray'], function (require, exports, core, object3D, perspectiveCamera, scene, webGLRenderer, mesh, webGLContextMonitor, workbench3D, windowAnimationRunner, box, CurveGeometry, LatticeGeometry, RGBGeometry, prism, rawShaderMaterial, VertexAttribArray) {
    var eight = {
        'VERSION': core.VERSION,
        perspective: perspectiveCamera,
        scene: scene,
        object3D: object3D,
        renderer: webGLRenderer,
        contextMonitor: webGLContextMonitor,
        workbench: workbench3D,
        animationRunner: windowAnimationRunner,
        mesh: mesh,
        /**
         * Constructs and returns a box geometry.
         */
        box: box,
        CurveGeometry: CurveGeometry,
        LatticeGeometry: LatticeGeometry,
        RGBGeometry: RGBGeometry,
        prism: prism,
        VertexAttribArray: VertexAttribArray,
        get rawShaderMaterial() {
            return rawShaderMaterial;
        }
    };
    return eight;
});
