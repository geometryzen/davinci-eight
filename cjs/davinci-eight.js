/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var frustum = require('davinci-eight/cameras/frustum');
var frustumMatrix = require('davinci-eight/cameras/frustumMatrix');
var perspective = require('davinci-eight/cameras/perspective');
var perspectiveMatrix = require('davinci-eight/cameras/perspectiveMatrix');
var view = require('davinci-eight/cameras/view');
var viewMatrix = require('davinci-eight/cameras/viewMatrix');
var DefaultAttribProvider = require('davinci-eight/core/DefaultAttribProvider');
var Color = require('davinci-eight/core/Color');
var DataUsage = require('davinci-eight/core/DataUsage');
var DrawMode = require('davinci-eight/core/DrawMode');
var Face3 = require('davinci-eight/core/Face3');
var core = require('davinci-eight/core');
var primitive = require('davinci-eight/objects/primitive');
var DefaultUniformProvider = require('davinci-eight/core/DefaultUniformProvider');
var ShaderAttribLocation = require('davinci-eight/core/ShaderAttribLocation');
var ShaderUniformLocation = require('davinci-eight/core/ShaderUniformLocation');
// drawLists
var scene = require('davinci-eight/drawLists/scene');
// geometries
var Geometry = require('davinci-eight/geometries/Geometry');
var GeometryAdapter = require('davinci-eight/geometries/GeometryAdapter');
var ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
var BarnGeometry = require('davinci-eight/geometries/BarnGeometry');
var BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
var CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
var DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
var EllipticalCylinderGeometry = require('davinci-eight/geometries/EllipticalCylinderGeometry');
var IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
var KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
var MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
var OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
var ParametricSurfaceGeometry = require('davinci-eight/geometries/ParametricSurfaceGeometry');
var PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
var RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
var SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
var TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
var TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
var VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
// programs
var shaderProgram = require('davinci-eight/programs/shaderProgram');
var smartProgram = require('davinci-eight/programs/smartProgram');
var shaderProgramFromScripts = require('davinci-eight/programs/shaderProgramFromScripts');
var Matrix3 = require('davinci-eight/math/Matrix3');
var Matrix4 = require('davinci-eight/math/Matrix4');
var Quaternion = require('davinci-eight/math/Quaternion');
var Spinor3 = require('davinci-eight/math/Spinor3');
var Vector2 = require('davinci-eight/math/Vector2');
var Vector3 = require('davinci-eight/math/Vector3');
// mesh
var arrowMesh = require('davinci-eight/mesh/arrowMesh');
var ArrowBuilder = require('davinci-eight/mesh/ArrowBuilder');
var boxMesh = require('davinci-eight/mesh/boxMesh');
var BoxBuilder = require('davinci-eight/mesh/BoxBuilder');
var cylinderMesh = require('davinci-eight/mesh/cylinderMesh');
var CylinderArgs = require('davinci-eight/mesh/CylinderArgs');
var CylinderMeshBuilder = require('davinci-eight/mesh/CylinderMeshBuilder');
var sphereMesh = require('davinci-eight/mesh/sphereMesh');
var SphereBuilder = require('davinci-eight/mesh/SphereBuilder');
var vortexMesh = require('davinci-eight/mesh/vortexMesh');
var arrow = require('davinci-eight/objects/arrow');
var box = require('davinci-eight/objects/box');
var cylinder = require('davinci-eight/objects/cylinder');
var sphere = require('davinci-eight/objects/sphere');
var vortex = require('davinci-eight/objects/vortex');
var Curve = require('davinci-eight/curves/Curve');
var initWebGL = require('davinci-eight/renderers/initWebGL');
var renderer = require('davinci-eight/renderers/renderer');
// uniforms
var AmbientLight = require('davinci-eight/uniforms/AmbientLight');
var ChainedUniformProvider = require('davinci-eight/uniforms/ChainedUniformProvider');
var DirectionalLight = require('davinci-eight/uniforms/DirectionalLight');
var LocalModel = require('davinci-eight/uniforms/LocalModel');
var Node = require('davinci-eight/uniforms/Node');
var TreeModel = require('davinci-eight/uniforms/TreeModel');
var UniversalJoint = require('davinci-eight/uniforms/UniversalJoint');
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
    get frustum() { return frustum; },
    get frustumMatrix() { return frustumMatrix; },
    get perspective() { return perspective; },
    get perspectiveMatrix() { return perspectiveMatrix; },
    get view() { return view; },
    get viewMatrix() { return viewMatrix; },
    get scene() { return scene; },
    get renderer() { return renderer; },
    get contextMonitor() { return contextMonitor; },
    workbench: workbench3D,
    animation: windowAnimationRunner,
    get DataUsage() { return DataUsage; },
    get DefaultAttribProvider() { return DefaultAttribProvider; },
    get DefaultUniformProvider() { return DefaultUniformProvider; },
    get primitive() { return primitive; },
    get DrawMode() { return DrawMode; },
    get ShaderAttribLocation() { return ShaderAttribLocation; },
    get ShaderUniformLocation() { return ShaderUniformLocation; },
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
    get BarnGeometry() { return BarnGeometry; },
    get BoxGeometry() { return BoxGeometry; },
    get CylinderGeometry() { return CylinderGeometry; },
    get DodecahedronGeometry() { return DodecahedronGeometry; },
    get EllipticalCylinderGeometry() { return EllipticalCylinderGeometry; },
    get IcosahedronGeometry() { return IcosahedronGeometry; },
    get KleinBottleGeometry() { return KleinBottleGeometry; },
    get MobiusStripGeometry() { return MobiusStripGeometry; },
    get OctahedronGeometry() { return OctahedronGeometry; },
    get ParametricSurfaceGeometry() { return ParametricSurfaceGeometry; },
    get PolyhedronGeometry() { return PolyhedronGeometry; },
    get RevolutionGeometry() { return RevolutionGeometry; },
    get SphereGeometry() { return SphereGeometry; },
    get TetrahedronGeometry() { return TetrahedronGeometry; },
    get TubeGeometry() { return TubeGeometry; },
    get VortexGeometry() { return VortexGeometry; },
    get LocalModel() { return LocalModel; },
    get Node() { return Node; },
    get TreeModel() { return TreeModel; },
    get UniversalJoint() { return UniversalJoint; },
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
    get Quaternion() { return Quaternion; },
    get Vector2() { return Vector2; },
    get Vector3() { return Vector3; },
    get Curve() { return Curve; },
    get ChainedUniformProvider() { return ChainedUniformProvider; },
    get MultiUniformProvider() { return MultiUniformProvider; },
    get uniforms() { return uniforms; },
    // mesh
    get arrowMesh() { return arrowMesh; },
    get ArrowBuilder() { return ArrowBuilder; },
    get boxMesh() { return boxMesh; },
    get BoxBuilder() { return BoxBuilder; },
    get CylinderArgs() { return CylinderArgs; },
    get cylinderMesh() { return cylinderMesh; },
    get CylinderMeshBuilder() { return CylinderMeshBuilder; },
    get sphereMesh() { return sphereMesh; },
    get SphereBuilder() { return SphereBuilder; },
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
