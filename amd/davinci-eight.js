/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define(["require", "exports", 'davinci-eight/cameras/view', 'davinci-eight/cameras/frustum', 'davinci-eight/cameras/perspective', 'davinci-eight/core/DefaultAttribProvider', 'davinci-eight/core/Color', 'davinci-eight/core/DataUsage', 'davinci-eight/core/DrawMode', 'davinci-eight/core/Face3', 'davinci-eight/core', 'davinci-eight/objects/primitive', 'davinci-eight/core/DefaultUniformProvider', 'davinci-eight/core/ShaderAttribLocation', 'davinci-eight/core/ShaderUniformLocation', 'davinci-eight/drawLists/drawList', 'davinci-eight/geometries/Geometry', 'davinci-eight/geometries/GeometryAdapter', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BarnGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/DodecahedronGeometry', 'davinci-eight/geometries/EllipticalCylinderGeometry', 'davinci-eight/geometries/IcosahedronGeometry', 'davinci-eight/geometries/KleinBottleGeometry', 'davinci-eight/geometries/MobiusStripGeometry', 'davinci-eight/geometries/OctahedronGeometry', 'davinci-eight/geometries/ParametricSurfaceGeometry', 'davinci-eight/geometries/PolyhedronGeometry', 'davinci-eight/geometries/RevolutionGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/geometries/TubeGeometry', 'davinci-eight/geometries/VortexGeometry', 'davinci-eight/programs/pointsProgram', 'davinci-eight/programs/shaderProgram', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/shaderProgramFromScripts', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/mesh/arrowMesh', 'davinci-eight/mesh/ArrowBuilder', 'davinci-eight/mesh/boxMesh', 'davinci-eight/mesh/BoxBuilder', 'davinci-eight/mesh/cylinderMesh', 'davinci-eight/mesh/CylinderArgs', 'davinci-eight/mesh/sphereMesh', 'davinci-eight/mesh/SphereBuilder', 'davinci-eight/mesh/vortexMesh', 'davinci-eight/objects/arrow', 'davinci-eight/objects/box', 'davinci-eight/objects/cylinder', 'davinci-eight/objects/sphere', 'davinci-eight/objects/vortex', 'davinci-eight/curves/Curve', 'davinci-eight/renderers/initWebGL', 'davinci-eight/renderers/renderer', 'davinci-eight/renderers/viewport', 'davinci-eight/renderers/webGLRenderer', 'davinci-eight/uniforms/AmbientLight', 'davinci-eight/uniforms/ChainedUniformProvider', 'davinci-eight/uniforms/DirectionalLight', 'davinci-eight/uniforms/LocalModel', 'davinci-eight/uniforms/Node', 'davinci-eight/uniforms/TreeModel', 'davinci-eight/uniforms/UniversalJoint', 'davinci-eight/uniforms/MultiUniformProvider', 'davinci-eight/uniforms/PointLight', 'davinci-eight/uniforms/uniforms', 'davinci-eight/uniforms/UniformFloat', 'davinci-eight/uniforms/UniformMat4', 'davinci-eight/uniforms/UniformVec2', 'davinci-eight/uniforms/UniformVec3', 'davinci-eight/uniforms/UniformVec4', 'davinci-eight/uniforms/UniformVector3', 'davinci-eight/uniforms/UniformSpinor3', 'davinci-eight/utils/contextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, view, frustum, perspective, DefaultAttribProvider, Color, DataUsage, DrawMode, Face3, core, primitive, DefaultUniformProvider, ShaderAttribLocation, ShaderUniformLocation, drawList, Geometry, GeometryAdapter, ArrowGeometry, BarnGeometry, BoxGeometry, CylinderGeometry, DodecahedronGeometry, EllipticalCylinderGeometry, IcosahedronGeometry, KleinBottleGeometry, MobiusStripGeometry, OctahedronGeometry, ParametricSurfaceGeometry, PolyhedronGeometry, RevolutionGeometry, SphereGeometry, TetrahedronGeometry, TubeGeometry, VortexGeometry, pointsProgram, shaderProgram, smartProgram, shaderProgramFromScripts, Matrix3, Matrix4, Spinor3, Vector2, Vector3, arrowMesh, ArrowBuilder, boxMesh, BoxBuilder, cylinderMesh, CylinderArgs, sphereMesh, SphereBuilder, vortexMesh, arrow, box, cylinder, sphere, vortex, Curve, initWebGL, renderer, viewport, webGLRenderer, AmbientLight, ChainedUniformProvider, DirectionalLight, LocalModel, Node, TreeModel, UniversalJoint, MultiUniformProvider, PointLight, uniforms, UniformFloat, UniformMat4, UniformVec2, UniformVec3, UniformVec4, UniformVector3, UniformSpinor3, contextMonitor, workbench3D, windowAnimationRunner) {
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
        get drawList() { return drawList; },
        get renderer() { return renderer; },
        get viewport() { return viewport; },
        get webGLRenderer() { return webGLRenderer; },
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
        get BarnGeometry() { return BarnGeometry; },
        get BoxGeometry() { return BoxGeometry; },
        get CylinderGeometry() { return CylinderGeometry; },
        get EllipticalCylinderGeometry() { return EllipticalCylinderGeometry; },
        get DodecahedronGeometry() { return DodecahedronGeometry; },
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
        get cylinderMesh() { return cylinderMesh; },
        get CylinderArgs() { return CylinderArgs; },
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
    return eight;
});
