/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
// core
var DataUsage = require('davinci-eight/core/DataUsage');
var DrawMode = require('davinci-eight/core/DrawMode');
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
var ShaderAttributeLocation = require('davinci-eight/core/ShaderAttributeLocation');
var ShaderUniformLocation = require('davinci-eight/core/ShaderUniformLocation');
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
var shaderProgramFromScripts = require('davinci-eight/programs/shaderProgramFromScripts');
// math
var Matrix3 = require('davinci-eight/math/Matrix3');
var Matrix4 = require('davinci-eight/math/Matrix4');
var Spinor3 = require('davinci-eight/math/Spinor3');
var Vector2 = require('davinci-eight/math/Vector2');
var Vector3 = require('davinci-eight/math/Vector3');
// mesh
var arrowMesh = require('davinci-eight/mesh/arrowMesh');
var boxMesh = require('davinci-eight/mesh/boxMesh');
var BoxArgs = require('davinci-eight/mesh/BoxArgs');
var cylinderMesh = require('davinci-eight/mesh/cylinderMesh');
var sphereMesh = require('davinci-eight/mesh/sphereMesh');
var vortexMesh = require('davinci-eight/mesh/vortexMesh');
// objects
var arrow = require('davinci-eight/objects/arrow');
var box = require('davinci-eight/objects/box');
var cylinder = require('davinci-eight/objects/cylinder');
var sphere = require('davinci-eight/objects/sphere');
var vortex = require('davinci-eight/objects/vortex');
var Curve = require('davinci-eight/curves/Curve');
var initWebGL = require('davinci-eight/renderers/initWebGL');
// uniforms
var AmbientLight = require('davinci-eight/uniforms/AmbientLight');
var ChainedUniformProvider = require('davinci-eight/uniforms/ChainedUniformProvider');
var DefaultUniformProvider = require('davinci-eight/uniforms/DefaultUniformProvider');
var DirectionalLight = require('davinci-eight/uniforms/DirectionalLight');
var ModelMatrixUniformProvider = require('davinci-eight/uniforms/ModelMatrixUniformProvider');
var MultiUniformProvider = require('davinci-eight/uniforms/MultiUniformProvider');
var PointLight = require('davinci-eight/uniforms/PointLight');
var uniforms = require('davinci-eight/uniforms/uniforms');
var UniformFloat = require('davinci-eight/uniforms/UniformFloat');
var UniformMat4 = require('davinci-eight/uniforms/UniformMat4');
var UniformVec2 = require('davinci-eight/uniforms/UniformVec2');
var UniformVec3 = require('davinci-eight/uniforms/UniformVec3');
var UniformVec4 = require('davinci-eight/uniforms/UniformVec4');
var UniformVector3 = require('davinci-eight/uniforms/UniformVector3');
var UniformSpinor3 = require('davinci-eight/uniforms/UniformSpinor3');
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
    animation: windowAnimationRunner,
    get DataUsage() { return DataUsage; },
    get drawableModel() { return drawableModel; },
    get DrawMode() { return DrawMode; },
    get ShaderAttributeLocation() { return ShaderAttributeLocation; },
    get ShaderUniformLocation() { return ShaderUniformLocation; },
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
    get DirectionalLight() { return DirectionalLight; },
    get PointLight() { return PointLight; },
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
    get UniformFloat() { return UniformFloat; },
    get UniformMat4() { return UniformMat4; },
    get UniformVec2() { return UniformVec2; },
    get UniformVec3() { return UniformVec3; },
    get UniformVec4() { return UniformVec4; },
    get UniformVector3() { return UniformVector3; },
    get UniformSpinor3() { return UniformSpinor3; },
    get Matrix3() { return Matrix3; },
    get Matrix4() { return Matrix4; },
    get Spinor3() { return Spinor3; },
    get Vector2() { return Vector2; },
    get Vector3() { return Vector3; },
    get Curve() { return Curve; },
    get ChainedUniformProvider() { return ChainedUniformProvider; },
    get DefaultUniformProvider() { return DefaultUniformProvider; },
    get MultiUniformProvider() { return MultiUniformProvider; },
    get uniforms() { return uniforms; },
    // mesh
    get arrowMesh() { return arrowMesh; },
    get boxMesh() { return boxMesh; },
    get BoxArgs() { return BoxArgs; },
    get cylinderMesh() { return cylinderMesh; },
    get sphereMesh() { return sphereMesh; },
    get vortexMesh() { return vortexMesh; },
    // objects
    get arrow() { return arrow; },
    get box() { return box; },
    get cylinder() { return cylinder; },
    get sphere() { return sphere; },
    get vortex() { return vortex; },
    // programs
    get shaderProgramFromScripts() { return shaderProgramFromScripts; },
};
module.exports = eight;
