/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define(["require", "exports", 'davinci-eight/cameras/Node', 'davinci-eight/cameras/frustum', 'davinci-eight/cameras/frustumMatrix', 'davinci-eight/cameras/perspective', 'davinci-eight/cameras/perspectiveMatrix', 'davinci-eight/cameras/view', 'davinci-eight/cameras/viewMatrix', 'davinci-eight/core/DefaultAttribProvider', 'davinci-eight/core/Color', 'davinci-eight/core/DataUsage', 'davinci-eight/core/DrawMode', 'davinci-eight/core/Face3', 'davinci-eight/core', 'davinci-eight/objects/primitive', 'davinci-eight/core/VertexBuffer', 'davinci-eight/core/AttribLocation', 'davinci-eight/core/UniformLocation', 'davinci-eight/drawLists/scene', 'davinci-eight/geometries/Geometry', 'davinci-eight/geometries/GeometryAdapter', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BarnGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/DodecahedronGeometry', 'davinci-eight/geometries/EllipticalCylinderGeometry', 'davinci-eight/geometries/IcosahedronGeometry', 'davinci-eight/geometries/KleinBottleGeometry', 'davinci-eight/geometries/MobiusStripGeometry', 'davinci-eight/geometries/OctahedronGeometry', 'davinci-eight/geometries/SurfaceGeometry', 'davinci-eight/geometries/PolyhedronGeometry', 'davinci-eight/geometries/RevolutionGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/geometries/TubeGeometry', 'davinci-eight/geometries/VortexGeometry', 'davinci-eight/programs/shaderProgram', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/programFromScripts', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/Quaternion', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector1', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/mesh/arrowMesh', 'davinci-eight/mesh/ArrowBuilder', 'davinci-eight/mesh/boxMesh', 'davinci-eight/mesh/BoxBuilder', 'davinci-eight/mesh/cylinderMesh', 'davinci-eight/mesh/CylinderArgs', 'davinci-eight/mesh/CylinderMeshBuilder', 'davinci-eight/mesh/sphereMesh', 'davinci-eight/mesh/SphereBuilder', 'davinci-eight/mesh/vortexMesh', 'davinci-eight/curves/Curve', 'davinci-eight/renderers/initWebGL', 'davinci-eight/renderers/renderer', 'davinci-eight/utils/contextProxy', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, Node, frustum, frustumMatrix, perspective, perspectiveMatrix, view, viewMatrix, DefaultAttribProvider, Color, DataUsage, DrawMode, Face3, core, primitive, VertexBuffer, AttribLocation, UniformLocation, scene, Geometry, GeometryAdapter, ArrowGeometry, BarnGeometry, BoxGeometry, CylinderGeometry, DodecahedronGeometry, EllipticalCylinderGeometry, IcosahedronGeometry, KleinBottleGeometry, MobiusStripGeometry, OctahedronGeometry, SurfaceGeometry, PolyhedronGeometry, RevolutionGeometry, SphereGeometry, TetrahedronGeometry, TubeGeometry, VortexGeometry, shaderProgram, smartProgram, programFromScripts, Matrix3, Matrix4, Quaternion, Spinor3, Vector1, Vector2, Vector3, arrowMesh, ArrowBuilder, boxMesh, BoxBuilder, cylinderMesh, CylinderArgs, CylinderMeshBuilder, sphereMesh, SphereBuilder, vortexMesh, Curve, initWebGL, renderer, contextProxy, workbench3D, windowAnimationRunner) {
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
        get webgl() { return contextProxy; },
        workbench: workbench3D,
        animation: windowAnimationRunner,
        get DataUsage() { return DataUsage; },
        get DefaultAttribProvider() { return DefaultAttribProvider; },
        get primitive() { return primitive; },
        get DrawMode() { return DrawMode; },
        get VertexBuffer() { return VertexBuffer; },
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
        get programFromScripts() { return programFromScripts; },
    };
    return eight;
});
