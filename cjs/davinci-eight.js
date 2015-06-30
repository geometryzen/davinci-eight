/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var core = require('davinci-eight/core');
var material = require('davinci-eight/materials/material');
var object3D = require('davinci-eight/core/object3D');
var perspectiveCamera = require('davinci-eight/cameras/perspectiveCamera');
var scene = require('davinci-eight/scenes/scene');
var webGLRenderer = require('davinci-eight/renderers/webGLRenderer');
var mesh = require('davinci-eight/objects/mesh');
var webGLContextMonitor = require('davinci-eight/utils/webGLContextMonitor');
var workbench3D = require('davinci-eight/utils/workbench3D');
var windowAnimationRunner = require('davinci-eight/utils/windowAnimationRunner');
var boxGeometry = require('davinci-eight/geometries/boxGeometry');
var CurveGeometry = require('davinci-eight/geometries/CurveGeometry');
var LatticeGeometry = require('davinci-eight/geometries/LatticeGeometry');
var RGBGeometry = require('davinci-eight/geometries/RGBGeometry');
var prismGeometry = require('davinci-eight/geometries/prismGeometry');
var rawShaderMaterial = require('davinci-eight/materials/rawShaderMaterial');
var meshBasicMaterial = require('davinci-eight/materials/meshBasicMaterial');
var meshNormalMaterial = require('davinci-eight/materials/meshNormalMaterial');
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
    box: boxGeometry,
    CurveGeometry: CurveGeometry,
    LatticeGeometry: LatticeGeometry,
    RGBGeometry: RGBGeometry,
    prism: prismGeometry,
    material: material,
    meshBasicMaterial: meshBasicMaterial,
    meshNormalMaterial: meshNormalMaterial,
    VertexAttribArray: VertexAttribArray,
    get rawShaderMaterial() {
        return rawShaderMaterial;
    }
};
module.exports = eight;
