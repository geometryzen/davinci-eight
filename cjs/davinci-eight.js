/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var core = require('davinci-eight/core');
var object3D = require('davinci-eight/core/object3D');
var Camera = require('davinci-eight/cameras/Camera');
var perspectiveCamera = require('davinci-eight/cameras/perspectiveCamera');
var PerspectiveCamera = require('davinci-eight/cameras/PerspectiveCamera');
var world = require('davinci-eight/worlds/world');
var Scene = require('davinci-eight/worlds/Scene');
var renderer = require('davinci-eight/renderers/renderer');
var WebGLRenderer = require('davinci-eight/renderers/WebGLRenderer');
var mesh = require('davinci-eight/objects/mesh');
var Mesh = require('davinci-eight/objects/Mesh');
var webGLContextMonitor = require('davinci-eight/utils/webGLContextMonitor');
var workbench3D = require('davinci-eight/utils/workbench3D');
var windowAnimationRunner = require('davinci-eight/utils/windowAnimationRunner');
var box = require('davinci-eight/geometries/box');
var cuboid = require('davinci-eight/geometries/cuboid');
var ellipsoid = require('davinci-eight/geometries/ellipsoid');
var prism = require('davinci-eight/geometries/prism');
var CurveGeometry = require('davinci-eight/geometries/CurveGeometry');
var LatticeGeometry = require('davinci-eight/geometries/LatticeGeometry');
var Face3 = require('davinci-eight/core/Face3');
var Geometry = require('davinci-eight/geometries/Geometry');
var GeometryVertexAttributeProvider = require('davinci-eight/geometries/GeometryVertexAttributeProvider');
var BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
var ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
var CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
var DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
var IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
var OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
var PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
var RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
var SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
var TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
var TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
var VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
var RGBGeometry = require('davinci-eight/geometries/RGBGeometry');
var pointsMaterial = require('davinci-eight/materials/pointsMaterial');
var shaderMaterial = require('davinci-eight/materials/shaderMaterial');
var smartMaterial = require('davinci-eight/materials/smartMaterial');
var ShaderAttributeVariable = require('davinci-eight/objects/ShaderAttributeVariable');
var Matrix3 = require('davinci-eight/math/Matrix3');
var Matrix4 = require('davinci-eight/math/Matrix4');
var MeshBasicMaterial = require('davinci-eight/materials/MeshBasicMaterial');
var MeshNormalMaterial = require('davinci-eight/materials/MeshNormalMaterial');
var Quaternion = require('davinci-eight/math/Quaternion');
var Vector2 = require('davinci-eight/math/Vector2');
var Vector3 = require('davinci-eight/math/Vector3');
var Curve = require('davinci-eight/curves/Curve');
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
    get Face3() { return Face3; },
    get Geometry() { return Geometry; },
    get GeometryVertexAttributeProvider() { return GeometryVertexAttributeProvider; },
    get BoxGeometry() { return BoxGeometry; },
    get CylinderGeometry() { return CylinderGeometry; },
    get DodecahedronGeometry() { return DodecahedronGeometry; },
    get IcosahedronGeometry() { return IcosahedronGeometry; },
    get OctahedronGeometry() { return OctahedronGeometry; },
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
    get Quaternion() { return Quaternion; },
    get Vector2() { return Vector2; },
    get Vector3() { return Vector3; },
    get Curve() { return Curve; }
};
module.exports = eight;
