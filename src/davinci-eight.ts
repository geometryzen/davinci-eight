// slideshow
import Slide from 'davinci-eight/slideshow/Slide';
import Director from 'davinci-eight/slideshow/Director';
import DirectorKeyboardHandler from 'davinci-eight/slideshow/DirectorKeyboardHandler';
import WaitAnimation from 'davinci-eight/slideshow/animations/WaitAnimation';
import ColorAnimation from 'davinci-eight/slideshow/animations/ColorAnimation';
import Vector2Animation from 'davinci-eight/slideshow/animations/Vector2Animation';
import Vector3Animation from 'davinci-eight/slideshow/animations/Vector3Animation';
import Spinor2Animation from 'davinci-eight/slideshow/animations/Spinor2Animation';
import Spinor3Animation from 'davinci-eight/slideshow/animations/Spinor3Animation';

// cameras
import createFrustum from 'davinci-eight/cameras/createFrustum';
import createPerspective from 'davinci-eight/cameras/createPerspective';
import createView from 'davinci-eight/cameras/createView';
import Frustum from 'davinci-eight/cameras/Frustum';
import Perspective from 'davinci-eight/cameras/Perspective';
import View from 'davinci-eight/cameras/View';
import frustumMatrix from 'davinci-eight/cameras/frustumMatrix';
import PerspectiveCamera from 'davinci-eight/cameras/PerspectiveCamera';
import perspectiveMatrix from 'davinci-eight/cameras/perspectiveMatrix';
import viewMatrix from 'davinci-eight/cameras/viewMatrix';
// commands
import BlendFactor from 'davinci-eight/commands/BlendFactor';
import WebGLBlendFunc from 'davinci-eight/commands/WebGLBlendFunc';
import WebGLClearColor from 'davinci-eight/commands/WebGLClearColor';
import Capability from 'davinci-eight/commands/Capability';
import WebGLDisable from 'davinci-eight/commands/WebGLDisable';
import WebGLEnable from 'davinci-eight/commands/WebGLEnable';
// core
import AttribLocation from 'davinci-eight/core/AttribLocation';
import AttribMetaInfo from 'davinci-eight/core/AttribMetaInfo';
import Color from 'davinci-eight/core/Color';
import core from 'davinci-eight/core';
import DrawMode from 'davinci-eight/core/DrawMode';
import ContextController from 'davinci-eight/core/ContextController';
import ContextKahuna from 'davinci-eight/core/ContextKahuna';
import IContextConsumer from 'davinci-eight/core/IContextConsumer';
import IContextProgramConsumer from 'davinci-eight/core/IContextProgramConsumer';
import IContextProvider from 'davinci-eight/core/IContextProvider';
import IContextMonitor from 'davinci-eight/core/IContextMonitor';
import GraphicsProgramSymbols from 'davinci-eight/core/GraphicsProgramSymbols';
import Facet from 'davinci-eight/core/Facet';
import FacetVisitor from 'davinci-eight/core/FacetVisitor';
import UniformLocation from 'davinci-eight/core/UniformLocation';
import UniformMetaInfo from 'davinci-eight/core/UniformMetaInfo';
// curves
import Curve from 'davinci-eight/curves/Curve';
// devices
import Keyboard from 'davinci-eight/devices/Keyboard';
// geometries
import Attribute from 'davinci-eight/geometries/Attribute';
import DrawAttribute from 'davinci-eight/geometries/DrawAttribute';
import Primitive from 'davinci-eight/geometries/Primitive';
import DrawPrimitive from 'davinci-eight/geometries/DrawPrimitive';
import Simplex from 'davinci-eight/geometries/Simplex';
import Vertex from 'davinci-eight/geometries/Vertex';
import simplicesToGeometryMeta from 'davinci-eight/geometries/simplicesToGeometryMeta';
import GeometryMeta from 'davinci-eight/geometries/GeometryMeta';
import computeFaceNormals from 'davinci-eight/geometries/computeFaceNormals';
import cube from 'davinci-eight/geometries/cube';
import quadrilateral from 'davinci-eight/geometries/quadrilateral';
import square from 'davinci-eight/geometries/square';
import tetrahedron from 'davinci-eight/geometries/tetrahedron';
import simplicesToDrawPrimitive from 'davinci-eight/geometries/simplicesToDrawPrimitive';
import triangle from 'davinci-eight/geometries/triangle';
// topologies
import Topology from 'davinci-eight/topologies/Topology';
import PointTopology from 'davinci-eight/topologies/PointTopology';
import LineTopology from 'davinci-eight/topologies/LineTopology';
import MeshTopology from 'davinci-eight/topologies/MeshTopology';
import GridTopology from 'davinci-eight/topologies/GridTopology';
// scene
import createDrawList from 'davinci-eight/scene/createDrawList';
import IDrawList from 'davinci-eight/scene/IDrawList';
import Drawable from 'davinci-eight/scene/Drawable';
import Scene from 'davinci-eight/scene/Scene';
import WebGLRenderer from 'davinci-eight/scene/WebGLRenderer';
// geometries
import AxialSimplexGeometry from 'davinci-eight/geometries/AxialSimplexGeometry';
import ArrowGeometry from 'davinci-eight/geometries/ArrowGeometry';
import ArrowSimplexGeometry from 'davinci-eight/geometries/ArrowSimplexGeometry';
import BarnSimplexGeometry from 'davinci-eight/geometries/BarnSimplexGeometry';
import ConeGeometry from 'davinci-eight/geometries/ConeGeometry';
import ConeSimplexGeometry from 'davinci-eight/geometries/ConeSimplexGeometry';
import CuboidGeometry from 'davinci-eight/geometries/CuboidGeometry';
import CuboidSimplexGeometry from 'davinci-eight/geometries/CuboidSimplexGeometry';
import CylinderGeometry from 'davinci-eight/geometries/CylinderGeometry';
import CylinderSimplexGeometry from 'davinci-eight/geometries/CylinderSimplexGeometry';
import DodecahedronSimplexGeometry from 'davinci-eight/geometries/DodecahedronSimplexGeometry';
import IcosahedronSimplexGeometry from 'davinci-eight/geometries/IcosahedronSimplexGeometry';
import KleinBottleSimplexGeometry from 'davinci-eight/geometries/KleinBottleSimplexGeometry';
import Simplex1Geometry from 'davinci-eight/geometries/Simplex1Geometry';
import MobiusStripSimplexGeometry from 'davinci-eight/geometries/MobiusStripSimplexGeometry';
import OctahedronSimplexGeometry from 'davinci-eight/geometries/OctahedronSimplexGeometry';
import SliceSimplexGeometry from 'davinci-eight/geometries/SliceSimplexGeometry';
import GridSimplexGeometry from 'davinci-eight/geometries/GridSimplexGeometry';
import PolyhedronSimplexGeometry from 'davinci-eight/geometries/PolyhedronSimplexGeometry';
import RevolutionSimplexGeometry from 'davinci-eight/geometries/RevolutionSimplexGeometry';
import RingGeometry from 'davinci-eight/geometries/RingGeometry';
import RingSimplexGeometry from 'davinci-eight/geometries/RingSimplexGeometry';
import SphereGeometry from 'davinci-eight/geometries/SphereGeometry';
import TetrahedronSimplexGeometry from 'davinci-eight/geometries/TetrahedronSimplexGeometry';
import TextSimplexGeometry from 'davinci-eight/geometries/TextSimplexGeometry';
//import TubeSimplexGeometry          from 'davinci-eight/geometries/TubeSimplexGeometry';
import VortexSimplexGeometry from 'davinci-eight/geometries/VortexSimplexGeometry';
import arc3 from 'davinci-eight/geometries/arc3';
// programs
import createGraphicsProgram from 'davinci-eight/programs/createGraphicsProgram';
import smartProgram from 'davinci-eight/programs/smartProgram';
import programFromScripts from 'davinci-eight/programs/programFromScripts';

// materials
import GraphicsProgram from 'davinci-eight/materials/GraphicsProgram';
import HTMLScriptsGraphicsProgram from 'davinci-eight/materials/HTMLScriptsGraphicsProgram';
import LineMaterial from 'davinci-eight/materials/LineMaterial';
import MeshMaterial from 'davinci-eight/materials/MeshMaterial';
import MeshLambertMaterial from 'davinci-eight/materials/MeshLambertMaterial';
import PointMaterial from 'davinci-eight/materials/PointMaterial';
import GraphicsProgramBuilder from 'davinci-eight/materials/GraphicsProgramBuilder';
// math
import AbstractMatrix from 'davinci-eight/math/AbstractMatrix';
import CartesianE3 from 'davinci-eight/math/CartesianE3';
import VectorE1 from 'davinci-eight/math/VectorE1';
import VectorE2 from 'davinci-eight/math/VectorE2';
import VectorE3 from 'davinci-eight/math/VectorE3';
import VectorE4 from 'davinci-eight/math/VectorE4';
import CC from 'davinci-eight/math/CC';
import Dimensions from 'davinci-eight/math/Dimensions';
import Euclidean1 from 'davinci-eight/math/Euclidean1';
import Euclidean1Coords from 'davinci-eight/math/Euclidean1Coords';
import Euclidean2 from 'davinci-eight/math/Euclidean2';
import Euclidean3 from 'davinci-eight/math/Euclidean3';
import Euler from 'davinci-eight/math/Euler';
import GeometricElement from 'davinci-eight/math/GeometricElement';
import LinearElement from 'davinci-eight/math/LinearElement';
import mathcore from 'davinci-eight/math/mathcore';
import R1 from 'davinci-eight/math/R1';
import Mat2R from 'davinci-eight/math/Mat2R';
import Mat3R from 'davinci-eight/math/Mat3R';
import Mat4R from 'davinci-eight/math/Mat4R';
import Measure from 'davinci-eight/math/Measure';
import Mutable from 'davinci-eight/math/Mutable';
import QQ from 'davinci-eight/math/QQ';
import SpinorE1 from 'davinci-eight/math/SpinorE1';
import SpinorE2 from 'davinci-eight/math/SpinorE2';
import SpinorE3 from 'davinci-eight/math/SpinorE3';
import Unit from 'davinci-eight/math/Unit';
import UnitError from 'davinci-eight/math/UnitError';
import G2 from 'davinci-eight/math/G2';
import G3 from 'davinci-eight/math/G3';
import SpinG2 from 'davinci-eight/math/SpinG2';
import SpinG3 from 'davinci-eight/math/SpinG3';
import R2 from 'davinci-eight/math/R2';
import R3 from 'davinci-eight/math/R3';
import R4 from 'davinci-eight/math/R4';
import VectorN from 'davinci-eight/math/VectorN';
import HH from 'davinci-eight/math/HH';

// facets and animation targets
import AmbientLight from 'davinci-eight/facets/AmbientLight';
import ColorFacet from 'davinci-eight/facets/ColorFacet';
import DirectionalLight from 'davinci-eight/facets/DirectionalLight';
import EulerFacet from 'davinci-eight/facets/EulerFacet';
import ModelFacet from 'davinci-eight/facets/ModelFacet';
import PointSizeFacet from 'davinci-eight/facets/PointSizeFacet';
import ReflectionFacetE2 from 'davinci-eight/facets/ReflectionFacetE2';
import ReflectionFacetE3 from 'davinci-eight/facets/ReflectionFacetE3';
import Vector3Facet from 'davinci-eight/facets/Vector3Facet';

// models
import ModelE2 from 'davinci-eight/models/ModelE2';
import ModelE3 from 'davinci-eight/models/ModelE3';

// programs
import IGraphicsBuffers from 'davinci-eight/core/IGraphicsBuffers';
import IGraphicsProgram from 'davinci-eight/core/IGraphicsProgram';
import GraphicsBuffers from 'davinci-eight/resources/GraphicsBuffers';

// renderers
import IContextRenderer from 'davinci-eight/renderers/IContextRenderer';
import initWebGL from 'davinci-eight/renderers/initWebGL';
import renderer from 'davinci-eight/renderers/renderer';

// utils
import contextProxy from 'davinci-eight/utils/contextProxy';
import Framerate from 'davinci-eight/utils/Framerate';
import getCanvasElementById from 'davinci-eight/utils/getCanvasElementById';
import IUnknownArray from 'davinci-eight/collections/IUnknownArray';
import loadImageTexture from 'davinci-eight/utils/loadImageTexture';
import NumberIUnknownMap from 'davinci-eight/collections/NumberIUnknownMap';
import refChange from 'davinci-eight/utils/refChange';
import Shareable from 'davinci-eight/utils/Shareable';
import StringIUnknownMap from 'davinci-eight/collections/StringIUnknownMap';
import WindowAnimationRunner from 'davinci-eight/utils/WindowAnimationRunner';
import animation from 'davinci-eight/utils/animation';

// visual
import arrow from 'davinci-eight/visual/createArrow';
import box from 'davinci-eight/visual/createBox';
import cylinder from 'davinci-eight/visual/createCylinder';
import sphere from 'davinci-eight/visual/createSphere';
import vector from 'davinci-eight/visual/vector';

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

    get fastPath(): boolean {
        return core.fastPath;
    },
    set fastPath(value: boolean) {
        core.fastPath = value;
    },
    get strict(): boolean {
        return core.strict;
    },
    set strict(value: boolean) {
        core.strict = value;
    },
    get verbose(): boolean {
        return core.verbose;
    },
    set verbose(value: boolean) {
        if (typeof value === 'boolean') {
            core.verbose = value;
        }
        else {
            throw new TypeError('verbose must be a boolean');
        }
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
    get ModelFacet() { return ModelFacet },

    get Simplex() { return Simplex },
    get Vertex() { return Vertex },
    get frustumMatrix() { return frustumMatrix },
    get perspectiveMatrix() { return perspectiveMatrix },
    get viewMatrix() { return viewMatrix },
    get Scene() { return Scene },
    get Drawable() { return Drawable },
    get PerspectiveCamera() { return PerspectiveCamera },
    get getCanvasElementById() { return getCanvasElementById },
    get WebGLRenderer() { return WebGLRenderer },
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
    get SphereGeometry() { return SphereGeometry },
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
    get GraphicsBuffers() { return GraphicsBuffers },
    // programs
    get programFromScripts() { return programFromScripts },
    get DrawAttribute() { return DrawAttribute },
    get DrawPrimitive() { return DrawPrimitive },
    // facets
    get AmbientLight() { return AmbientLight },
    get ColorFacet() { return ColorFacet },
    get DirectionalLight() { return DirectionalLight },
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
    get sqrt() { return mathcore.sqrt },
    // visual
    get arrow() { return arrow },
    get box() { return box },
    get cylinder() { return cylinder },
    get sphere() { return sphere },
    get vector() { return vector }
}
export default eight;
