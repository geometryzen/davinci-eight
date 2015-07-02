/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var core = require('davinci-eight/core');
var object3D = require('davinci-eight/core/object3D');
var perspectiveCamera = require('davinci-eight/cameras/perspectiveCamera');
var scene = require('davinci-eight/scenes/scene');
var webGLRenderer = require('davinci-eight/renderers/webGLRenderer');
var mesh = require('davinci-eight/objects/mesh');
var webGLContextMonitor = require('davinci-eight/utils/webGLContextMonitor');
var workbench3D = require('davinci-eight/utils/workbench3D');
var windowAnimationRunner = require('davinci-eight/utils/windowAnimationRunner');
var box = require('davinci-eight/geometries/box');
var ellipsoid = require('davinci-eight/geometries/ellipsoid');
var prism = require('davinci-eight/geometries/prism');
var CurveGeometry = require('davinci-eight/geometries/CurveGeometry');
var LatticeGeometry = require('davinci-eight/geometries/LatticeGeometry');
var RGBGeometry = require('davinci-eight/geometries/RGBGeometry');
var pointsMaterial = require('davinci-eight/materials/pointsMaterial');
var rawShaderMaterial = require('davinci-eight/materials/rawShaderMaterial');
var VertexAttribArray = require('davinci-eight/objects/VertexAttribArray');
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
    get ellipsoid() { return ellipsoid; },
    prism: prism,
    CurveGeometry: CurveGeometry,
    LatticeGeometry: LatticeGeometry,
    RGBGeometry: RGBGeometry,
    VertexAttribArray: VertexAttribArray,
    get pointsMaterial() {
        return pointsMaterial;
    },
    get rawShaderMaterial() {
        return rawShaderMaterial;
    }
};
module.exports = eight;
