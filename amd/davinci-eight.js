/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define(["require", "exports", 'davinci-eight/core', 'davinci-eight/materials/material', 'davinci-eight/materials/customMaterial', 'davinci-eight/core/object3D', 'davinci-eight/cameras/perspectiveCamera', 'davinci-eight/scenes/scene', 'davinci-eight/renderers/webGLRenderer', 'davinci-eight/objects/mesh', 'davinci-eight/utils/webGLContextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner', 'davinci-eight/geometries/boxGeometry', 'davinci-eight/geometries/CurveGeometry', 'davinci-eight/geometries/LatticeGeometry', 'davinci-eight/geometries/RGBGeometry', 'davinci-eight/geometries/prismGeometry', 'davinci-eight/materials/meshBasicMaterial', 'davinci-eight/materials/meshNormalMaterial', 'davinci-eight/objects/VertexAttribArray'], function (require, exports, core, material, customMaterial, object3D, perspectiveCamera, scene, webGLRenderer, mesh, webGLContextMonitor, workbench3D, windowAnimationRunner, boxGeometry, CurveGeometry, LatticeGeometry, RGBGeometry, prismGeometry, meshBasicMaterial, meshNormalMaterial, VertexAttribArray) {
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
        box: boxGeometry,
        CurveGeometry: CurveGeometry,
        LatticeGeometry: LatticeGeometry,
        RGBGeometry: RGBGeometry,
        prism: prismGeometry,
        customMaterial: customMaterial,
        material: material,
        meshBasicMaterial: meshBasicMaterial,
        meshNormalMaterial: meshNormalMaterial,
        VertexAttribArray: VertexAttribArray
    };
    return eight;
});
