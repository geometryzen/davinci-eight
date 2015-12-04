// slideshow
import Slide = require('davinci-eight/slideshow/Slide')
import Director = require('davinci-eight/slideshow/Director')
import DirectorKeyboardHandler = require('davinci-eight/slideshow/DirectorKeyboardHandler')
import WaitAnimation = require('davinci-eight/slideshow/animations/WaitAnimation')
import ColorAnimation = require('davinci-eight/slideshow/animations/ColorAnimation')
import Vector2Animation = require('davinci-eight/slideshow/animations/Vector2Animation')
import Vector3Animation = require('davinci-eight/slideshow/animations/Vector3Animation')
import Spinor2Animation = require('davinci-eight/slideshow/animations/Spinor2Animation')
import Spinor3Animation = require('davinci-eight/slideshow/animations/Spinor3Animation')

// cameras
import createFrustum = require('davinci-eight/cameras/createFrustum')
import createPerspective = require('davinci-eight/cameras/createPerspective')
import createView = require('davinci-eight/cameras/createView')
import Frustum = require('davinci-eight/cameras/Frustum')
import Perspective = require('davinci-eight/cameras/Perspective')
import View = require('davinci-eight/cameras/View')
import frustumMatrix = require('davinci-eight/cameras/frustumMatrix')
import PerspectiveCamera = require('davinci-eight/cameras/PerspectiveCamera')
import perspectiveMatrix = require('davinci-eight/cameras/perspectiveMatrix')
import viewMatrix = require('davinci-eight/cameras/viewMatrix')
// commands
import BlendFactor = require('davinci-eight/commands/BlendFactor')
import WebGLBlendFunc = require('davinci-eight/commands/WebGLBlendFunc')
import WebGLClearColor = require('davinci-eight/commands/WebGLClearColor')
import Capability = require('davinci-eight/commands/Capability')
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
import GraphicsProgramSymbols = require('davinci-eight/core/GraphicsProgramSymbols')
import IFacet = require('davinci-eight/core/IFacet')
import IFacetVisitor = require('davinci-eight/core/IFacetVisitor')
import UniformLocation = require('davinci-eight/core/UniformLocation')
import UniformMetaInfo = require('davinci-eight/core/UniformMetaInfo')
// curves
import Curve = require('davinci-eight/curves/Curve')
// devices
import Keyboard = require('davinci-eight/devices/Keyboard')
// geometries
import Attribute = require('davinci-eight/geometries/Attribute')
import DrawAttribute = require('davinci-eight/geometries/DrawAttribute')
import Primitive = require('davinci-eight/geometries/Primitive')
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
import Scene = require('davinci-eight/scene/Scene')
import GraphicsContext = require('davinci-eight/scene/GraphicsContext')
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
import TextSimplexGeometry = require('davinci-eight/geometries/TextSimplexGeometry')
//import TubeSimplexGeometry          = require('davinci-eight/geometries/TubeSimplexGeometry')
import VortexSimplexGeometry = require('davinci-eight/geometries/VortexSimplexGeometry')
import arc3 = require('davinci-eight/geometries/arc3')
// programs
import createGraphicsProgram = require('davinci-eight/programs/createGraphicsProgram')
import smartProgram = require('davinci-eight/programs/smartProgram')
import programFromScripts = require('davinci-eight/programs/programFromScripts')

// materials
import GraphicsProgram = require('davinci-eight/materials/GraphicsProgram')
import HTMLScriptsGraphicsProgram = require('davinci-eight/materials/HTMLScriptsGraphicsProgram')
import LineMaterial = require('davinci-eight/materials/LineMaterial')
import MeshMaterial = require('davinci-eight/materials/MeshMaterial')
import MeshLambertMaterial = require('davinci-eight/materials/MeshLambertMaterial')
import PointMaterial = require('davinci-eight/materials/PointMaterial')
import GraphicsProgramBuilder = require('davinci-eight/materials/GraphicsProgramBuilder')
// math
import AbstractMatrix = require('davinci-eight/math/AbstractMatrix')
import CartesianE3 = require('davinci-eight/math/CartesianE3')
import VectorE1 = require('davinci-eight/math/VectorE1')
import VectorE2 = require('davinci-eight/math/VectorE2')
import VectorE3 = require('davinci-eight/math/VectorE3')
import VectorE4 = require('davinci-eight/math/VectorE4')
import CC = require('davinci-eight/math/CC')
import Dimensions = require('davinci-eight/math/Dimensions')
import Euclidean1 = require('davinci-eight/math/Euclidean1')
import Euclidean1Coords = require('davinci-eight/math/Euclidean1Coords')
import Euclidean2 = require('davinci-eight/math/Euclidean2')
import Euclidean3 = require('davinci-eight/math/Euclidean3')
import Euler = require('davinci-eight/math/Euler')
import GeometricElement = require('davinci-eight/math/GeometricElement')
import LinearElement = require('davinci-eight/math/LinearElement')
import mathcore = require('davinci-eight/math/mathcore')
import R1 = require('davinci-eight/math/R1')
import Mat2R = require('davinci-eight/math/Mat2R')
import Mat3R = require('davinci-eight/math/Mat3R')
import Mat4R = require('davinci-eight/math/Mat4R')
import Measure = require('davinci-eight/math/Measure')
import Mutable = require('davinci-eight/math/Mutable')
import QQ = require('davinci-eight/math/QQ')
import SpinorE1 = require('davinci-eight/math/SpinorE1')
import SpinorE2 = require('davinci-eight/math/SpinorE2')
import SpinorE3 = require('davinci-eight/math/SpinorE3')
import Unit = require('davinci-eight/math/Unit')
import UnitError = require('davinci-eight/math/UnitError')
import G2 = require('davinci-eight/math/G2')
import G3 = require('davinci-eight/math/G3')
import SpinG2 = require('davinci-eight/math/SpinG2')
import SpinG3 = require('davinci-eight/math/SpinG3')
import R2 = require('davinci-eight/math/R2')
import R3 = require('davinci-eight/math/R3')
import R4 = require('davinci-eight/math/R4')
import VectorN = require('davinci-eight/math/VectorN')
import HH = require('davinci-eight/math/HH')

// facets and animation targets
import AmbientLight = require('davinci-eight/facets/AmbientLight')
import ColorFacet = require('davinci-eight/facets/ColorFacet')
import DirectionalLightE3 = require('davinci-eight/facets/DirectionalLightE3')
import EulerFacet = require('davinci-eight/facets/EulerFacet')
import ModelFacetE3 = require('davinci-eight/facets/ModelFacetE3')
import PointSizeFacet = require('davinci-eight/facets/PointSizeFacet')
import ReflectionFacetE2 = require('davinci-eight/facets/ReflectionFacetE2')
import ReflectionFacetE3 = require('davinci-eight/facets/ReflectionFacetE3')
import Vector3Facet = require('davinci-eight/facets/Vector3Facet')

// models
import ModelE2 = require('davinci-eight/models/ModelE2')
import ModelE3 = require('davinci-eight/models/ModelE3')

// programs
import IGraphicsProgram = require('davinci-eight/core/IGraphicsProgram')

// renderers
import IContextRenderer = require('davinci-eight/renderers/IContextRenderer')
import initWebGL = require('davinci-eight/renderers/initWebGL')
import renderer = require('davinci-eight/renderers/renderer')


// utils
import contextProxy = require('davinci-eight/utils/contextProxy')
import Framerate = require('davinci-eight/utils/Framerate')
import getCanvasElementById = require('davinci-eight/utils/getCanvasElementById')
import IUnknownArray = require('davinci-eight/collections/IUnknownArray')
import loadImageTexture = require('davinci-eight/utils/loadImageTexture')
import NumberIUnknownMap = require('davinci-eight/collections/NumberIUnknownMap')
import refChange = require('davinci-eight/utils/refChange')
import Shareable = require('davinci-eight/utils/Shareable')
import StringIUnknownMap = require('davinci-eight/collections/StringIUnknownMap')
import WindowAnimationRunner = require('davinci-eight/utils/WindowAnimationRunner')
import animation = require('davinci-eight/utils/animation')

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
    get Vector2Animation() { return Vector2Animation },
    get Vector3Animation() { return Vector3Animation },
    get Spinor2Animation() { return Spinor2Animation },
    get Spinor3Animation() { return Spinor3Animation },

    // devices
    get Keyboard() { return Keyboard },

    // TODO: Arrange in alphabetical order in order to assess width of API.
    // materials
    get HTMLScriptsGraphicsProgram() { return HTMLScriptsGraphicsProgram },
    get GraphicsProgram() { return GraphicsProgram },
    get LineMaterial() { return LineMaterial },
    get MeshMaterial() { return MeshMaterial },
    get MeshLambertMaterial() { return MeshLambertMaterial },
    get PointMaterial() { return PointMaterial },
    get GraphicsProgramBuilder() { return GraphicsProgramBuilder },
    //commands
    get BlendFactor() { return BlendFactor },
    get Capability() { return Capability },
    get WebGLBlendFunc() { return WebGLBlendFunc },
    get WebGLClearColor() { return WebGLClearColor },
    get WebGLDisable() { return WebGLDisable },
    get WebGLEnable() { return WebGLEnable },

    get initWebGL() { return initWebGL },
    get createFrustum() { return createFrustum },
    get createPerspective() { return createPerspective },
    get createView() { return createView },

    get ModelE2() { return ModelE2 },
    get ModelE3() { return ModelE3 },
    get EulerFacet() { return EulerFacet },
    get ModelFacetE3() { return ModelFacetE3 },

    get Simplex() { return Simplex },
    get Vertex() { return Vertex },
    get frustumMatrix() { return frustumMatrix },
    get perspectiveMatrix() { return perspectiveMatrix },
    get viewMatrix() { return viewMatrix },
    get Scene() { return Scene },
    get Drawable() { return Drawable },
    get PerspectiveCamera() { return PerspectiveCamera },
    get getCanvasElementById() { return getCanvasElementById },
    get GraphicsContext() { return GraphicsContext },
    get createDrawList() { return createDrawList },
    get renderer() { return renderer },
    get webgl() { return contextProxy },
    get animation() { return animation },
    get DrawMode() { return DrawMode },
    get AttribLocation() { return AttribLocation },
    get UniformLocation() { return UniformLocation },
    get createGraphicsProgram() {
        return createGraphicsProgram
    },
    get smartProgram() {
        return smartProgram
    },
    get Color() { return Color },
    get AxialSimplexGeometry() { return AxialSimplexGeometry },
    get ArrowGeometry() { return ArrowGeometry },
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
    // get TextSimplexGeometry() { return TextSimplexGeometry },
    get VortexSimplexGeometry() { return VortexSimplexGeometry },
    get Topology() { return Topology },
    get PointTopology() { return PointTopology },
    get LineTopology() { return LineTopology },
    get MeshTopology() { return MeshTopology },
    get GridTopology() { return GridTopology },

    get Dimensions() { return Dimensions },
    get Unit() { return Unit },
    get Euclidean2() { return Euclidean2 },
    get Euclidean3() { return Euclidean3 },
    get Mat2R() { return Mat2R },
    get Mat3R() { return Mat3R },
    get Mat4R() { return Mat4R },
    get QQ() { return QQ },
    get G2() { return G2 },
    get G3() { return G3 },
    get R1() { return R1 },
    get SpinG2() { return SpinG2 },
    get SpinG3() { return SpinG3 },
    get R2() { return R2 },
    get R3() { return R3 },
    get R4() { return R4 },
    get VectorN() { return VectorN },
    get Curve() { return Curve },

    get simplicesToGeometryMeta() { return simplicesToGeometryMeta },
    get computeFaceNormals() { return computeFaceNormals },
    get cube() { return cube },
    get quadrilateral() { return quadrilateral },
    get square() { return square },
    get tetrahedron() { return tetrahedron },
    get triangle() { return triangle },
    get simplicesToDrawPrimitive() { return simplicesToDrawPrimitive },

    get GraphicsProgramSymbols() { return GraphicsProgramSymbols },
    // programs
    get programFromScripts() { return programFromScripts },
    get DrawAttribute() { return DrawAttribute },
    get DrawPrimitive() { return DrawPrimitive },
    // facets
    get AmbientLight() { return AmbientLight },
    get ColorFacet() { return ColorFacet },
    get DirectionalLightE3() { return DirectionalLightE3 },
    get PointSizeFacet() { return PointSizeFacet },
    get ReflectionFacetE2() { return ReflectionFacetE2 },
    get ReflectionFacetE3() { return ReflectionFacetE3 },
    get Vector3Facet() { return Vector3Facet },
    // utils
    get IUnknownArray() { return IUnknownArray },
    get NumberIUnknownMap() { return NumberIUnknownMap },
    get refChange() { return refChange },
    get Shareable() { return Shareable },
    get StringIUnknownMap() { return StringIUnknownMap },
    // universal math functions
    get cos() { return mathcore.cos },
    get cosh() { return mathcore.cosh },
    get exp() { return mathcore.exp },
    get log() { return mathcore.log },
    get norm() { return mathcore.norm },
    get quad() { return mathcore.quad },
    get sin() { return mathcore.sin },
    get sinh() { return mathcore.sinh },
    get sqrt() { return mathcore.sqrt }
}
export = eight
