// slideshow
import Slide from './davinci-eight/slideshow/Slide';
import Director from './davinci-eight/slideshow/Director';
import DirectorKeyboardHandler from './davinci-eight/slideshow/DirectorKeyboardHandler';
import WaitAnimation from './davinci-eight/slideshow/animations/WaitAnimation';
import ColorAnimation from './davinci-eight/slideshow/animations/ColorAnimation';
import Vector2Animation from './davinci-eight/slideshow/animations/Vector2Animation';
import Vector3Animation from './davinci-eight/slideshow/animations/Vector3Animation';
import Spinor2Animation from './davinci-eight/slideshow/animations/Spinor2Animation';
import Spinor3Animation from './davinci-eight/slideshow/animations/Spinor3Animation';

// commands
import BlendFactor from './davinci-eight/commands/BlendFactor';
import WebGLBlendFunc from './davinci-eight/commands/WebGLBlendFunc';
import {WebGLClearColor} from './davinci-eight/commands/WebGLClearColor';
import Capability from './davinci-eight/commands/Capability';
import {WebGLDisable} from './davinci-eight/commands/WebGLDisable';
import {WebGLEnable} from './davinci-eight/commands/WebGLEnable';

// controls
import {OrbitControls} from './davinci-eight/controls/OrbitControls'
import {TrackballControls} from './davinci-eight/controls/TrackballControls'

// core
import AttribLocation from './davinci-eight/core/AttribLocation';
import AttribMetaInfo from './davinci-eight/core/AttribMetaInfo';
import {Color} from './davinci-eight/core/Color';
import config from './davinci-eight/config';
import {Drawable} from './davinci-eight/core/Drawable';
import DrawMode from './davinci-eight/core/DrawMode';
import ErrorMode from './davinci-eight/core/ErrorMode';
import {ContextConsumer} from './davinci-eight/core/ContextConsumer';
import ContextProgramConsumer from './davinci-eight/core/ContextProgramConsumer';
import ContextProvider from './davinci-eight/core/ContextProvider';
import GeometryArrays from './davinci-eight/core/GeometryArrays';
import GeometryContainer from './davinci-eight/core/GeometryContainer';
import GeometryElements from './davinci-eight/core/GeometryElements';
import GraphicsProgramSymbols from './davinci-eight/core/GraphicsProgramSymbols';
import {Facet} from './davinci-eight/core/Facet';
import {FacetVisitor} from './davinci-eight/core/FacetVisitor';
import {Mesh} from './davinci-eight/core/Mesh';
import {Scene} from './davinci-eight/core/Scene';
import Shader from './davinci-eight/core/Shader';
import UniformLocation from './davinci-eight/core/UniformLocation';
import UniformMetaInfo from './davinci-eight/core/UniformMetaInfo';
import Usage from './davinci-eight/core/Usage';
import {Engine} from './davinci-eight/core/Engine';
import initWebGL from './davinci-eight/core/initWebGL';
import VertexBuffer from './davinci-eight/core/VertexBuffer';
import IndexBuffer from './davinci-eight/core/IndexBuffer';

// devices
import Keyboard from './davinci-eight/devices/Keyboard';

// facets and animation targets
import {AmbientLight} from './davinci-eight/facets/AmbientLight';
import {ColorFacet} from './davinci-eight/facets/ColorFacet';
import {DirectionalLight} from './davinci-eight/facets/DirectionalLight';
import {ModelFacet} from './davinci-eight/facets/ModelFacet';
import {PointSizeFacet} from './davinci-eight/facets/PointSizeFacet';
import ReflectionFacetE2 from './davinci-eight/facets/ReflectionFacetE2';
import ReflectionFacetE3 from './davinci-eight/facets/ReflectionFacetE3';
import Vector3Facet from './davinci-eight/facets/Vector3Facet';
import createFrustum from './davinci-eight/facets/createFrustum';
import createPerspective from './davinci-eight/facets/createPerspective';
import createView from './davinci-eight/facets/createView';
import Frustum from './davinci-eight/facets/Frustum';
import Perspective from './davinci-eight/facets/Perspective';
import View from './davinci-eight/facets/View';
import frustumMatrix from './davinci-eight/facets/frustumMatrix';
import {PerspectiveCamera} from './davinci-eight/facets/PerspectiveCamera';
import perspectiveMatrix from './davinci-eight/facets/perspectiveMatrix';
import viewMatrix from './davinci-eight/facets/viewMatrixFromEyeLookUp';
import ModelE2 from './davinci-eight/facets/ModelE2';
import ModelE3 from './davinci-eight/facets/ModelE3';

// geometries
import Attribute from '././davinci-eight/core/Attribute';
import DrawAttribute from './davinci-eight/geometries/primitives/DrawAttribute';
import Primitive from './davinci-eight/core/Primitive';
import DrawPrimitive from './davinci-eight/geometries/primitives/DrawPrimitive';
import Simplex from './davinci-eight/geometries/Simplex';
import Vertex from './davinci-eight/geometries/primitives/Vertex';
import simplicesToGeometryMeta from './davinci-eight/geometries/simplicesToGeometryMeta';
import GeometryMeta from './davinci-eight/geometries/GeometryMeta';
import computeFaceNormals from './davinci-eight/geometries/computeFaceNormals';
import cube from './davinci-eight/geometries/cube';
import quadrilateral from './davinci-eight/geometries/quadrilateral';
import square from './davinci-eight/geometries/square';
import triangle from './davinci-eight/geometries/triangle';
import ArrowGeometry from './davinci-eight/geometries/ArrowGeometry';
import BoxGeometry from './davinci-eight/geometries/BoxGeometry';
import CylinderGeometry from './davinci-eight/geometries/CylinderGeometry';
import GridGeometry from './davinci-eight/geometries/GridGeometry';
import SphereGeometry from './davinci-eight/geometries/SphereGeometry';
import TetrahedronGeometry from './davinci-eight/geometries/TetrahedronGeometry';

import ArrowBuilder from './davinci-eight/geometries/ArrowBuilder';
import ArrowSimplexPrimitivesBuilder from './davinci-eight/geometries/ArrowSimplexPrimitivesBuilder';
import BarnSimplexPrimitivesBuilder from './davinci-eight/geometries/BarnSimplexPrimitivesBuilder';
import ConicalShellBuilder from './davinci-eight/geometries/ConicalShellBuilder';
import ConeSimplexGeometry from './davinci-eight/geometries/ConeSimplexGeometry';
import CuboidPrimitivesBuilder from './davinci-eight/geometries/CuboidPrimitivesBuilder';
import CuboidSimplexPrimitivesBuilder from './davinci-eight/geometries/CuboidSimplexPrimitivesBuilder';
import CylindricalShellBuilder from './davinci-eight/geometries/CylindricalShellBuilder';
import CylinderBuilder from './davinci-eight/geometries/CylinderBuilder';
import DodecahedronSimplexGeometry from './davinci-eight/geometries/DodecahedronSimplexGeometry';
import IcosahedronSimplexGeometry from './davinci-eight/geometries/IcosahedronSimplexGeometry';
import KleinBottleSimplexGeometry from './davinci-eight/geometries/KleinBottleSimplexGeometry';
import Lattice2Geometry from './davinci-eight/geometries/Lattice2Geometry';
import Simplex1Geometry from './davinci-eight/geometries/Simplex1Geometry';
import MobiusStripSimplexGeometry from './davinci-eight/geometries/MobiusStripSimplexGeometry';
import OctahedronBuilder from './davinci-eight/geometries/OctahedronBuilder';
import SliceSimplexPrimitivesBuilder from './davinci-eight/geometries/SliceSimplexPrimitivesBuilder';
import GridSimplexBuilder from './davinci-eight/geometries/GridSimplexBuilder';
import PolyhedronBuilder from './davinci-eight/geometries/PolyhedronBuilder';
import RevolutionSimplexPrimitivesBuilder from './davinci-eight/geometries/RevolutionSimplexPrimitivesBuilder';
import RingBuilder from './davinci-eight/geometries/RingBuilder';
import RingSimplexGeometry from './davinci-eight/geometries/RingSimplexGeometry';
import TextSimplexGeometry from './davinci-eight/geometries/TextSimplexGeometry';
//import TubeSimplexGeometry          from './davinci-eight/geometries/TubeSimplexGeometry';
import VortexSimplexGeometry from './davinci-eight/geometries/VortexSimplexGeometry';
import arc3 from './davinci-eight/geometries/arc3';

// materials
import HTMLScriptsMaterial from './davinci-eight/materials/HTMLScriptsMaterial';
import {LineMaterial} from './davinci-eight/materials/LineMaterial';
import {ShaderMaterial} from './davinci-eight/materials/ShaderMaterial';
import {MeshMaterial} from './davinci-eight/materials/MeshMaterial';
import {PointMaterial} from './davinci-eight/materials/PointMaterial';
import GraphicsProgramBuilder from './davinci-eight/materials/GraphicsProgramBuilder';

// math
import AbstractMatrix from './davinci-eight/math/AbstractMatrix';
import VectorE1 from './davinci-eight/math/VectorE1';
import VectorE2 from './davinci-eight/math/VectorE2';
import VectorE3 from './davinci-eight/math/VectorE3';
import VectorE4 from './davinci-eight/math/VectorE4';
import CC from './davinci-eight/math/CC';
import {Dimensions} from './davinci-eight/math/Dimensions';
import G1 from './davinci-eight/math/G1';
import GeometricE1 from './davinci-eight/math/GeometricE1';
import {G2} from './davinci-eight/math/G2';
import {G3} from './davinci-eight/math/G3';
import gauss from './davinci-eight/math/gauss';
import GeometricNumber from './davinci-eight/math/GeometricNumber';
import LinearNumber from './davinci-eight/math/LinearNumber';
import mathcore from './davinci-eight/math/mathcore';
import Vector1 from './davinci-eight/math/Vector1';
import Matrix2 from './davinci-eight/math/Matrix2';
import Matrix3 from './davinci-eight/math/Matrix3';
import Matrix4 from './davinci-eight/math/Matrix4';
import Measure from './davinci-eight/math/Measure';
import Mutable from './davinci-eight/math/Mutable';
import {QQ} from './davinci-eight/math/QQ';
import R3 from './davinci-eight/math/R3';
import SpinorE1 from './davinci-eight/math/SpinorE1';
import SpinorE2 from './davinci-eight/math/SpinorE2';
import SpinorE3 from './davinci-eight/math/SpinorE3';
import {Unit} from './davinci-eight/math/Unit';
import {Geometric2} from './davinci-eight/math/Geometric2';
import {Geometric3} from './davinci-eight/math/Geometric3';
import Spinor2 from './davinci-eight/math/Spinor2';
import Spinor3 from './davinci-eight/math/Spinor3';
import {Vector2} from './davinci-eight/math/Vector2';
import Vector3 from './davinci-eight/math/Vector3';
import Vector4 from './davinci-eight/math/Vector4';
import {VectorN} from './davinci-eight/math/VectorN';
import Quaternion from './davinci-eight/math/Quaternion';

// overlay
import Overlay from './davinci-eight/overlay/Overlay';

// utils
import Framerate from './davinci-eight/utils/Framerate';
import getCanvasElementById from './davinci-eight/utils/getCanvasElementById';
import ShareableArray from './davinci-eight/collections/ShareableArray';
import loadImageTexture from './davinci-eight/utils/loadImageTexture';
import NumberShareableMap from './davinci-eight/collections/NumberShareableMap';
import refChange from './davinci-eight/core/refChange';
import {ShareableBase} from './davinci-eight/core/ShareableBase';
import StringShareableMap from './davinci-eight/collections/StringShareableMap';
import WindowAnimationRunner from './davinci-eight/utils/WindowAnimationRunner';
import animation from './davinci-eight/utils/animation';
import randomColor from './davinci-eight/utils/randomColor';

// visual
import {Arrow} from './davinci-eight/visual/Arrow';
import {Sphere} from './davinci-eight/visual/Sphere';
import {Box} from './davinci-eight/visual/Box';
import {RigidBody} from './davinci-eight/visual/RigidBody';
import RigidBodyWithUnits from './davinci-eight/visual/RigidBodyWithUnits';
import {Cylinder} from './davinci-eight/visual/Cylinder';
import {Curve} from './davinci-eight/visual/Curve';
import {Grid} from './davinci-eight/visual/Grid';
import Tetrahedron from './davinci-eight/visual/Tetrahedron';
import {Trail} from './davinci-eight/visual/Trail';
import vector from './davinci-eight/visual/vector';

/**
 *
 */
const eight = {
    /**
     * The publish date of the latest version of the library.
     */
    get LAST_MODIFIED() { return config.LAST_MODIFIED },

    get errorMode(): ErrorMode {
        return config.errorMode;
    },
    set errorMode(errorMode: ErrorMode) {
        if (typeof errorMode === 'number') {
            config.errorMode = errorMode;
        }
        else {
            throw new TypeError('errorMode must be a ErrorMode');
        }
    },

    /**
     * The semantic version of the library.
     */
    get VERSION() { return config.VERSION },

    // materials
    get ShaderMaterial() { return ShaderMaterial },
    get HTMLScriptsMaterial() { return HTMLScriptsMaterial },
    get LineMaterial() { return LineMaterial },
    get MeshMaterial() { return MeshMaterial },
    get PointMaterial() { return PointMaterial },
    get GraphicsProgramBuilder() { return GraphicsProgramBuilder },

    //commands
    get BlendFactor() { return BlendFactor },
    get Capability() { return Capability },
    get WebGLBlendFunc() { return WebGLBlendFunc },
    get WebGLClearColor() { return WebGLClearColor },
    get WebGLDisable() { return WebGLDisable },
    get WebGLEnable() { return WebGLEnable },

    get ModelE2() { return ModelE2 },
    get ModelE3() { return ModelE3 },
    get ModelFacet() { return ModelFacet },

    get Simplex() { return Simplex },
    get Vertex() { return Vertex },
    get frustumMatrix() { return frustumMatrix },
    get perspectiveMatrix() { return perspectiveMatrix },
    get viewMatrix() { return viewMatrix },
    get Scene() { return Scene },
    get Shader() { return Shader },
    get Drawable() { return Drawable },
    get PerspectiveCamera() { return PerspectiveCamera },
    get getCanvasElementById() { return getCanvasElementById },
    get Engine() { return Engine },
    get animation() { return animation },
    get DrawMode() { return DrawMode },
    get ErrorMode() { return ErrorMode },
    get Usage() { return Usage },
    get AttribLocation() { return AttribLocation },
    get UniformLocation() { return UniformLocation },
    get VertexBuffer() { return VertexBuffer },
    get IndexBuffer() { return IndexBuffer },
    get Color() { return Color },

    get OrbitControls() { return OrbitControls },
    get TrackballControls() { return TrackballControls },

    // facets
    get AmbientLight() { return AmbientLight },
    get ColorFacet() { return ColorFacet },
    get DirectionalLight() { return DirectionalLight },
    get PointSizeFacet() { return PointSizeFacet },
    get ReflectionFacetE2() { return ReflectionFacetE2 },
    get ReflectionFacetE3() { return ReflectionFacetE3 },
    get Vector3Facet() { return Vector3Facet },

    // geometries
    get ArrowBuilder() { return ArrowBuilder },
    get ArrowGeometry() { return ArrowGeometry },
    get BoxGeometry() { return BoxGeometry },
    get ConicalShellBuilder() { return ConicalShellBuilder },
    get CylinderBuilder() { return CylinderBuilder },
    get CylinderGeometry() { return CylinderGeometry },
    get CylindricalShellBuilder() { return CylindricalShellBuilder },
    get GridGeometry() { return GridGeometry },
    get RingBuilder() { return RingBuilder },
    get SphereGeometry() { return SphereGeometry },
    get TetrahedronGeometry() { return TetrahedronGeometry },

    get Dimensions() { return Dimensions },
    get Unit() { return Unit },
    get G2() { return G2 },
    get G3() { return G3 },
    get Matrix2() { return Matrix2 },
    get Matrix3() { return Matrix3 },
    get Matrix4() { return Matrix4 },
    get QQ() { return QQ },
    get R3() { return R3 },
    get Geometric2() { return Geometric2 },
    get Geometric3() { return Geometric3 },
    get Vector1() { return Vector1 },
    get Spinor2() { return Spinor2 },
    get Spinor3() { return Spinor3 },
    get Vector2() { return Vector2 },
    get Vector3() { return Vector3 },
    get Vector4() { return Vector4 },
    get VectorN() { return VectorN },

    get GraphicsProgramSymbols() { return GraphicsProgramSymbols },
    get GeometryArrays() { return GeometryArrays },
    get GeometryContainer() { return GeometryContainer },
    get GeometryElements() { return GeometryElements },

    // overlay
    get Overlay() { return Overlay },

    // programs
    get DrawAttribute() { return DrawAttribute },
    get DrawPrimitive() { return DrawPrimitive },

    // utils
    get ShareableArray() { return ShareableArray },
    get NumberShareableMap() { return NumberShareableMap },
    get refChange() { return refChange },
    get ShareableBase() { return ShareableBase },
    get StringShareableMap() { return StringShareableMap },

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
    get Arrow() { return Arrow },
    get Sphere() { return Sphere },
    get Box() { return Box },
    get Mesh() { return Mesh },
    get RigidBody() { return RigidBody },
    get RigidBodyWithUnits() { return RigidBodyWithUnits },
    get Cylinder() { return Cylinder },
    get Curve() { return Curve },
    get Grid() { return Grid },
    get Tetrahedron() { return Tetrahedron },
    get Trail() { return Trail }
}
export default eight;
