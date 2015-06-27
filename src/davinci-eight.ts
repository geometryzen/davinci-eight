/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />

import core = require('davinci-eight/core');
import material = require('davinci-eight/materials/material');

import object3D = require('davinci-eight/core/object3D');
import camera = require('davinci-eight/cameras/camera');
import perspectiveCamera = require('davinci-eight/cameras/perspectiveCamera');
import scene = require('davinci-eight/scenes/scene');
import webGLRenderer = require('davinci-eight/renderers/webGLRenderer');
import mesh = require('davinci-eight/objects/mesh');
import webGLContextMonitor = require('davinci-eight/utils/webGLContextMonitor');
import workbench3D = require('davinci-eight/utils/workbench3D');
import windowAnimationRunner = require('davinci-eight/utils/windowAnimationRunner');
import boxGeometry = require('davinci-eight/geometries/boxGeometry');
import CurveGeometry = require('davinci-eight/geometries/CurveGeometry');
import LatticeGeometry = require('davinci-eight/geometries/LatticeGeometry');
import RGBGeometry = require('davinci-eight/geometries/RGBGeometry');
import prismGeometry = require('davinci-eight/geometries/prismGeometry');
import rawShaderMaterial = require('davinci-eight/materials/rawShaderMaterial');
import RawShaderMaterial = require('davinci-eight/materials/RawShaderMaterial');
import meshBasicMaterial = require('davinci-eight/materials/meshBasicMaterial');
import meshNormalMaterial = require('davinci-eight/materials/meshNormalMaterial');
import VertexAttribArray = require('davinci-eight/objects/VertexAttribArray');

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
    },
    RawShaderMaterial: RawShaderMaterial
};
export = eight;
