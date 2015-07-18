/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var AmbientLight = require('davinci-eight/uniforms/AmbientLight');
var core = require('davinci-eight/core');
var object3D = require('davinci-eight/core/object3D');
var view = require('davinci-eight/cameras/view');
var Color = require('davinci-eight/core/Color');
var ChainedVertexUniformProvider = require('davinci-eight/objects/ChainedVertexUniformProvider');
var perspective = require('davinci-eight/cameras/perspective');
var world = require('davinci-eight/worlds/world');
var renderer = require('davinci-eight/renderers/renderer');
var WebGLRenderer = require('davinci-eight/renderers/WebGLRenderer');
var drawableModel = require('davinci-eight/objects/drawableModel');
var webGLContextMonitor = require('davinci-eight/utils/webGLContextMonitor');
var workbench3D = require('davinci-eight/utils/workbench3D');
var windowAnimationRunner = require('davinci-eight/utils/windowAnimationRunner');
var Face3 = require('davinci-eight/core/Face3');
var Geometry = require('davinci-eight/geometries/Geometry');
var GeometryAdapter = require('davinci-eight/geometries/GeometryAdapter');
var ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
var BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
var CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
var DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
var IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
var KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
var MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
var OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
var ParametricGeometry = require('davinci-eight/geometries/ParametricGeometry');
var PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
var RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
var SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
var TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
var TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
var VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
var pointsProgram = require('davinci-eight/programs/pointsProgram');
var shaderProgram = require('davinci-eight/programs/shaderProgram');
var smartProgram = require('davinci-eight/programs/smartProgram');
var ShaderAttributeVariable = require('davinci-eight/core/ShaderAttributeVariable');
var ShaderUniformVariable = require('davinci-eight/core/ShaderUniformVariable');
var Matrix3 = require('davinci-eight/math/Matrix3');
var Matrix4 = require('davinci-eight/math/Matrix4');
var Spinor3 = require('davinci-eight/math/Spinor3');
var Vector2 = require('davinci-eight/math/Vector2');
var Vector3 = require('davinci-eight/math/Vector3');
var Curve = require('davinci-eight/curves/Curve');
var Model = require('davinci-eight/objects/Model');
/*
import BoxVertexAttributeProvider = require('davinci-eight/mesh/BoxVertexAttributeProvider');
import CuboidVertexAttributeProvider = require('davinci-eight/mesh/CuboidVertexAttributeProvider');
import CurveGeometry = require('davinci-eight/mesh/CurveGeometry');
import EllipsoidGeometry = require('davinci-eight/mesh/EllipsoidGeometry');
import LatticeVertexAttributeProvider = require('davinci-eight/mesh/LatticeVertexAttributeProvider');
import box = require('davinci-eight/mesh/box');
import prism = require('davinci-eight/mesh/prism');
import cuboid = require('davinci-eight/mesh/cuboid');
import ellipsoid = require('davinci-eight/mesh/ellipsoid');
import RGBGeometry = require('davinci-eight/mesh/RGBGeometry');
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
    get view() { return view; },
    perspective: perspective,
    get world() { return world; },
    object3D: object3D,
    renderer: renderer,
    contextMonitor: webGLContextMonitor,
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
    get WebGLRenderer() { return WebGLRenderer; },
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
    get Model() { return Model; },
    get Matrix3() { return Matrix3; },
    get Matrix4() { return Matrix4; },
    get Spinor3() { return Spinor3; },
    get Vector2() { return Vector2; },
    get Vector3() { return Vector3; },
    get Curve() { return Curve; },
    get ChainedVertexUniformProvider() { return ChainedVertexUniformProvider; },
};
module.exports = eight;
