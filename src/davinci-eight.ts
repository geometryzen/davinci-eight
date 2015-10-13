// slideshow
import Animator                = require('davinci-eight/slideshow/Animator')
import Director                = require('davinci-eight/slideshow/Director')
import Slide                   = require('davinci-eight/slideshow/Slide')
import Animation               = require('davinci-eight/slideshow/animations/Animation')
import ColorTo                 = require('davinci-eight/slideshow/animations/ColorTo')
import MoveTo                  = require('davinci-eight/slideshow/animations/MoveTo')
import SpinTo                  = require('davinci-eight/slideshow/animations/SpinTo')
import ColorTask               = require('davinci-eight/slideshow/tasks/ColorTask')
import CubeTask                = require('davinci-eight/slideshow/tasks/CubeTask')
import MoveTask                = require('davinci-eight/slideshow/tasks/MoveTask')
import SpinTask                = require('davinci-eight/slideshow/tasks/SpinTask')

// cameras
import createFrustum           = require('davinci-eight/cameras/createFrustum')
import createPerspective       = require('davinci-eight/cameras/createPerspective')
import createView              = require('davinci-eight/cameras/createView')
import Frustum                 = require('davinci-eight/cameras/Frustum')
import Perspective             = require('davinci-eight/cameras/Perspective')
import View                    = require('davinci-eight/cameras/View')
import frustumMatrix           = require('davinci-eight/cameras/frustumMatrix')
import perspectiveMatrix       = require('davinci-eight/cameras/perspectiveMatrix')
import viewMatrix              = require('davinci-eight/cameras/viewMatrix')
// commands
import WebGLBlendFunc          = require('davinci-eight/commands/WebGLBlendFunc')
import WebGLClearColor         = require('davinci-eight/commands/WebGLClearColor')
import WebGLDisable            = require('davinci-eight/commands/WebGLDisable')
import WebGLEnable             = require('davinci-eight/commands/WebGLEnable')
// core
import AttribLocation          = require('davinci-eight/core/AttribLocation')
import AttribMetaInfo          = require('davinci-eight/core/AttribMetaInfo')
import Color                   = require('davinci-eight/core/Color')
import core                    = require('davinci-eight/core')
import DrawMode                = require('davinci-eight/core/DrawMode')
import ContextController       = require('davinci-eight/core/ContextController')
import ContextKahuna           = require('davinci-eight/core/ContextKahuna')
import IContextConsumer        = require('davinci-eight/core/IContextConsumer')
import IContextProgramConsumer = require('davinci-eight/core/IContextProgramConsumer')
import IContextProvider        = require('davinci-eight/core/IContextProvider')
import IContextMonitor         = require('davinci-eight/core/IContextMonitor')
import Symbolic                = require('davinci-eight/core/Symbolic')
import IFacet                  = require('davinci-eight/core/IFacet')
import IFacetVisitor           = require('davinci-eight/core/IFacetVisitor')
import UniformLocation         = require('davinci-eight/core/UniformLocation')
import UniformMetaInfo         = require('davinci-eight/core/UniformMetaInfo')
// curves
import Curve                   = require('davinci-eight/curves/Curve')
// geometries
import GeometryAttribute       = require('davinci-eight/geometries/GeometryAttribute')
import GeometryData            = require('davinci-eight/geometries/GeometryData')
import Simplex                 = require('davinci-eight/geometries/Simplex')
import Vertex                  = require('davinci-eight/geometries/Vertex')
import toGeometryMeta          = require('davinci-eight/geometries/toGeometryMeta')
import GeometryMeta            = require('davinci-eight/geometries/GeometryMeta')
import computeFaceNormals      = require('davinci-eight/geometries/computeFaceNormals')
import cube                    = require('davinci-eight/geometries/cube')
import quadrilateral           = require('davinci-eight/geometries/quadrilateral')
import square                  = require('davinci-eight/geometries/square')
import tetrahedron             = require('davinci-eight/geometries/tetrahedron')
import toGeometryData          = require('davinci-eight/geometries/toGeometryData')
import triangle                = require('davinci-eight/geometries/triangle')

// scene
import createDrawList          = require('davinci-eight/scene/createDrawList')
import ICamera                 = require('davinci-eight/scene/ICamera')
import IDrawList               = require('davinci-eight/scene/IDrawList')
import Drawable                = require('davinci-eight/scene/Drawable')
import PerspectiveCamera       = require('davinci-eight/scene/PerspectiveCamera')
import Scene                   = require('davinci-eight/scene/Scene')
import Canvas3D                = require('davinci-eight/scene/Canvas3D')
// geometries
import GeometryElements        = require('davinci-eight/geometries/GeometryElements')
import ArrowGeometry           = require('davinci-eight/geometries/ArrowGeometry')
import BarnGeometry            = require('davinci-eight/geometries/BarnGeometry')
import CuboidGeometry          = require('davinci-eight/geometries/CuboidGeometry')
import CylinderGeometry        = require('davinci-eight/geometries/CylinderGeometry')
import DodecahedronGeometry    = require('davinci-eight/geometries/DodecahedronGeometry')
import IcosahedronGeometry     = require('davinci-eight/geometries/IcosahedronGeometry')
import KleinBottleGeometry     = require('davinci-eight/geometries/KleinBottleGeometry')
import Simplex1Geometry        = require('davinci-eight/geometries/Simplex1Geometry')
import MobiusStripGeometry     = require('davinci-eight/geometries/MobiusStripGeometry')
import OctahedronGeometry      = require('davinci-eight/geometries/OctahedronGeometry')
import SurfaceGeometry         = require('davinci-eight/geometries/SurfaceGeometry')
import PolyhedronGeometry      = require('davinci-eight/geometries/PolyhedronGeometry')
import RevolutionGeometry      = require('davinci-eight/geometries/RevolutionGeometry')
import SphereGeometry          = require('davinci-eight/geometries/SphereGeometry')
import TetrahedronGeometry     = require('davinci-eight/geometries/TetrahedronGeometry')
//import TubeGeometry          = require('davinci-eight/geometries/TubeGeometry')
import VortexGeometry          = require('davinci-eight/geometries/VortexGeometry')
// programs
import createMaterial          = require('davinci-eight/programs/createMaterial')
import smartProgram            = require('davinci-eight/programs/smartProgram')
import programFromScripts      = require('davinci-eight/programs/programFromScripts')

// materials
import Material                = require('davinci-eight/materials/Material')
import HTMLScriptsMaterial     = require('davinci-eight/materials/HTMLScriptsMaterial')
import LineMaterial            = require('davinci-eight/materials/LineMaterial')
import MeshMaterial            = require('davinci-eight/materials/MeshMaterial')
import MeshLambertMaterial     = require('davinci-eight/materials/MeshLambertMaterial')
import PointMaterial           = require('davinci-eight/materials/PointMaterial')
import SmartMaterialBuilder    = require('davinci-eight/materials/SmartMaterialBuilder')
// mappers
import RoundUniform            = require('davinci-eight/mappers/RoundUniform')
// math
import AbstractMatrix          = require('davinci-eight/math/AbstractMatrix')
import Cartesian1              = require('davinci-eight/math/Cartesian1')
import Cartesian2              = require('davinci-eight/math/Cartesian2')
import Cartesian3              = require('davinci-eight/math/Cartesian3')
import Cartesian4              = require('davinci-eight/math/Cartesian4')
import Complex                 = require('davinci-eight/math/Complex')
import DimensionError          = require('davinci-eight/math/DimensionError')
import Dimensions              = require('davinci-eight/math/Dimensions')
import Euclidean1              = require('davinci-eight/math/Euclidean1')
import Euclidean1Coords        = require('davinci-eight/math/Euclidean1Coords')
import Euclidean1Error         = require('davinci-eight/math/Euclidean1Error')
import Euclidean2              = require('davinci-eight/math/Euclidean2')
import Euclidean2Error         = require('davinci-eight/math/Euclidean2Error')
import Euclidean3              = require('davinci-eight/math/Euclidean3')
import Euclidean3Error         = require('davinci-eight/math/Euclidean3Error')
import Euler                   = require('davinci-eight/math/Euler')
import GeometricElement        = require('davinci-eight/math/GeometricElement')
import LinearElement           = require('davinci-eight/math/LinearElement')
import mathcore                = require('davinci-eight/math/mathcore')
import Matrix1                 = require('davinci-eight/math/Matrix1')
import Matrix2                 = require('davinci-eight/math/Matrix2')
import Matrix3                 = require('davinci-eight/math/Matrix3')
import Matrix4                 = require('davinci-eight/math/Matrix4')
import Measure                 = require('davinci-eight/math/Measure')
import Mutable                 = require('davinci-eight/math/Mutable')
import Rational                = require('davinci-eight/math/Rational')
import Spinor1                 = require('davinci-eight/math/Spinor1')
import Spinor1Coords           = require('davinci-eight/math/Spinor1Coords')
import Spinor2                 = require('davinci-eight/math/Spinor2')
import Spinor2Coords           = require('davinci-eight/math/Spinor2Coords')
import Spinor3                 = require('davinci-eight/math/Spinor3')
import Spinor3Coords           = require('davinci-eight/math/Spinor3Coords')
import Unit                    = require('davinci-eight/math/Unit')
import UnitError               = require('davinci-eight/math/UnitError')
import Vector1                 = require('davinci-eight/math/Vector1')
import Vector2                 = require('davinci-eight/math/Vector2')
import Vector3                 = require('davinci-eight/math/Vector3')
import Vector4                 = require('davinci-eight/math/Vector4')
import VectorN                 = require('davinci-eight/math/VectorN')
// mesh
import ArrowBuilder            = require('davinci-eight/mesh/ArrowBuilder')
import ArrowOptions            = require('davinci-eight/mesh/ArrowOptions')
import BoxOptions              = require('davinci-eight/mesh/BoxOptions')
import CylinderArgs            = require('davinci-eight/mesh/CylinderArgs')
import CylinderOptions         = require('davinci-eight/mesh/CylinderOptions')
import SphereOptions           = require('davinci-eight/mesh/SphereOptions')

// models
import EulerFacet              = require('davinci-eight/models/EulerFacet')
import ModelFacet              = require('davinci-eight/models/ModelFacet')

// programs
import IMaterial               = require('davinci-eight/core/IMaterial')
// renderers
import IContextRenderer        = require('davinci-eight/renderers/IContextRenderer')
import initWebGL               = require('davinci-eight/renderers/initWebGL')
import renderer                = require('davinci-eight/renderers/renderer')
// uniforms
import AmbientLight            = require('davinci-eight/uniforms/AmbientLight')
import ColorFacet              = require('davinci-eight/uniforms/ColorFacet')
import DirectionalLight        = require('davinci-eight/uniforms/DirectionalLight')
import SineWaveUniform         = require('davinci-eight/uniforms/SineWaveUniform')
import StockTicker             = require('davinci-eight/uniforms/StockTicker')
import Vector3Uniform          = require('davinci-eight/uniforms/Vector3Uniform')

// utils
import contextProxy            = require('davinci-eight/utils/contextProxy')
import Framerate               = require('davinci-eight/utils/Framerate')
import IUnknownArray           = require('davinci-eight/utils/IUnknownArray')
import loadImageTexture        = require('davinci-eight/utils/loadImageTexture')
import makeBox                 = require('davinci-eight/utils/makeBox')
import makeSphere              = require('davinci-eight/utils/makeSphere')
import NumberIUnknownMap       = require('davinci-eight/utils/NumberIUnknownMap')
import refChange               = require('davinci-eight/utils/refChange')
import Shareable               = require('davinci-eight/utils/Shareable')
import StringIUnknownMap       = require('davinci-eight/utils/StringIUnknownMap')
import workbench3D             = require('davinci-eight/utils/workbench3D')
import WindowAnimationRunner   = require('davinci-eight/utils/WindowAnimationRunner')
import windowAnimationRunner   = require('davinci-eight/utils/windowAnimationRunner')

/**
 * @module EIGHT
 */
var eight = {
  /**
   * The publish date of the latest version of the library.
   * @property LAST_MODIFIED
   * @type string
   * @readOnly
   */
  get LAST_MODIFIED() { return core.LAST_MODIFIED },

  get strict(): boolean {
    return core.strict
  },
  set strict(value: boolean) {
    core.strict = value
  },
  /**
   * The semantic version of the library.
   * @property VERSION
   * @type string
   * @readOnly
   */
  get VERSION() { return core.VERSION },
  // slideshow
  get Animator() { return Animator },
  get Director() { return Director },
  get Animation() { return Animation },
  get ColorTo() { return ColorTo },
  get MoveTo() { return MoveTo },
  get SpinTo() { return SpinTo },
  get ColorTask() { return ColorTask },
  get CubeTask() { return CubeTask },
  get MoveTask() { return MoveTask },
  get SpinTask() { return SpinTask },

  // TODO: Arrange in alphabetical order in order to assess width of API.
  // materials
  get HTMLScriptsMaterial() { return HTMLScriptsMaterial },
  get Material() { return Material },
  get LineMaterial() { return LineMaterial },
  get MeshMaterial() { return MeshMaterial },
  get MeshLambertMaterial() { return MeshLambertMaterial },
  get PointMaterial() { return PointMaterial },
  get SmartMaterialBuilder() { return SmartMaterialBuilder },
  //commands
  get WebGLBlendFunc() { return WebGLBlendFunc },
  get WebGLClearColor() { return WebGLClearColor },
  get WebGLDisable() { return WebGLDisable },
  get WebGLEnable() { return WebGLEnable },

  get initWebGL() { return initWebGL },
  get createFrustum() { return createFrustum },
  get createPerspective() { return createPerspective },
  get createView() { return createView },

  get EulerFacet() { return EulerFacet },
  get ModelFacet() { return ModelFacet },

  get Simplex() { return Simplex },
  get Vertex() { return Vertex },
  get frustumMatrix() { return frustumMatrix },
  get perspectiveMatrix() { return perspectiveMatrix },
  get viewMatrix() { return viewMatrix },
  get Scene() { return Scene },
  get Drawable() { return Drawable },
  get PerspectiveCamera() { return PerspectiveCamera },
  get Canvas3D() { return Canvas3D },
  get createDrawList() { return createDrawList },
  get renderer() { return renderer },
  get webgl() {return contextProxy},
  workbench: workbench3D,
  animation: windowAnimationRunner,
  get DrawMode() { return DrawMode },
  get AttribLocation() { return AttribLocation },
  get UniformLocation() { return UniformLocation },
  get createMaterial() {
    return createMaterial
  },
  get smartProgram() {
    return smartProgram
  },
  get Color() { return Color },
  get CompatcGeometry() { return GeometryElements },
  get ArrowGeometry() { return ArrowGeometry },
  get BarnGeometry() { return BarnGeometry },
  get CuboidGeometry() { return CuboidGeometry },
  get CylinderGeometry() { return CylinderGeometry },
  get DodecahedronGeometry() { return DodecahedronGeometry },
  get IcosahedronGeometry() { return IcosahedronGeometry },
  get KleinBottleGeometry() { return KleinBottleGeometry },
  get Simplex1Geometry() { return Simplex1Geometry },
  get MobiusStripGeometry() { return MobiusStripGeometry },
  get OctahedronGeometry() { return OctahedronGeometry },
  get SurfaceGeometry() { return SurfaceGeometry },
  get PolyhedronGeometry() { return PolyhedronGeometry },
  get RevolutionGeometry() { return RevolutionGeometry },
  get SphereGeometry() { return SphereGeometry },
  get TetrahedronGeometry() { return TetrahedronGeometry },
//  get TubeGeometry() { return TubeGeometry },
  get VortexGeometry() { return VortexGeometry },
  get Euclidean3() { return Euclidean3 },
  get Matrix3() { return Matrix3 },
  get Matrix4() { return Matrix4 },
  get Spinor3() { return Spinor3 },
  get Vector1() { return Vector1 },
  get Vector2() { return Vector2 },
  get Vector3() { return Vector3 },
  get Vector4() { return Vector4 },
  get VectorN() { return VectorN },
  get Curve() { return Curve },
  // mappers
  get RoundUniform() { return RoundUniform },
  // mesh
  get ArrowBuilder() { return ArrowBuilder },
  
  get toGeometryMeta() { return toGeometryMeta },
  get computeFaceNormals() { return computeFaceNormals },
  get cube() { return cube },
  get quadrilateral() { return quadrilateral },
  get square() { return square },
  get tetrahedron() { return tetrahedron },
  get triangle() { return triangle },
  get toGeometryData() { return toGeometryData },
  get CylinderArgs() { return CylinderArgs },

  get Symbolic() { return Symbolic },
  // programs
  get programFromScripts() { return programFromScripts },
  get GeometryAttribute() { return GeometryAttribute },
  get GeometryElements() { return GeometryElements },
  // uniforms
  get AmbientLight() { return AmbientLight },
  get ColorFacet() { return ColorFacet },
  get DirectionalLight() { return DirectionalLight },
  get SineWaveUniform() { return SineWaveUniform },
  get Vector3Uniform() { return Vector3Uniform },
  // utils
  get IUnknownArray() { return IUnknownArray },
  get NumberIUnknownMap() { return NumberIUnknownMap },
  get refChange() { return refChange },
  get Shareable() { return Shareable },
  get StringIUnknownMap() { return StringIUnknownMap }
}
export = eight
