/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define(["require", "exports", 'davinci-eight/core', 'davinci-eight/core/object3D', 'davinci-eight/cameras/Camera', 'davinci-eight/cameras/perspectiveCamera', 'davinci-eight/cameras/PerspectiveCamera', 'davinci-eight/worlds/world', 'davinci-eight/worlds/Scene', 'davinci-eight/renderers/renderer', 'davinci-eight/renderers/WebGLRenderer', 'davinci-eight/objects/mesh', 'davinci-eight/objects/Mesh', 'davinci-eight/utils/webGLContextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner', 'davinci-eight/geometries/box', 'davinci-eight/geometries/cuboid', 'davinci-eight/geometries/ellipsoid', 'davinci-eight/geometries/prism', 'davinci-eight/geometries/CurveGeometry', 'davinci-eight/geometries/LatticeGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/RGBGeometry', 'davinci-eight/materials/pointsMaterial', 'davinci-eight/materials/shaderMaterial', 'davinci-eight/materials/smartMaterial', 'davinci-eight/objects/ShaderAttributeVariable', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/materials/MeshBasicMaterial', 'davinci-eight/materials/MeshNormalMaterial', 'davinci-eight/math/Quaternion'], function (require, exports, core, object3D, Camera, perspectiveCamera, PerspectiveCamera, world, Scene, renderer, WebGLRenderer, mesh, Mesh, webGLContextMonitor, workbench3D, windowAnimationRunner, box, cuboid, ellipsoid, prism, CurveGeometry, LatticeGeometry, BoxGeometry, RGBGeometry, pointsMaterial, shaderMaterial, smartMaterial, ShaderAttributeVariable, Matrix3, Matrix4, MeshBasicMaterial, MeshNormalMaterial, Quaternion) {
    var eight = {
        'VERSION': core.VERSION,
        perspective: perspectiveCamera,
        get world() { return world; },
        object3D: object3D,
        renderer: renderer,
        contextMonitor: webGLContextMonitor,
        workbench: workbench3D,
        animationRunner: windowAnimationRunner,
        get mesh() { return mesh; },
        /**
         * Constructs and returns a box geometry.
         */
        get box() { return box; },
        get cuboid() { return cuboid; },
        get ellipsoid() { return ellipsoid; },
        prism: prism,
        CurveGeometry: CurveGeometry,
        LatticeGeometry: LatticeGeometry,
        RGBGeometry: RGBGeometry,
        ShaderAttributeVariable: ShaderAttributeVariable,
        get pointsMaterial() {
            return pointsMaterial;
        },
        get shaderMaterial() {
            return shaderMaterial;
        },
        get smartMaterial() {
            return smartMaterial;
        },
        get Scene() { return Scene; },
        get Camera() { return Camera; },
        get PerspectiveCamera() { return PerspectiveCamera; },
        get WebGLRenderer() { return WebGLRenderer; },
        get BoxGeometry() { return BoxGeometry; },
        get Mesh() { return Mesh; },
        get MeshBasicMaterial() { return MeshBasicMaterial; },
        get MeshNormalMaterial() { return MeshNormalMaterial; },
        get Matrix3() { return Matrix3; },
        get Matrix4() { return Matrix4; },
        get Quaternion() { return Quaternion; }
    };
    return eight;
});
