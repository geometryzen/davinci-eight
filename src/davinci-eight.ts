/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />

// cameras
import Frustum = require('davinci-eight/cameras/Frustum');
import Node = require('davinci-eight/cameras/Node');
import Perspective = require('davinci-eight/cameras/Perspective');
import View = require('davinci-eight/cameras/View');
import frustum = require('davinci-eight/cameras/frustum');
import frustumMatrix = require('davinci-eight/cameras/frustumMatrix');
import perspective = require('davinci-eight/cameras/perspective');
import perspectiveMatrix = require('davinci-eight/cameras/perspectiveMatrix');
import view = require('davinci-eight/cameras/view');
import viewMatrix = require('davinci-eight/cameras/viewMatrix');
// core
import AttribMetaInfos = require('davinci-eight/core/AttribMetaInfos');
import AttribProvider = require('davinci-eight/core/AttribProvider');
import DefaultAttribProvider = require('davinci-eight/core/DefaultAttribProvider');
import Color = require('davinci-eight/core/Color');
import Composite = require('davinci-eight/core/Composite');
import DrawMode = require('davinci-eight/core/DrawMode');
import Face3 = require('davinci-eight/core/Face3');
import Primitive = require('davinci-eight/core/Primitive');
import UniformMetaInfo = require('davinci-eight/core/UniformMetaInfo');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import core = require('davinci-eight/core');
import primitive = require('davinci-eight/objects/primitive');
import UniformProvider = require('davinci-eight/core/UniformProvider');
import UniformData = require('davinci-eight/core/UniformData');
import UniformDataVisitor = require('davinci-eight/core/UniformDataVisitor');
import AttribLocation = require('davinci-eight/core/AttribLocation');
import UniformLocation = require('davinci-eight/core/UniformLocation');
// drawLists
import scene = require('davinci-eight/drawLists/scene');
import DrawList = require('davinci-eight/drawLists/DrawList');
// geometries
import Geometry = require('davinci-eight/geometries/Geometry');
import GeometryAdapter = require('davinci-eight/geometries/GeometryAdapter');
import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
import BarnGeometry = require('davinci-eight/geometries/BarnGeometry');
import BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
import DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
import EllipticalCylinderGeometry = require('davinci-eight/geometries/EllipticalCylinderGeometry');
import IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
import KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
import MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
import OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
import SurfaceGeometry = require('davinci-eight/geometries/SurfaceGeometry');
import PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
import RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
import SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
import TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
import TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
import VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
// programs
import shaderProgram = require('davinci-eight/programs/shaderProgram');
import smartProgram = require('davinci-eight/programs/smartProgram');
import programFromScripts = require('davinci-eight/programs/programFromScripts');
// resources
import Texture = require('davinci-eight/resources/Texture');
import VertexBuffer = require('davinci-eight/core/VertexBuffer');
// math
import Cartesian3 = require('davinci-eight/math/Cartesian3');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Quaternion = require('davinci-eight/math/Quaternion');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector1 = require('davinci-eight/math/Vector1');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
// mesh
import arrowMesh = require('davinci-eight/mesh/arrowMesh');
import ArrowBuilder = require('davinci-eight/mesh/ArrowBuilder');
import ArrowOptions = require('davinci-eight/mesh/ArrowOptions');

import boxMesh = require('davinci-eight/mesh/boxMesh');
import BoxBuilder = require('davinci-eight/mesh/BoxBuilder');
import BoxOptions = require('davinci-eight/mesh/BoxOptions');

import cylinderMesh = require('davinci-eight/mesh/cylinderMesh');
import CylinderArgs = require('davinci-eight/mesh/CylinderArgs');
import CylinderOptions = require('davinci-eight/mesh/CylinderOptions');
import CylinderMeshBuilder = require('davinci-eight/mesh/CylinderMeshBuilder');

import sphereMesh = require('davinci-eight/mesh/sphereMesh');
import SphereBuilder = require('davinci-eight/mesh/SphereBuilder');
import SphereOptions = require('davinci-eight/mesh/SphereOptions');

import vortexMesh = require('davinci-eight/mesh/vortexMesh');

// curves
import Curve = require('davinci-eight/curves/Curve');
// programs
import ShaderProgram = require('davinci-eight/core/ShaderProgram');
// renderers
import Renderer = require('davinci-eight/renderers/Renderer');
import RendererParameters = require('davinci-eight/renderers/RendererParameters');
import initWebGL = require('davinci-eight/renderers/initWebGL');
import renderer = require('davinci-eight/renderers/renderer');
// uniforms

// utils
import RenderingContextProxy    = require('davinci-eight/utils/RenderingContextProxy');
import contextProxy             = require('davinci-eight/utils/contextProxy');
import workbench3D                = require('davinci-eight/utils/workbench3D');
import WindowAnimationRunner      = require('davinci-eight/utils/WindowAnimationRunner');
import windowAnimationRunner      = require('davinci-eight/utils/windowAnimationRunner');

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
  get initWebGL() { return initWebGL; },
  get Node() { return Node; },
  get frustum() { return frustum; },
  get frustumMatrix() { return frustumMatrix; },
  get perspective() { return perspective; },
  get perspectiveMatrix() { return perspectiveMatrix; },
  get view() { return view; },
  get viewMatrix() { return viewMatrix; },
  get scene() { return scene; },
  get renderer() { return renderer; },
  get webgl() {return contextProxy;},
  workbench: workbench3D,
  animation: windowAnimationRunner,
  get DefaultAttribProvider() { return DefaultAttribProvider; },
  get primitive() { return primitive; },
  get DrawMode() { return DrawMode; },
  get AttribLocation() { return AttribLocation; },
  get UniformLocation() { return UniformLocation; },
  get shaderProgram() {
    return shaderProgram;
  },
  get smartProgram() {
    return smartProgram;
  },
  get Color() { return Color; },
  get Face3() { return Face3; },
  get Geometry() { return Geometry; },
  get GeometryAdapter() { return GeometryAdapter; },
  get ArrowGeometry() { return ArrowGeometry; },
  get BarnGeometry() { return BarnGeometry; },
  get BoxGeometry() { return BoxGeometry; },
  get CylinderGeometry() { return CylinderGeometry; },
  get DodecahedronGeometry() { return DodecahedronGeometry; },
  get EllipticalCylinderGeometry() { return EllipticalCylinderGeometry; },
  get IcosahedronGeometry() { return IcosahedronGeometry; },
  get KleinBottleGeometry() { return KleinBottleGeometry; },
  get MobiusStripGeometry() { return MobiusStripGeometry; },
  get OctahedronGeometry() { return OctahedronGeometry; },
  get SurfaceGeometry() { return SurfaceGeometry; },
  get PolyhedronGeometry() { return PolyhedronGeometry; },
  get RevolutionGeometry() { return RevolutionGeometry; },
  get SphereGeometry() { return SphereGeometry; },
  get TetrahedronGeometry() { return TetrahedronGeometry; },
  get TubeGeometry() { return TubeGeometry; },
  get VortexGeometry() { return VortexGeometry; },
  get Matrix3() { return Matrix3; },
  get Matrix4() { return Matrix4; },
  get Spinor3() { return Spinor3; },
  get Quaternion() { return Quaternion; },
  get Vector1() { return Vector1; },
  get Vector2() { return Vector2; },
  get Vector3() { return Vector3; },
  get Curve() { return Curve; },
  // mesh
  get arrowMesh() { return arrowMesh; },
  get ArrowBuilder() { return ArrowBuilder; },
  
  get boxMesh() { return boxMesh; },
  get BoxBuilder() { return BoxBuilder; },
  
  get CylinderArgs() { return CylinderArgs; },
  get cylinderMesh() { return cylinderMesh; },
  get CylinderMeshBuilder() { return CylinderMeshBuilder; },

  get sphereMesh() { return sphereMesh; },
  get SphereBuilder() { return SphereBuilder; },

  get vortexMesh() { return vortexMesh; },
  // programs
  get programFromScripts() { return programFromScripts; },
  // resources
  get Texture() { return Texture; },
  get VertexBuffer() { return VertexBuffer; },
};
export = eight;
