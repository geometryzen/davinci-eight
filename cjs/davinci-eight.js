/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var core = require('davinci-eight/core');
var object3D = require('davinci-eight/core/object3D');
var view = require('davinci-eight/cameras/view');
var Color = require('davinci-eight/core/Color');
var frustum = require('davinci-eight/cameras/frustum');
var perspective = require('davinci-eight/cameras/perspective');
var world = require('davinci-eight/worlds/world');
var viewport = require('davinci-eight/renderers/viewport');
var drawableModel = require('davinci-eight/objects/drawableModel');
var Face3 = require('davinci-eight/core/Face3');
// geometries
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
// programs
var pointsProgram = require('davinci-eight/programs/pointsProgram');
var shaderProgram = require('davinci-eight/programs/shaderProgram');
var smartProgram = require('davinci-eight/programs/smartProgram');
var ShaderAttributeVariable = require('davinci-eight/core/ShaderAttributeVariable');
var ShaderUniformVariable = require('davinci-eight/core/ShaderUniformVariable');
// math
var Matrix3 = require('davinci-eight/math/Matrix3');
var Matrix4 = require('davinci-eight/math/Matrix4');
var Spinor3 = require('davinci-eight/math/Spinor3');
var Vector2 = require('davinci-eight/math/Vector2');
var Vector3 = require('davinci-eight/math/Vector3');
// mesh
var arrowMesh = require('davinci-eight/mesh/arrowMesh');
var boxMesh = require('davinci-eight/mesh/boxMesh');
// objects
var box = require('davinci-eight/objects/box');
var Curve = require('davinci-eight/curves/Curve');
var initWebGL = require('davinci-eight/renderers/initWebGL');
// uniforms
var AmbientLight = require('davinci-eight/uniforms/AmbientLight');
var ChainedUniformProvider = require('davinci-eight/uniforms/ChainedUniformProvider');
var DefaultUniformProvider = require('davinci-eight/uniforms/DefaultUniformProvider');
var ModelMatrixUniformProvider = require('davinci-eight/uniforms/ModelMatrixUniformProvider');
var Uniform2fvProvider = require('davinci-eight/uniforms/Uniform2fvProvider');
var contextMonitor = require('davinci-eight/utils/contextMonitor');
var workbench3D = require('davinci-eight/utils/workbench3D');
var windowAnimationRunner = require('davinci-eight/utils/windowAnimationRunner');
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
    get contextMonitor() { return contextMonitor; },
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
};
module.exports = eight;
