/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define(["require", "exports", 'davinci-eight/core', 'davinci-eight/core/object3D', 'davinci-eight/cameras/view', 'davinci-eight/core/Color', 'davinci-eight/cameras/frustum', 'davinci-eight/cameras/perspective', 'davinci-eight/worlds/world', 'davinci-eight/renderers/viewport', 'davinci-eight/objects/drawableModel', 'davinci-eight/core/Face3', 'davinci-eight/geometries/Geometry', 'davinci-eight/geometries/GeometryAdapter', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/DodecahedronGeometry', 'davinci-eight/geometries/IcosahedronGeometry', 'davinci-eight/geometries/KleinBottleGeometry', 'davinci-eight/geometries/MobiusStripGeometry', 'davinci-eight/geometries/OctahedronGeometry', 'davinci-eight/geometries/ParametricGeometry', 'davinci-eight/geometries/PolyhedronGeometry', 'davinci-eight/geometries/RevolutionGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/geometries/TubeGeometry', 'davinci-eight/geometries/VortexGeometry', 'davinci-eight/programs/pointsProgram', 'davinci-eight/programs/shaderProgram', 'davinci-eight/programs/smartProgram', 'davinci-eight/core/ShaderAttributeVariable', 'davinci-eight/core/ShaderUniformVariable', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/mesh/arrowMesh', 'davinci-eight/mesh/boxMesh', 'davinci-eight/objects/box', 'davinci-eight/curves/Curve', 'davinci-eight/renderers/initWebGL', 'davinci-eight/uniforms/AmbientLight', 'davinci-eight/uniforms/ChainedUniformProvider', 'davinci-eight/uniforms/DefaultUniformProvider', 'davinci-eight/uniforms/ModelMatrixUniformProvider', 'davinci-eight/utils/contextMonitor', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, core, object3D, view, Color, frustum, perspective, world, viewport, drawableModel, Face3, Geometry, GeometryAdapter, ArrowGeometry, BoxGeometry, CylinderGeometry, DodecahedronGeometry, IcosahedronGeometry, KleinBottleGeometry, MobiusStripGeometry, OctahedronGeometry, ParametricGeometry, PolyhedronGeometry, RevolutionGeometry, SphereGeometry, TetrahedronGeometry, TubeGeometry, VortexGeometry, pointsProgram, shaderProgram, smartProgram, ShaderAttributeVariable, ShaderUniformVariable, Matrix3, Matrix4, Spinor3, Vector2, Vector3, arrowMesh, boxMesh, box, Curve, initWebGL, AmbientLight, ChainedUniformProvider, DefaultUniformProvider, ModelMatrixUniformProvider, contextMonitor, workbench3D, windowAnimationRunner) {
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
    return eight;
});
