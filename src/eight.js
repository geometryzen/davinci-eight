define(["require", "exports", 'eight/core', 'eight/core/geometry', 'eight/core/material', 'eight/math/e3ga/euclidean3', 'eight/math/e3ga/scalarE3', 'eight/math/e3ga/vectorE3', 'eight/math/e3ga/bivectorE3', 'eight/core/object3D', 'eight/cameras/perspectiveCamera', 'eight/scenes/scene', 'eight/renderers/webGLRenderer', 'eight/objects/mesh', 'eight/utils/webGLContextMonitor', 'eight/utils/workbench3D', 'eight/utils/windowAnimationRunner', 'eight/geometries/boxGeometry', 'eight/geometries/prismGeometry', 'eight/materials/meshBasicMaterial', 'eight/materials/meshNormalMaterial'], function(require, exports, core, geometry, material, euclidean3, scalarE3, vectorE3, bivectorE3, object3D, perspectiveCamera, scene, webGLRenderer, mesh, webGLContextMonitor, workbench3D, windowAnimationRunner, boxGeometry, prismGeometry, meshBasicMaterial, meshNormalMaterial) {
    var eight = {
        'VERSION': core.VERSION,
        perspectiveCamera: perspectiveCamera,
        euclidean3: euclidean3,
        scalarE3: scalarE3,
        vectorE3: vectorE3,
        bivectorE3: bivectorE3,
        scene: scene,
        object3D: object3D,
        webGLRenderer: webGLRenderer,
        webGLContextMonitor: webGLContextMonitor,
        workbench3D: workbench3D,
        windowAnimationRunner: windowAnimationRunner,
        mesh: mesh,
        geometry: geometry,
        boxGeometry: boxGeometry,
        prismGeometry: prismGeometry,
        material: material,
        meshBasicMaterial: meshBasicMaterial,
        meshNormalMaterial: meshNormalMaterial
    };
    
    return eight;
});
