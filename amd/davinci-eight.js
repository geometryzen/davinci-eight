define(["require", "exports", 'davinci-eight/core', 'davinci-eight/core/geometry', 'davinci-eight/core/material', 'davinci-blade/Euclidean3', 'davinci-eight/math/e3ga/scalarE3', 'davinci-eight/math/e3ga/vectorE3', 'davinci-eight/math/e3ga/bivectorE3', 'davinci-eight/core/object3D', 'davinci-eight/cameras/perspectiveCamera', 'davinci-eight/scenes/scene', 'davinci-eight/renderers/webGLRenderer', 'davinci-eight/objects/mesh', 'davinci-eight/utils/webGLContextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner', 'davinci-eight/geometries/boxGeometry', 'davinci-eight/geometries/prismGeometry', 'davinci-eight/materials/meshBasicMaterial', 'davinci-eight/materials/meshNormalMaterial'], function (require, exports, core, geometry, material, Euclidean3, scalarE3, vectorE3, bivectorE3, object3D, perspectiveCamera, scene, webGLRenderer, mesh, webGLContextMonitor, workbench3D, windowAnimationRunner, boxGeometry, prismGeometry, meshBasicMaterial, meshNormalMaterial) {
    var eight = {
        'VERSION': core.VERSION,
        perspective: perspectiveCamera,
        Euclidean3: Euclidean3,
        scalarE3: scalarE3,
        vectorE3: vectorE3,
        bivectorE3: bivectorE3,
        scene: scene,
        object3D: object3D,
        renderer: webGLRenderer,
        contextMonitor: webGLContextMonitor,
        workbench: workbench3D,
        animationRunner: windowAnimationRunner,
        mesh: mesh,
        geometry: geometry,
        /**
         * Constructs and returns a box geometry.
         */
        box: boxGeometry,
        prism: prismGeometry,
        material: material,
        meshBasicMaterial: meshBasicMaterial,
        meshNormalMaterial: meshNormalMaterial
    };
    return eight;
});
