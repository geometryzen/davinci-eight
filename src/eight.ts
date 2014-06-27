import core = require('eight/core');
import geometry = require('eight/core/geometry');
import material = require('eight/core/material');

import Euclidean3 = require('eight/math/e3ga/Euclidean3');

import scalarE3 = require('eight/math/e3ga/scalarE3');
import vectorE3 = require('eight/math/e3ga/vectorE3');
import bivectorE3 = require('eight/math/e3ga/bivectorE3');

import object3D = require('eight/core/object3D');
import camera = require('eight/cameras/camera');
import perspectiveCamera = require('eight/cameras/perspectiveCamera');
import scene = require('eight/scenes/scene');
import webGLRenderer = require('eight/renderers/webGLRenderer');
import mesh = require('eight/objects/mesh');
import webGLContextMonitor = require('eight/utils/webGLContextMonitor');
import workbench3D = require('eight/utils/workbench3D');
import windowAnimationRunner = require('eight/utils/windowAnimationRunner');
import boxGeometry = require('eight/geometries/boxGeometry');
import prismGeometry = require('eight/geometries/prismGeometry');
import meshBasicMaterial = require('eight/materials/meshBasicMaterial');
import meshNormalMaterial = require('eight/materials/meshNormalMaterial');

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
    box: boxGeometry,
    prism: prismGeometry,
    material: material,
    meshBasicMaterial: meshBasicMaterial,
    meshNormalMaterial: meshNormalMaterial
};
export = eight;
