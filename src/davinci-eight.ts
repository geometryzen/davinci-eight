import core = require('davinci-eight/core');
import geometry = require('davinci-eight/core/geometry');
import material = require('davinci-eight/core/material');

import Euclidean3 = require('davinci-blade/Euclidean3');

import scalarE3 = require('davinci-eight/math/e3ga/scalarE3');
import vectorE3 = require('davinci-eight/math/e3ga/vectorE3');
import bivectorE3 = require('davinci-eight/math/e3ga/bivectorE3');

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
import prismGeometry = require('davinci-eight/geometries/prismGeometry');
import meshBasicMaterial = require('davinci-eight/materials/meshBasicMaterial');
import meshNormalMaterial = require('davinci-eight/materials/meshNormalMaterial');

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
export = eight;
