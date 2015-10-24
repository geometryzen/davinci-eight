// slideshow
import Slide = require('davinci-eight/slideshow/Slide')
import Director = require('davinci-eight/slideshow/Director')
import DirectorKeyboardHandler = require('davinci-eight/slideshow/DirectorKeyboardHandler')
import WaitAnimation = require('davinci-eight/slideshow/animations/WaitAnimation')
import ColorAnimation = require('davinci-eight/slideshow/animations/ColorAnimation')
import Vector3Animation = require('davinci-eight/slideshow/animations/Vector3Animation')
import Spinor3Animation = require('davinci-eight/slideshow/animations/Spinor3Animation')

import AnimateDrawableCommand = require('davinci-eight/slideshow/commands/AnimateDrawableCommand')
import CreateCuboidDrawable = require('davinci-eight/slideshow/commands/CreateCuboidDrawable')
import DestroyDrawableCommand = require('davinci-eight/slideshow/commands/DestroyDrawableCommand')
import GeometryCommand = require('davinci-eight/slideshow/commands/TestCommand')
import TestCommand = require('davinci-eight/slideshow/commands/TestCommand')
import UseDrawableInSceneCommand = require('davinci-eight/slideshow/commands/UseDrawableInSceneCommand')

// cameras
import createFrustum = require('davinci-eight/cameras/createFrustum')
import createPerspective = require('davinci-eight/cameras/createPerspective')
import createView = require('davinci-eight/cameras/createView')
import Frustum = require('davinci-eight/cameras/Frustum')
import Perspective = require('davinci-eight/cameras/Perspective')
import View = require('davinci-eight/cameras/View')
import frustumMatrix = require('davinci-eight/cameras/frustumMatrix')
import perspectiveMatrix = require('davinci-eight/cameras/perspectiveMatrix')
import viewMatrix = require('davinci-eight/cameras/viewMatrix')
// commands
import WebGLBlendFunc = require('davinci-eight/commands/WebGLBlendFunc')
import WebGLClearColor = require('davinci-eight/commands/WebGLClearColor')
import WebGLDisable = require('davinci-eight/commands/WebGLDisable')
import WebGLEnable = require('davinci-eight/commands/WebGLEnable')
// core
import AttribLocation = require('davinci-eight/core/AttribLocation')
import AttribMetaInfo = require('davinci-eight/core/AttribMetaInfo')
import Color = require('davinci-eight/core/Color')
import core = require('davinci-eight/core')
import DrawMode = require('davinci-eight/core/DrawMode')
import ContextController = require('davinci-eight/core/ContextController')
import ContextKahuna = require('davinci-eight/core/ContextKahuna')
import IContextConsumer = require('davinci-eight/core/IContextConsumer')
import IContextProgramConsumer = require('davinci-eight/core/IContextProgramConsumer')
import IContextProvider = require('davinci-eight/core/IContextProvider')
import IContextMonitor = require('davinci-eight/core/IContextMonitor')
import Symbolic = require('davinci-eight/core/Symbolic')
import IFacet = require('davinci-eight/core/IFacet')
import IFacetVisitor = require('davinci-eight/core/IFacetVisitor')
import UniformLocation = require('davinci-eight/core/UniformLocation')
import UniformMetaInfo = require('davinci-eight/core/UniformMetaInfo')
// curves
import Curve = require('davinci-eight/curves/Curve')
// devices
import Keyboard = require('davinci-eight/devices/Keyboard')
// geometries
import DrawAttribute = require('davinci-eight/geometries/DrawAttribute')
import DrawPrimitive = require('davinci-eight/geometries/DrawPrimitive')
import Simplex = require('davinci-eight/geometries/Simplex')
import Vertex = require('davinci-eight/geometries/Vertex')
import simplicesToGeometryMeta = require('davinci-eight/geometries/simplicesToGeometryMeta')
import GeometryMeta = require('davinci-eight/geometries/GeometryMeta')
import computeFaceNormals = require('davinci-eight/geometries/computeFaceNormals')
import cube = require('davinci-eight/geometries/cube')
import quadrilateral = require('davinci-eight/geometries/quadrilateral')
import square = require('davinci-eight/geometries/square')
import tetrahedron = require('davinci-eight/geometries/tetrahedron')
import simplicesToDrawPrimitive = require('davinci-eight/geometries/simplicesToDrawPrimitive')
import triangle = require('davinci-eight/geometries/triangle')
// topologies
import Topology = require('davinci-eight/topologies/Topology')
import PointTopology = require('davinci-eight/topologies/PointTopology')
import LineTopology = require('davinci-eight/topologies/LineTopology')
import MeshTopology = require('davinci-eight/topologies/MeshTopology')
import GridTopology = require('davinci-eight/topologies/GridTopology')
// scene
import createDrawList = require('davinci-eight/scene/createDrawList')
import IDrawList = require('davinci-eight/scene/IDrawList')
import Drawable = require('davinci-eight/scene/Drawable')
import PerspectiveCamera = require('davinci-eight/scene/PerspectiveCamera')
import Scene = require('davinci-eight/scene/Scene')
import Canvas3D = require('davinci-eight/scene/Canvas3D')
// geometries
import AxialSimplexGeometry = require('davinci-eight/geometries/AxialSimplexGeometry')
import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry')
import ArrowSimplexGeometry = require('davinci-eight/geometries/ArrowSimplexGeometry')
import BarnSimplexGeometry = require('davinci-eight/geometries/BarnSimplexGeometry')
import ConeGeometry = require('davinci-eight/geometries/ConeGeometry')
import ConeSimplexGeometry = require('davinci-eight/geometries/ConeSimplexGeometry')
import CuboidGeometry = require('davinci-eight/geometries/CuboidGeometry')
import CuboidSimplexGeometry = require('davinci-eight/geometries/CuboidSimplexGeometry')
import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry')
import CylinderSimplexGeometry = require('davinci-eight/geometries/CylinderSimplexGeometry')
import DodecahedronSimplexGeometry = require('davinci-eight/geometries/DodecahedronSimplexGeometry')
import IcosahedronSimplexGeometry = require('davinci-eight/geometries/IcosahedronSimplexGeometry')
import KleinBottleSimplexGeometry = require('davinci-eight/geometries/KleinBottleSimplexGeometry')
import Simplex1Geometry = require('davinci-eight/geometries/Simplex1Geometry')
import MobiusStripSimplexGeometry = require('davinci-eight/geometries/MobiusStripSimplexGeometry')
import OctahedronSimplexGeometry = require('davinci-eight/geometries/OctahedronSimplexGeometry')
import SliceSimplexGeometry = require('davinci-eight/geometries/SliceSimplexGeometry')
import GridSimplexGeometry = require('davinci-eight/geometries/GridSimplexGeometry')
import PolyhedronSimplexGeometry = require('davinci-eight/geometries/PolyhedronSimplexGeometry')
import RevolutionSimplexGeometry = require('davinci-eight/geometries/RevolutionSimplexGeometry')
import RingGeometry = require('davinci-eight/geometries/RingGeometry')
import RingSimplexGeometry = require('davinci-eight/geometries/RingSimplexGeometry')
import SphericalPolarSimplexGeometry = require('davinci-eight/geometries/SphericalPolarSimplexGeometry')
import TetrahedronSimplexGeometry = require('davinci-eight/geometries/TetrahedronSimplexGeometry')
//import TubeSimplexGeometry          = require('davinci-eight/geometries/TubeSimplexGeometry')
import VortexSimplexGeometry = require('davinci-eight/geometries/VortexSimplexGeometry')
import arc3 = require('davinci-eight/geometries/arc3')
// programs
import createMaterial = require('davinci-eight/programs/createMaterial')
import smartProgram = require('davinci-eight/programs/smartProgram')
import programFromScripts = require('davinci-eight/programs/programFromScripts')

// materials
import Material = require('davinci-eight/materials/Material')
import HTMLScriptsMaterial = require('davinci-eight/materials/HTMLScriptsMaterial')
import LineMaterial = require('davinci-eight/materials/LineMaterial')
import MeshMaterial = require('davinci-eight/materials/MeshMaterial')
import MeshLambertMaterial = require('davinci-eight/materials/MeshLambertMaterial')
import PointMaterial = require('davinci-eight/materials/PointMaterial')
import SmartMaterialBuilder = require('davinci-eight/materials/SmartMaterialBuilder')
// mappers
import RoundUniform = require('davinci-eight/mappers/RoundUniform')
// math
import AbstractMatrix = require('davinci-eight/math/AbstractMatrix')
import VectorE1 = require('davinci-eight/math/VectorE1')
import VectorE2 = require('davinci-eight/math/VectorE2')
import VectorE3 = require('davinci-eight/math/VectorE3')
import VectorE4 = require('davinci-eight/math/VectorE4')
import Complex = require('davinci-eight/math/Complex')
import DimensionError = require('davinci-eight/math/DimensionError')
import Dimensions = require('davinci-eight/math/Dimensions')
import Euclidean1 = require('davinci-eight/math/Euclidean1')
import Euclidean1Coords = require('davinci-eight/math/Euclidean1Coords')
import Euclidean1Error = require('davinci-eight/math/Euclidean1Error')
import Euclidean2 = require('davinci-eight/math/Euclidean2')
import Euclidean2Error = require('davinci-eight/math/Euclidean2Error')
import Euclidean3 = require('davinci-eight/math/Euclidean3')
import Euclidean3Error = require('davinci-eight/math/Euclidean3Error')
import Euler = require('davinci-eight/math/Euler')
import GeometricElement = require('davinci-eight/math/GeometricElement')
import LinearElement = require('davinci-eight/math/LinearElement')
import mathcore = require('davinci-eight/math/mathcore')
import MutableNumber = require('davinci-eight/math/MutableNumber')
import Matrix2 = require('davinci-eight/math/Matrix2')
import Matrix3 = require('davinci-eight/math/Matrix3')
import Matrix4 = require('davinci-eight/math/Matrix4')
import Measure = require('davinci-eight/math/Measure')
import Mutable = require('davinci-eight/math/Mutable')
import Rational = require('davinci-eight/math/Rational')
import SpinorE1 = require('davinci-eight/math/SpinorE1')
import SpinorE2 = require('davinci-eight/math/SpinorE2')
import SpinorE3 = require('davinci-eight/math/SpinorE3')
import Unit = require('davinci-eight/math/Unit')
import UnitError = require('davinci-eight/math/UnitError')
import G3 = require('davinci-eight/math/G3')
import MutableSpinorE2 = require('davinci-eight/math/MutableSpinorE2')
import MutableSpinorE3 = require('davinci-eight/math/MutableSpinorE3')
import MutableVectorE2 = require('davinci-eight/math/MutableVectorE2')
import MutableVectorE3 = require('davinci-eight/math/MutableVectorE3')
import MutableVectorE4 = require('davinci-eight/math/MutableVectorE4')
import VectorN = require('davinci-eight/math/VectorN')
import MutableQuaternion = require('davinci-eight/math/MutableQuaternion')

// models
import EulerFacet = require('davinci-eight/models/EulerFacet')
import KinematicRigidBodyFacetE3 = require('davinci-eight/models/KinematicRigidBodyFacetE3')
import ModelFacet = require('davinci-eight/models/ModelFacet')

// programs
import IMaterial = require('davinci-eight/core/IMaterial')
// renderers
import IContextRenderer = require('davinci-eight/renderers/IContextRenderer')
import initWebGL = require('davinci-eight/renderers/initWebGL')
import renderer = require('davinci-eight/renderers/renderer')
// uniforms
import AmbientLight = require('davinci-eight/uniforms/AmbientLight')
import ColorFacet = require('davinci-eight/uniforms/ColorFacet')
import DirectionalLight = require('davinci-eight/uniforms/DirectionalLight')
import PointSize = require('davinci-eight/uniforms/PointSize')
import Vector3Uniform = require('davinci-eight/uniforms/Vector3Uniform')

// utils
import contextProxy = require('davinci-eight/utils/contextProxy')
import Framerate = require('davinci-eight/utils/Framerate')
import IUnknownArray = require('davinci-eight/collections/IUnknownArray')
import loadImageTexture = require('davinci-eight/utils/loadImageTexture')
import makeBox = require('davinci-eight/utils/makeBox')
import makeSphere = require('davinci-eight/utils/makeSphere')
import NumberIUnknownMap = require('davinci-eight/collections/NumberIUnknownMap')
import refChange = require('davinci-eight/utils/refChange')
import Shareable = require('davinci-eight/utils/Shareable')
import StringIUnknownMap = require('davinci-eight/collections/StringIUnknownMap')
import workbench3D = require('davinci-eight/utils/workbench3D')
import WindowAnimationRunner = require('davinci-eight/utils/WindowAnimationRunner')
import windowAnimationRunner = require('davinci-eight/utils/windowAnimationRunner')

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
    get Slide() { return Slide },
    get Director() { return Director },
    get DirectorKeyboardHandler() { return DirectorKeyboardHandler },
    get ColorAnimation() { return ColorAnimation },
    get WaitAnimation() { return WaitAnimation },
    get Vector3Animation() { return Vector3Animation },
    get Spinor3Animation() { return Spinor3Animation },
    get AnimateDrawableCommand() { return AnimateDrawableCommand },
    get CreateCuboidDrawable() { return CreateCuboidDrawable },
    get DestroyDrawableCommand() { return DestroyDrawableCommand },
    get GeometryCommand() { return GeometryCommand },
    get TestCommand() { return TestCommand },
    get UseDrawableInSceneCommand() { return UseDrawableInSceneCommand },

    // devices
    get Keyboard() { return Keyboard },

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
    get KinematicRigidBodyFacetE3() { return KinematicRigidBodyFacetE3 },
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
    get webgl() { return contextProxy },
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
    get AxialSimplexGeometry() { return AxialSimplexGeometry },
    get ArrowGeometry() { return ArrowGeometry },
    get ArrowSimplexGeometry() { return ArrowSimplexGeometry },
    get BarnSimplexGeometry() { return BarnSimplexGeometry },
    get ConeGeometry() { return ConeGeometry },
    get ConeSimplexGeometry() { return ConeSimplexGeometry },
    get CuboidGeometry() { return CuboidGeometry },
    get CuboidSimplexGeometry() { return CuboidSimplexGeometry },
    get CylinderGeometry() { return CylinderGeometry },
    get CylinderSimplexGeometry() { return CylinderSimplexGeometry },
    get DodecahedronSimplexGeometry() { return DodecahedronSimplexGeometry },
    get IcosahedronSimplexGeometry() { return IcosahedronSimplexGeometry },
    get KleinBottleSimplexGeometry() { return KleinBottleSimplexGeometry },
    get Simplex1Geometry() { return Simplex1Geometry },
    get MobiusStripSimplexGeometry() { return MobiusStripSimplexGeometry },
    get OctahedronSimplexGeometry() { return OctahedronSimplexGeometry },
    get GridSimplexGeometry() { return GridSimplexGeometry },
    get PolyhedronSimplexGeometry() { return PolyhedronSimplexGeometry },
    get RevolutionSimplexGeometry() { return RevolutionSimplexGeometry },
    get RingGeometry() { return RingGeometry },
    get RingSimplexGeometry() { return RingSimplexGeometry },
    get SliceSimplexGeometry() { return SliceSimplexGeometry },
    get SphericalPolarSimplexGeometry() { return SphericalPolarSimplexGeometry },
    get TetrahedronSimplexGeometry() { return TetrahedronSimplexGeometry },
    get VortexSimplexGeometry() { return VortexSimplexGeometry },
    get Topology() { return Topology },
    get PointTopology() { return PointTopology },
    get LineTopology() { return LineTopology },
    get MeshTopology() { return MeshTopology },
    get GridTopology() { return GridTopology },

    get Euclidean3() { return Euclidean3 },
    get Matrix3() { return Matrix3 },
    get Matrix4() { return Matrix4 },
    get G3() { return G3 },
    get MutableNumber() { return MutableNumber },
    get MutableSpinorE3() { return MutableSpinorE3 },
    get MutableVectorE2() { return MutableVectorE2 },
    get MutableVectorE3() { return MutableVectorE3 },
    get MutableVectorE4() { return MutableVectorE4 },
    get VectorN() { return VectorN },
    get Curve() { return Curve },
    // mappers
    get RoundUniform() { return RoundUniform },

    get simplicesToGeometryMeta() { return simplicesToGeometryMeta },
    get computeFaceNormals() { return computeFaceNormals },
    get cube() { return cube },
    get quadrilateral() { return quadrilateral },
    get square() { return square },
    get tetrahedron() { return tetrahedron },
    get triangle() { return triangle },
    get simplicesToDrawPrimitive() { return simplicesToDrawPrimitive },

    get Symbolic() { return Symbolic },
    // programs
    get programFromScripts() { return programFromScripts },
    get DrawAttribute() { return DrawAttribute },
    get DrawPrimitive() { return DrawPrimitive },
    // facets
    get AmbientLight() { return AmbientLight },
    get ColorFacet() { return ColorFacet },
    get DirectionalLight() { return DirectionalLight },
    get PointSize() { return PointSize },
    get Vector3Uniform() { return Vector3Uniform },
    // utils
    get IUnknownArray() { return IUnknownArray },
    get NumberIUnknownMap() { return NumberIUnknownMap },
    get refChange() { return refChange },
    get Shareable() { return Shareable },
    get StringIUnknownMap() { return StringIUnknownMap }
}
export = eight
