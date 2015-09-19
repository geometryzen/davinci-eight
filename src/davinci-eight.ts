/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />

// cameras
import createFrustum           = require('davinci-eight/cameras/createFrustum');
import createPerspective       = require('davinci-eight/cameras/createPerspective');
import createView              = require('davinci-eight/cameras/createView');
import Frustum                 = require('davinci-eight/cameras/Frustum');
import Perspective             = require('davinci-eight/cameras/Perspective');
import View                    = require('davinci-eight/cameras/View');
import frustumMatrix           = require('davinci-eight/cameras/frustumMatrix');
import perspectiveMatrix       = require('davinci-eight/cameras/perspectiveMatrix');
import viewMatrix              = require('davinci-eight/cameras/viewMatrix');
// commands
import WebGLClear              = require('davinci-eight/commands/WebGLClear')
import WebGLClearColor         = require('davinci-eight/commands/WebGLClearColor')
import WebGLEnable             = require('davinci-eight/commands/WebGLEnable')
// core
import AttribLocation          = require('davinci-eight/core/AttribLocation');
import AttribMetaInfos         = require('davinci-eight/core/AttribMetaInfos');
import Color                   = require('davinci-eight/core/Color');
import core                    = require('davinci-eight/core');
import DrawMode                = require('davinci-eight/core/DrawMode');
import Face3                   = require('davinci-eight/core/Face3');
import ContextController       = require('davinci-eight/core/ContextController');
import ContextKahuna           = require('davinci-eight/core/ContextKahuna');
import ContextManager          = require('davinci-eight/core/ContextManager');
import ContextMonitor          = require('davinci-eight/core/ContextMonitor');
import Symbolic                = require('davinci-eight/core/Symbolic');
import UniformData             = require('davinci-eight/core/UniformData');
import UniformDataVisitor      = require('davinci-eight/core/UniformDataVisitor');
import UniformMetaInfo         = require('davinci-eight/core/UniformMetaInfo');
import UniformMetaInfos        = require('davinci-eight/core/UniformMetaInfos');
import UniformLocation         = require('davinci-eight/core/UniformLocation');
import UniformProvider         = require('davinci-eight/core/UniformProvider');
// curves
import Curve = require('davinci-eight/curves/Curve');
// dfx
import DrawAttribute = require('davinci-eight/dfx/DrawAttribute');
import DrawElements = require('davinci-eight/dfx/DrawElements');
import Simplex = require('davinci-eight/dfx/Simplex');
import Vertex = require('davinci-eight/dfx/Vertex');
import checkGeometry = require('davinci-eight/dfx/checkGeometry');
import GeometryInfo = require('davinci-eight/dfx/GeometryInfo');
import computeFaceNormals = require('davinci-eight/dfx/computeFaceNormals');
import cube = require('davinci-eight/dfx/cube');
import quadrilateral = require('davinci-eight/dfx/quadrilateral');
import square = require('davinci-eight/dfx/square');
import tetrahedron = require('davinci-eight/dfx/tetrahedron');
import toDrawElements = require('davinci-eight/dfx/toDrawElements');
import triangle = require('davinci-eight/dfx/triangle');

// scene
import createDrawList     = require('davinci-eight/scene/createDrawList');
import ICamera            = require('davinci-eight/scene/ICamera');
import IDrawList          = require('davinci-eight/scene/IDrawList');
import Mesh               = require('davinci-eight/scene/Mesh');
import PerspectiveCamera = require('davinci-eight/scene/PerspectiveCamera');
import Scene = require('davinci-eight/scene/Scene');
import WebGLRenderer = require('davinci-eight/scene/WebGLRenderer');
// geometries
import Geometry = require('davinci-eight/geometries/Geometry');
//import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
//import BarnGeometry = require('davinci-eight/geometries/BarnGeometry');
import BoxComplex  = require('davinci-eight/geometries/BoxComplex');
import BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
//import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
//import DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
//import EllipticalCylinderGeometry = require('davinci-eight/geometries/EllipticalCylinderGeometry');
//import IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
//import KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
//import MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
//import OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
//import SurfaceGeometry = require('davinci-eight/geometries/SurfaceGeometry');
//import PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
//import RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
//import SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
//import TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
//import TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
//import VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
// programs
import shaderProgram = require('davinci-eight/programs/shaderProgram');
import smartProgram = require('davinci-eight/programs/smartProgram');
import programFromScripts = require('davinci-eight/programs/programFromScripts');

// materials
import Material            = require('davinci-eight/materials/Material');
import HTMLScriptsMaterial = require('davinci-eight/materials/HTMLScriptsMaterial');
import MeshNormalMaterial  = require('davinci-eight/materials/MeshNormalMaterial');
// mappers
import RoundUniform = require('davinci-eight/mappers/RoundUniform');
// math
import Cartesian3 = require('davinci-eight/math/Cartesian3');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Quaternion = require('davinci-eight/math/Quaternion');
import Rotor3 = require('davinci-eight/math/Rotor3');
import rotor3 = require('davinci-eight/math/rotor3');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector1 = require('davinci-eight/math/Vector1');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
import Vector4 = require('davinci-eight/math/Vector4');
import VectorN = require('davinci-eight/math/VectorN');
// mesh
import ArrowBuilder = require('davinci-eight/mesh/ArrowBuilder');
import ArrowOptions = require('davinci-eight/mesh/ArrowOptions');
import BoxOptions = require('davinci-eight/mesh/BoxOptions');
import CylinderArgs = require('davinci-eight/mesh/CylinderArgs');
import CylinderOptions = require('davinci-eight/mesh/CylinderOptions');
import SphereOptions = require('davinci-eight/mesh/SphereOptions');

// programs
import IProgram = require('davinci-eight/core/IProgram');
// renderers
import ContextRenderer = require('davinci-eight/renderers/ContextRenderer');
import initWebGL = require('davinci-eight/renderers/initWebGL');
import renderer = require('davinci-eight/renderers/renderer');
// uniforms
import SineWaveUniform            = require('davinci-eight/uniforms/SineWaveUniform');
import StockTicker                = require('davinci-eight/uniforms/StockTicker');

// utils
import contextProxy               = require('davinci-eight/utils/contextProxy');
import Framerate                  = require('davinci-eight/utils/Framerate');
import loadImageTexture           = require('davinci-eight/utils/loadImageTexture');
import makeBox                    = require('davinci-eight/utils/makeBox');
import makeSphere                 = require('davinci-eight/utils/makeSphere');
import Model                      = require('davinci-eight/utils/Model');
import refChange                  = require('davinci-eight/utils/refChange');
import Shareable           = require('davinci-eight/utils/Shareable');
import workbench3D                = require('davinci-eight/utils/workbench3D');
import WindowAnimationRunner      = require('davinci-eight/utils/WindowAnimationRunner');
import windowAnimationRunner      = require('davinci-eight/utils/windowAnimationRunner');

/**
 * @module EIGHT
 */
var eight = {
  /**
   * The publish date of the latest version of the library.
   * @property LAST_MODIFIED
   * @type string
   */
  get LAST_MODIFIED() { return core.LAST_MODIFIED; },
  /**
   * The semantic version of the library.
   * @property VERSION
   * @type string
   */
  get VERSION() { return core.VERSION; },
  // TODO: Arrange in alphabetical order in order to assess width of API.
  // materials
  get HTMLScriptsMaterial() { return HTMLScriptsMaterial; },
  get Material() { return Material; },
  get MeshNormalMaterial() { return MeshNormalMaterial; },
  //commands
  get WebGLClear() { return WebGLClear; },
  get WebGLClearColor() { return WebGLClearColor; },
  get WebGLEnable() { return WebGLEnable; },

  get initWebGL() { return initWebGL; },
  get createFrustum() { return createFrustum; },
  get createPerspective() { return createPerspective; },
  get createView() { return createView; },
  get Model() { return Model; },
  get Simplex() { return Simplex; },
  get Vertex() { return Vertex; },
  get frustumMatrix() { return frustumMatrix; },
  get perspectiveMatrix() { return perspectiveMatrix; },
  get viewMatrix() { return viewMatrix; },
  get Scene() { return Scene; },
  get Mesh() { return Mesh; },
  get PerspectiveCamera() { return PerspectiveCamera; },
  get WebGLRenderer() { return WebGLRenderer; },
  get createDrawList() { return createDrawList; },
  get renderer() { return renderer; },
  get webgl() {return contextProxy;},
  workbench: workbench3D,
  animation: windowAnimationRunner,
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
//  get ArrowGeometry() { return ArrowGeometry; },
//  get BarnGeometry() { return BarnGeometry; },
  get BoxComplex() { return BoxComplex; },
  get BoxGeometry() { return BoxGeometry; },
//  get CylinderGeometry() { return CylinderGeometry; },
//  get DodecahedronGeometry() { return DodecahedronGeometry; },
//  get EllipticalCylinderGeometry() { return EllipticalCylinderGeometry; },
//  get IcosahedronGeometry() { return IcosahedronGeometry; },
//  get KleinBottleGeometry() { return KleinBottleGeometry; },
//  get MobiusStripGeometry() { return MobiusStripGeometry; },
//  get OctahedronGeometry() { return OctahedronGeometry; },
//  get SurfaceGeometry() { return SurfaceGeometry; },
//  get PolyhedronGeometry() { return PolyhedronGeometry; },
//  get RevolutionGeometry() { return RevolutionGeometry; },
//  get SphereGeometry() { return SphereGeometry; },
//  get TetrahedronGeometry() { return TetrahedronGeometry; },
//  get TubeGeometry() { return TubeGeometry; },
//  get VortexGeometry() { return VortexGeometry; },
  get Matrix3() { return Matrix3; },
  get Matrix4() { return Matrix4; },
  get rotor3() { return rotor3; },
  get Spinor3() { return Spinor3; },
  get Quaternion() { return Quaternion; },
  get Vector1() { return Vector1; },
  get Vector2() { return Vector2; },
  get Vector3() { return Vector3; },
  get Vector4() { return Vector4; },
  get VectorN() { return VectorN; },
  get Curve() { return Curve; },
  // mappers
  get RoundUniform() { return RoundUniform },
  // mesh
  get ArrowBuilder() { return ArrowBuilder; },
  
  get checkGeometry() { return checkGeometry; },
  get computeFaceNormals() { return computeFaceNormals; },
  get cube() { return cube; },
  get quadrilateral() { return quadrilateral; },
  get square() { return square; },
  get tetrahedron() { return tetrahedron; },
  get triangle() { return triangle; },
  get toDrawElements() { return toDrawElements; },
  get CylinderArgs() { return CylinderArgs; },

  get Symbolic() { return Symbolic; },
  // programs
  get programFromScripts() { return programFromScripts; },
  get DrawAttribute() { return DrawAttribute; },
  get DrawElements() { return DrawElements; },
  // uniforms
  get SineWaveUniform() { return SineWaveUniform; },
  // utils
  get refChange() { return refChange; },
  get Shareable() { return Shareable; }
};
export = eight;
