/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
var Node = require('davinci-eight/cameras/Node');
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
var SurfaceGeometry = require('davinci-eight/geometries/SurfaceGeometry');
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
var Vector1 = require('davinci-eight/math/Vector1');
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
// curves
var Curve = require('davinci-eight/curves/Curve');
var initWebGL = require('davinci-eight/renderers/initWebGL');
var renderer = require('davinci-eight/renderers/renderer');
var contextMonitor = require('davinci-eight/utils/contextMonitor');
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
    get initWebGL() { return initWebGL; },
    get Node() { return Node; },
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
    get SurfaceGeometry() { return SurfaceGeometry; },
    get PolyhedronGeometry() { return PolyhedronGeometry; },
    get RevolutionGeometry() { return RevolutionGeometry; },
    get SphereGeometry() { return SphereGeometry; },
    get TetrahedronGeometry() { return TetrahedronGeometry; },
    get TubeGeometry() { return TubeGeometry; },
    get VortexGeometry() { return VortexGeometry; },
    get Matrix3() { return Matrix3; },
    get Matrix4() { return Matrix4; },
    get Spinor3() { return Spinor3; },
    get Quaternion() { return Quaternion; },
    get Vector1() { return Vector1; },
    get Vector2() { return Vector2; },
    get Vector3() { return Vector3; },
    get Curve() { return Curve; },
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
    // programs
    get shaderProgramFromScripts() { return shaderProgramFromScripts; },
};
module.exports = eight;
