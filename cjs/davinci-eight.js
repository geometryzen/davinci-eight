/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var core = require('davinci-eight/core');
var object3D = require('davinci-eight/core/object3D');
var Camera = require('davinci-eight/cameras/Camera');
var perspectiveCamera = require('davinci-eight/cameras/perspectiveCamera');
var PerspectiveCamera = require('davinci-eight/cameras/PerspectiveCamera');
var scene = require('davinci-eight/scenes/scene');
var webGLRenderer = require('davinci-eight/renderers/webGLRenderer');
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
var BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
var RGBGeometry = require('davinci-eight/geometries/RGBGeometry');
var pointsMaterial = require('davinci-eight/materials/pointsMaterial');
var shaderMaterial = require('davinci-eight/materials/shaderMaterial');
var smartMaterial = require('davinci-eight/materials/smartMaterial');
var ShaderAttributeVariable = require('davinci-eight/objects/ShaderAttributeVariable');
var Matrix3 = require('davinci-eight/math/Matrix3');
var Matrix4 = require('davinci-eight/math/Matrix4');
var MeshBasicMaterial = require('davinci-eight/materials/MeshBasicMaterial');
var eight = {
    'VERSION': core.VERSION,
    perspective: perspectiveCamera,
    get Camera() { return Camera; },
    get PerspectiveCamera() { return PerspectiveCamera; },
    scene: scene,
    object3D: object3D,
    renderer: webGLRenderer,
    contextMonitor: webGLContextMonitor,
    workbench: workbench3D,
    animationRunner: windowAnimationRunner,
    get mesh() { return mesh; },
    get Mesh() { return Mesh; },
    /**
     * Constructs and returns a box geometry.
     */
    get box() { return box; },
    get cuboid() { return cuboid; },
    get ellipsoid() { return ellipsoid; },
    prism: prism,
    CurveGeometry: CurveGeometry,
    LatticeGeometry: LatticeGeometry,
    get BoxGeometry() { return BoxGeometry; },
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
    get MeshBasicMaterial() {
        return MeshBasicMaterial;
    },
    get Matrix3() { return Matrix3; },
    get Matrix4() { return Matrix4; }
};
module.exports = eight;
