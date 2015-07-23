/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />

// core
import UniformMetaInfo = require('davinci-eight/core/UniformMetaInfo');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import AttributeProvider = require('davinci-eight/core/AttributeProvider');
import AttributeMetaInfos = require('davinci-eight/core/AttributeMetaInfos');
import core = require('davinci-eight/core');
import Node3D = require('davinci-eight/core/Node3D');
import object3D = require('davinci-eight/core/object3D');
import view = require('davinci-eight/cameras/view');
import Color = require('davinci-eight/core/Color');
import View = require('davinci-eight/cameras/View');
import Frustum = require('davinci-eight/cameras/Frustum');
import LinearPerspectiveCamera = require('davinci-eight/cameras/LinearPerspectiveCamera');
import frustum = require('davinci-eight/cameras/frustum');
import perspective = require('davinci-eight/cameras/perspective');
import world = require('davinci-eight/worlds/world');
import World = require('davinci-eight/worlds/World');
import viewport = require('davinci-eight/renderers/viewport');
import drawableModel = require('davinci-eight/objects/drawableModel');
import UniformProvider = require('davinci-eight/core/UniformProvider');
import Face3 = require('davinci-eight/core/Face3');
// geometries
import Geometry = require('davinci-eight/geometries/Geometry');
import GeometryAdapter = require('davinci-eight/geometries/GeometryAdapter');
import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
import BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
import DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
import IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
import KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
import MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
import OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
import ParametricGeometry = require('davinci-eight/geometries/ParametricGeometry');
import PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
import RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
import SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
import TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
import TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
import VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
// programs
import pointsProgram = require('davinci-eight/programs/pointsProgram');
import shaderProgram = require('davinci-eight/programs/shaderProgram');
import smartProgram = require('davinci-eight/programs/smartProgram');
import ShaderAttributeVariable = require('davinci-eight/core/ShaderAttributeVariable');
import ShaderUniformVariable = require('davinci-eight/core/ShaderUniformVariable');
// math
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
// mesh
import arrowMesh = require('davinci-eight/mesh/arrowMesh');
import boxMesh = require('davinci-eight/mesh/boxMesh');
// objects
import box = require('davinci-eight/objects/box');
import DrawableModel = require('davinci-eight/objects/DrawableModel');
import Curve = require('davinci-eight/curves/Curve');
import ShaderProgram = require('davinci-eight/programs/ShaderProgram');
// renderers
import Viewport = require('davinci-eight/renderers/Viewport');
import ViewportParameters = require('davinci-eight/renderers/ViewportParameters');
import initWebGL = require('davinci-eight/renderers/initWebGL');
// uniforms
import AmbientLight               = require('davinci-eight/uniforms/AmbientLight');
import ChainedUniformProvider     = require('davinci-eight/uniforms/ChainedUniformProvider');
import DefaultUniformProvider     = require('davinci-eight/uniforms/DefaultUniformProvider');
import ModelMatrixUniformProvider = require('davinci-eight/uniforms/ModelMatrixUniformProvider');
import Uniform2fvProvider         = require('davinci-eight/uniforms/Uniform2fvProvider');
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
  get view() { return view; },
  get frustum() { return frustum; },
  get perspective() { return perspective; },
  get world() { return world; },
  object3D: object3D,
  get viewport() { return viewport; },
  get contextMonitor() {return contextMonitor;},
  workbench: workbench3D,
  animationRunner: windowAnimationRunner,
  get drawableModel() { return drawableModel; },
  get ShaderAttributeVariable() { return ShaderAttributeVariable; },
  get ShaderUniformVariable() { return ShaderUniformVariable; },
  get pointsProgram() {
    return pointsProgram;
  },
  get shaderProgram() {
    return shaderProgram;
  },
  get smartProgram() {
    return smartProgram;
  },
  get AmbientLight() { return AmbientLight; },
  get Color() { return Color; },
  get Face3() { return Face3; },
  get Geometry() { return Geometry; },
  get GeometryAdapter() { return GeometryAdapter; },
  get ArrowGeometry() { return ArrowGeometry; },
  get BoxGeometry() { return BoxGeometry; },
  get CylinderGeometry() { return CylinderGeometry; },
  get DodecahedronGeometry() { return DodecahedronGeometry; },
  get IcosahedronGeometry() { return IcosahedronGeometry; },
  get KleinBottleGeometry() { return KleinBottleGeometry; },
  get MobiusStripGeometry() { return MobiusStripGeometry; },
  get OctahedronGeometry() { return OctahedronGeometry; },
  get ParametricGeometry() { return ParametricGeometry; },
  get PolyhedronGeometry() { return PolyhedronGeometry; },
  get RevolutionGeometry() { return RevolutionGeometry; },
  get SphereGeometry() { return SphereGeometry; },
  get TetrahedronGeometry() { return TetrahedronGeometry; },
  get TubeGeometry() { return TubeGeometry; },
  get VortexGeometry() { return VortexGeometry; },
  get ModelMatrixUniformProvider() { return ModelMatrixUniformProvider; },
  get Uniform2fvProvider() { return Uniform2fvProvider; },
  get Matrix3() { return Matrix3; },
  get Matrix4() { return Matrix4; },
  get Spinor3() { return Spinor3; },
  get Vector2() { return Vector2; },
  get Vector3() { return Vector3; },
  get Curve() { return Curve; },
  get ChainedUniformProvider() { return ChainedUniformProvider; },
  get DefaultUniformProvider() { return DefaultUniformProvider; },
  // mesh
  get arrowMesh() { return arrowMesh; },
  get boxMesh() { return boxMesh; },
  // objects
  get box() { return box; },

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
