/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define(["require", "exports", 'davinci-eight/core/DataUsage', 'davinci-eight/core/DrawMode', 'davinci-eight/core', 'davinci-eight/core/object3D', 'davinci-eight/cameras/view', 'davinci-eight/core/Color', 'davinci-eight/cameras/frustum', 'davinci-eight/cameras/perspective', 'davinci-eight/worlds/world', 'davinci-eight/renderers/viewport', 'davinci-eight/objects/drawableModel', 'davinci-eight/core/Face3', 'davinci-eight/core/ShaderAttributeLocation', 'davinci-eight/core/ShaderUniformLocation', 'davinci-eight/geometries/Geometry', 'davinci-eight/geometries/GeometryAdapter', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/DodecahedronGeometry', 'davinci-eight/geometries/IcosahedronGeometry', 'davinci-eight/geometries/KleinBottleGeometry', 'davinci-eight/geometries/MobiusStripGeometry', 'davinci-eight/geometries/OctahedronGeometry', 'davinci-eight/geometries/ParametricGeometry', 'davinci-eight/geometries/PolyhedronGeometry', 'davinci-eight/geometries/RevolutionGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/geometries/TubeGeometry', 'davinci-eight/geometries/VortexGeometry', 'davinci-eight/programs/pointsProgram', 'davinci-eight/programs/shaderProgram', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/shaderProgramFromScripts', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/mesh/arrowMesh', 'davinci-eight/mesh/boxMesh', 'davinci-eight/mesh/BoxArgs', 'davinci-eight/mesh/cylinderMesh', 'davinci-eight/mesh/sphereMesh', 'davinci-eight/mesh/vortexMesh', 'davinci-eight/objects/arrow', 'davinci-eight/objects/box', 'davinci-eight/objects/cylinder', 'davinci-eight/objects/sphere', 'davinci-eight/objects/vortex', 'davinci-eight/curves/Curve', 'davinci-eight/renderers/initWebGL', 'davinci-eight/uniforms/AmbientLight', 'davinci-eight/uniforms/ChainedUniformProvider', 'davinci-eight/uniforms/DefaultUniformProvider', 'davinci-eight/uniforms/DirectionalLight', 'davinci-eight/uniforms/ModelMatrixUniformProvider', 'davinci-eight/uniforms/MultiUniformProvider', 'davinci-eight/uniforms/PointLight', 'davinci-eight/uniforms/uniforms', 'davinci-eight/uniforms/UniformFloat', 'davinci-eight/uniforms/UniformMat4', 'davinci-eight/uniforms/UniformVec2', 'davinci-eight/uniforms/UniformVec3', 'davinci-eight/uniforms/UniformVec4', 'davinci-eight/uniforms/UniformVector3', 'davinci-eight/uniforms/UniformSpinor3', 'davinci-eight/utils/contextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, DataUsage, DrawMode, core, object3D, view, Color, frustum, perspective, world, viewport, drawableModel, Face3, ShaderAttributeLocation, ShaderUniformLocation, Geometry, GeometryAdapter, ArrowGeometry, BoxGeometry, CylinderGeometry, DodecahedronGeometry, IcosahedronGeometry, KleinBottleGeometry, MobiusStripGeometry, OctahedronGeometry, ParametricGeometry, PolyhedronGeometry, RevolutionGeometry, SphereGeometry, TetrahedronGeometry, TubeGeometry, VortexGeometry, pointsProgram, shaderProgram, smartProgram, shaderProgramFromScripts, Matrix3, Matrix4, Spinor3, Vector2, Vector3, arrowMesh, boxMesh, BoxArgs, cylinderMesh, sphereMesh, vortexMesh, arrow, box, cylinder, sphere, vortex, Curve, initWebGL, AmbientLight, ChainedUniformProvider, DefaultUniformProvider, DirectionalLight, ModelMatrixUniformProvider, MultiUniformProvider, PointLight, uniforms, UniformFloat, UniformMat4, UniformVec2, UniformVec3, UniformVec4, UniformVector3, UniformSpinor3, contextMonitor, workbench3D, windowAnimationRunner) {
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
    return eight;
});
