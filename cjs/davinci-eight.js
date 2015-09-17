/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var frustum = require('davinci-eight/cameras/frustum');
var frustumMatrix = require('davinci-eight/cameras/frustumMatrix');
var perspective = require('davinci-eight/cameras/perspective');
var perspectiveMatrix = require('davinci-eight/cameras/perspectiveMatrix');
var view = require('davinci-eight/cameras/view');
var viewMatrix = require('davinci-eight/cameras/viewMatrix');
// core
var AttribLocation = require('davinci-eight/core/AttribLocation');
var Color = require('davinci-eight/core/Color');
var core = require('davinci-eight/core');
var DrawMode = require('davinci-eight/core/DrawMode');
var Face3 = require('davinci-eight/core/Face3');
var Symbolic = require('davinci-eight/core/Symbolic');
var UniformLocation = require('davinci-eight/core/UniformLocation');
// curves
var Curve = require('davinci-eight/curves/Curve');
// dfx
var DrawAttribute = require('davinci-eight/dfx/DrawAttribute');
var DrawElements = require('davinci-eight/dfx/DrawElements');
var Simplex = require('davinci-eight/dfx/Simplex');
var Vertex = require('davinci-eight/dfx/Vertex');
var checkGeometry = require('davinci-eight/dfx/checkGeometry');
var computeFaceNormals = require('davinci-eight/dfx/computeFaceNormals');
var cube = require('davinci-eight/dfx/cube');
var quadrilateral = require('davinci-eight/dfx/quadrilateral');
var square = require('davinci-eight/dfx/square');
var tetrahedron = require('davinci-eight/dfx/tetrahedron');
var toDrawElements = require('davinci-eight/dfx/toDrawElements');
var triangle = require('davinci-eight/dfx/triangle');
// scene
var createDrawList = require('davinci-eight/scene/createDrawList');
var Material = require('davinci-eight/scene/Material');
var Mesh = require('davinci-eight/scene/Mesh');
var MeshNormalMaterial = require('davinci-eight/scene/MeshNormalMaterial');
var PerspectiveCamera = require('davinci-eight/scene/PerspectiveCamera');
var Scene = require('davinci-eight/scene/Scene');
var WebGLRenderer = require('davinci-eight/scene/WebGLRenderer');
// geometries
var Geometry = require('davinci-eight/geometries/Geometry');
//import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
//import BarnGeometry = require('davinci-eight/geometries/BarnGeometry');
var BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
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
var shaderProgram = require('davinci-eight/programs/shaderProgram');
var smartProgram = require('davinci-eight/programs/smartProgram');
var programFromScripts = require('davinci-eight/programs/programFromScripts');
var Matrix3 = require('davinci-eight/math/Matrix3');
var Matrix4 = require('davinci-eight/math/Matrix4');
var Quaternion = require('davinci-eight/math/Quaternion');
var rotor3 = require('davinci-eight/math/rotor3');
var Spinor3 = require('davinci-eight/math/Spinor3');
var Vector1 = require('davinci-eight/math/Vector1');
var Vector2 = require('davinci-eight/math/Vector2');
var Vector3 = require('davinci-eight/math/Vector3');
var Vector4 = require('davinci-eight/math/Vector4');
var VectorN = require('davinci-eight/math/VectorN');
// mesh
var ArrowBuilder = require('davinci-eight/mesh/ArrowBuilder');
var CylinderArgs = require('davinci-eight/mesh/CylinderArgs');
var initWebGL = require('davinci-eight/renderers/initWebGL');
var renderer = require('davinci-eight/renderers/renderer');
// uniforms
// utils
var contextProxy = require('davinci-eight/utils/contextProxy');
var Model = require('davinci-eight/utils/Model');
var refChange = require('davinci-eight/utils/refChange');
var workbench3D = require('davinci-eight/utils/workbench3D');
var windowAnimationRunner = require('davinci-eight/utils/windowAnimationRunner');
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
    // TODO: Arrange in alphabetical order in order to assess width of API.
    get initWebGL() { return initWebGL; },
    get Model() { return Model; },
    get Simplex() { return Simplex; },
    get Vertex() { return Vertex; },
    get frustum() { return frustum; },
    get frustumMatrix() { return frustumMatrix; },
    get perspective() { return perspective; },
    get perspectiveMatrix() { return perspectiveMatrix; },
    get view() { return view; },
    get viewMatrix() { return viewMatrix; },
    get Scene() { return Scene; },
    get Material() { return Material; },
    get Mesh() { return Mesh; },
    get MeshNormalMaterial() { return MeshNormalMaterial; },
    get PerspectiveCamera() { return PerspectiveCamera; },
    get WebGLRenderer() { return WebGLRenderer; },
    get createDrawList() { return createDrawList; },
    get renderer() { return renderer; },
    get webgl() { return contextProxy; },
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
    // utils
    get refChange() { return refChange; }
};
module.exports = eight;
