/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define(["require", "exports", 'davinci-eight/core', 'davinci-eight/core/functionalConstructorObject3D', 'davinci-eight/core/Object3D', 'davinci-eight/cameras/Camera', 'davinci-eight/cameras/perspectiveCamera', 'davinci-eight/cameras/PerspectiveCamera', 'davinci-eight/worlds/world', 'davinci-eight/worlds/Scene', 'davinci-eight/renderers/renderer', 'davinci-eight/renderers/WebGLRenderer', 'davinci-eight/objects/mesh', 'davinci-eight/objects/Mesh', 'davinci-eight/utils/webGLContextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner', 'davinci-eight/geometries/box', 'davinci-eight/geometries/cuboid', 'davinci-eight/geometries/ellipsoid', 'davinci-eight/geometries/prism', 'davinci-eight/geometries/CurveGeometry', 'davinci-eight/geometries/LatticeGeometry', 'davinci-eight/core/Face3', 'davinci-eight/geometries/Geometry', 'davinci-eight/geometries/GeometryVertexAttributeProvider', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/DodecahedronGeometry', 'davinci-eight/geometries/IcosahedronGeometry', 'davinci-eight/geometries/KleinBottleGeometry', 'davinci-eight/geometries/MobiusStripGeometry', 'davinci-eight/geometries/OctahedronGeometry', 'davinci-eight/geometries/ParametricGeometry', 'davinci-eight/geometries/PolyhedronGeometry', 'davinci-eight/geometries/RevolutionGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/geometries/TubeGeometry', 'davinci-eight/geometries/VortexGeometry', 'davinci-eight/geometries/RGBGeometry', 'davinci-eight/materials/pointsMaterial', 'davinci-eight/materials/shaderMaterial', 'davinci-eight/materials/smartMaterial', 'davinci-eight/objects/ShaderAttributeVariable', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/materials/MeshBasicMaterial', 'davinci-eight/materials/MeshNormalMaterial', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/curves/Curve'], function (require, exports, core, object3D, Object3D, Camera, perspectiveCamera, PerspectiveCamera, world, Scene, renderer, WebGLRenderer, mesh, Mesh, webGLContextMonitor, workbench3D, windowAnimationRunner, box, cuboid, ellipsoid, prism, CurveGeometry, LatticeGeometry, Face3, Geometry, GeometryVertexAttributeProvider, BoxGeometry, ArrowGeometry, CylinderGeometry, DodecahedronGeometry, IcosahedronGeometry, KleinBottleGeometry, MobiusStripGeometry, OctahedronGeometry, ParametricGeometry, PolyhedronGeometry, RevolutionGeometry, SphereGeometry, TetrahedronGeometry, TubeGeometry, VortexGeometry, RGBGeometry, pointsMaterial, shaderMaterial, smartMaterial, ShaderAttributeVariable, Matrix3, Matrix4, MeshBasicMaterial, MeshNormalMaterial, Spinor3, Vector2, Vector3, Curve) {
    /**
     * @module EIGHT
     */
    var eight = {
        /**
         * The semantic version of the library.
         * @property VERSION
         * @type String
         */
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
        get Face3() { return Face3; },
        get Geometry() { return Geometry; },
        get GeometryVertexAttributeProvider() { return GeometryVertexAttributeProvider; },
        get BoxGeometry() { return BoxGeometry; },
        get CylinderGeometry() { return CylinderGeometry; },
        get DodecahedronGeometry() { return DodecahedronGeometry; },
        get IcosahedronGeometry() { return IcosahedronGeometry; },
        get KleinBottleGeometry() { return KleinBottleGeometry; },
        get MobiusStripGeometry() { return MobiusStripGeometry; },
        get OctahedronGeometry() { return OctahedronGeometry; },
        get Object3D() { return Object3D; },
        get ParametricGeometry() { return ParametricGeometry; },
        get PolyhedronGeometry() { return PolyhedronGeometry; },
        get RevolutionGeometry() { return RevolutionGeometry; },
        get SphereGeometry() { return SphereGeometry; },
        get TetrahedronGeometry() { return TetrahedronGeometry; },
        get TubeGeometry() { return TubeGeometry; },
        get ArrowGeometry() { return ArrowGeometry; },
        get VortexGeometry() { return VortexGeometry; },
        get Mesh() { return Mesh; },
        get MeshBasicMaterial() { return MeshBasicMaterial; },
        get MeshNormalMaterial() { return MeshNormalMaterial; },
        get Matrix3() { return Matrix3; },
        get Matrix4() { return Matrix4; },
        get Spinor3() { return Spinor3; },
        get Vector2() { return Vector2; },
        get Vector3() { return Vector3; },
        get Curve() { return Curve; }
    };
    return eight;
});
