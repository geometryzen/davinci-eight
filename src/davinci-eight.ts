/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />

// cameras
import Frustum = require('davinci-eight/cameras/Frustum');
import frustum = require('davinci-eight/cameras/frustum');
import frustumMatrix = require('davinci-eight/cameras/frustumMatrix');
import Perspective = require('davinci-eight/cameras/Perspective');
import perspective = require('davinci-eight/cameras/perspective');
import perspectiveMatrix = require('davinci-eight/cameras/perspectiveMatrix');
import View = require('davinci-eight/cameras/View');
import view = require('davinci-eight/cameras/view');
import viewMatrix = require('davinci-eight/cameras/viewMatrix');
// core
import AttribMetaInfos = require('davinci-eight/core/AttribMetaInfos');
import AttribProvider = require('davinci-eight/core/AttribProvider');
import DefaultAttribProvider = require('davinci-eight/core/DefaultAttribProvider');
import Color = require('davinci-eight/core/Color');
import Composite = require('davinci-eight/core/Composite');
import DataUsage = require('davinci-eight/core/DataUsage');
import DrawMode = require('davinci-eight/core/DrawMode');
import Face3 = require('davinci-eight/core/Face3');
import Primitive = require('davinci-eight/core/Primitive');
import UniformMetaInfo = require('davinci-eight/core/UniformMetaInfo');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import core = require('davinci-eight/core');
import primitive = require('davinci-eight/objects/primitive');
import UniformProvider = require('davinci-eight/core/UniformProvider');
import DefaultUniformProvider = require('davinci-eight/core/DefaultUniformProvider');
import ShaderAttribLocation = require('davinci-eight/core/ShaderAttribLocation');
import ShaderUniformLocation = require('davinci-eight/core/ShaderUniformLocation');
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
import ParametricSurfaceGeometry = require('davinci-eight/geometries/ParametricSurfaceGeometry');
import PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
import RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
import SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
import TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
import TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
import VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
// programs
import shaderProgram = require('davinci-eight/programs/shaderProgram');
import smartProgram = require('davinci-eight/programs/smartProgram');
import shaderProgramFromScripts = require('davinci-eight/programs/shaderProgramFromScripts');
// math
import Cartesian3 = require('davinci-eight/math/Cartesian3');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Quaternion = require('davinci-eight/math/Quaternion');
import Spinor3 = require('davinci-eight/math/Spinor3');
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

// objects
import Blade = require('davinci-eight/objects/Blade');
import arrow = require('davinci-eight/objects/arrow');
import box = require('davinci-eight/objects/box');
import cylinder = require('davinci-eight/objects/cylinder');
import sphere = require('davinci-eight/objects/sphere');
import vortex = require('davinci-eight/objects/vortex');
import Curve = require('davinci-eight/curves/Curve');
// programs
import ShaderProgram = require('davinci-eight/core/ShaderProgram');
// renderers
import Renderer = require('davinci-eight/renderers/Renderer');
import RendererParameters = require('davinci-eight/renderers/RendererParameters');
import initWebGL = require('davinci-eight/renderers/initWebGL');
import renderer = require('davinci-eight/renderers/renderer');
// uniforms
import AmbientLight               = require('davinci-eight/uniforms/AmbientLight');
import ChainedUniformProvider     = require('davinci-eight/uniforms/ChainedUniformProvider');
import DirectionalLight           = require('davinci-eight/uniforms/DirectionalLight');
import LocalModel                 = require('davinci-eight/uniforms/LocalModel');
import Node                       = require('davinci-eight/uniforms/Node');
import TreeModel                  = require('davinci-eight/uniforms/TreeModel');
import UniversalJoint             = require('davinci-eight/uniforms/UniversalJoint');
import MultiUniformProvider       = require('davinci-eight/uniforms/MultiUniformProvider');
import PointLight                 = require('davinci-eight/uniforms/PointLight');
import uniforms                   = require('davinci-eight/uniforms/uniforms');
import UniformFloat               = require('davinci-eight/uniforms/UniformFloat');
import UniformMat4                = require('davinci-eight/uniforms/UniformMat4');
import UniformVec2                = require('davinci-eight/uniforms/UniformVec2');
import UniformVec3                = require('davinci-eight/uniforms/UniformVec3');
import UniformVec4                = require('davinci-eight/uniforms/UniformVec4');
import UniformVector3             = require('davinci-eight/uniforms/UniformVector3');
import UniformSpinor3             = require('davinci-eight/uniforms/UniformSpinor3');
// utils
import RenderingContextMonitor    = require('davinci-eight/utils/RenderingContextMonitor');
import contextMonitor             = require('davinci-eight/utils/contextMonitor');
import workbench3D                = require('davinci-eight/utils/workbench3D');
import WindowAnimationRunner      = require('davinci-eight/utils/WindowAnimationRunner');
import windowAnimationRunner      = require('davinci-eight/utils/windowAnimationRunner');

/*
import BoxMesh = require('davinci-eight/mesh/BoxMesh');
import CuboidMesh = require('davinci-eight/mesh/CuboidMesh');
import CurveMesh = require('davinci-eight/mesh/CurveMesh');
import EllipsoidMesh = require('davinci-eight/mesh/EllipsoidMesh');
import LatticeMesh = require('davinci-eight/mesh/LatticeMesh');
import box = require('davinci-eight/mesh/box');
import prism = require('davinci-eight/mesh/prism');
import cuboid = require('davinci-eight/mesh/cuboid');
import ellipsoid = require('davinci-eight/mesh/ellipsoid');
import RGBMesh = require('davinci-eight/mesh/RGBMesh');
*/

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
  get frustum() { return frustum; },
  get frustumMatrix() { return frustumMatrix; },
  get perspective() { return perspective; },
  get perspectiveMatrix() { return perspectiveMatrix; },
  get view() { return view; },
  get viewMatrix() { return viewMatrix; },
  get scene() { return scene; },
  get renderer() { return renderer; },
  get contextMonitor() {return contextMonitor;},
  workbench: workbench3D,
  animation: windowAnimationRunner,
  get DataUsage() { return DataUsage; },
  get DefaultAttribProvider() { return DefaultAttribProvider; },
  get DefaultUniformProvider() { return DefaultUniformProvider; },
  get primitive() { return primitive; },
  get DrawMode() { return DrawMode; },
  get ShaderAttribLocation() { return ShaderAttribLocation; },
  get ShaderUniformLocation() { return ShaderUniformLocation; },
  get shaderProgram() {
    return shaderProgram;
  },
  get smartProgram() {
    return smartProgram;
  },
  get AmbientLight() { return AmbientLight; },
  get DirectionalLight() { return DirectionalLight; },
  get PointLight() { return PointLight; },
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
  get ParametricSurfaceGeometry() { return ParametricSurfaceGeometry; },
  get PolyhedronGeometry() { return PolyhedronGeometry; },
  get RevolutionGeometry() { return RevolutionGeometry; },
  get SphereGeometry() { return SphereGeometry; },
  get TetrahedronGeometry() { return TetrahedronGeometry; },
  get TubeGeometry() { return TubeGeometry; },
  get VortexGeometry() { return VortexGeometry; },
  get LocalModel() { return LocalModel; },
  get Node() { return Node; },
  get TreeModel() { return TreeModel; },
  get UniversalJoint() { return UniversalJoint; },
  get UniformFloat() { return UniformFloat; },
  get UniformMat4() { return UniformMat4; },
  get UniformVec2() { return UniformVec2; },
  get UniformVec3() { return UniformVec3; },
  get UniformVec4() { return UniformVec4; },
  get UniformVector3() { return UniformVector3; },
  get UniformSpinor3() { return UniformSpinor3; },
  get Matrix3() { return Matrix3; },
  get Matrix4() { return Matrix4; },
  get Spinor3() { return Spinor3; },
  get Quaternion() { return Quaternion; },
  get Vector2() { return Vector2; },
  get Vector3() { return Vector3; },
  get Curve() { return Curve; },
  get ChainedUniformProvider() { return ChainedUniformProvider; },
  get MultiUniformProvider() { return MultiUniformProvider; },
  get uniforms() { return uniforms; },
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
  // objects
  get arrow() { return arrow; },
  get box() { return box; },
  get cylinder() { return cylinder; },
  get sphere() { return sphere; },
  get vortex() { return vortex; },
  // programs
  get shaderProgramFromScripts() { return shaderProgramFromScripts; },
  /*
  get box() { return box; },
  get BoxMesh() { return BoxMesh; },
  get cuboid() { return cuboid; },
  get ellipsoid() { return ellipsoid; },
  prism: prism,
  CurveMesh: CurveMesh,
  LatticeMesh: LatticeMesh,
  RGBMesh: RGBMesh,
  */
};
export = eight;
