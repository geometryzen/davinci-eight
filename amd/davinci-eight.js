/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define(["require", "exports", 'davinci-eight/cameras/frustum', 'davinci-eight/cameras/frustumMatrix', 'davinci-eight/cameras/perspective', 'davinci-eight/cameras/perspectiveMatrix', 'davinci-eight/cameras/view', 'davinci-eight/cameras/viewMatrix', 'davinci-eight/core/AttribLocation', 'davinci-eight/core/Color', 'davinci-eight/core', 'davinci-eight/core/DrawMode', 'davinci-eight/core/Face3', 'davinci-eight/core/Symbolic', 'davinci-eight/core/UniformLocation', 'davinci-eight/curves/Curve', 'davinci-eight/dfx/DrawAttribute', 'davinci-eight/dfx/DrawElements', 'davinci-eight/dfx/Simplex', 'davinci-eight/dfx/Vertex', 'davinci-eight/dfx/checkGeometry', 'davinci-eight/dfx/computeFaceNormals', 'davinci-eight/dfx/cube', 'davinci-eight/dfx/quadrilateral', 'davinci-eight/dfx/square', 'davinci-eight/dfx/tetrahedron', 'davinci-eight/dfx/toDrawElements', 'davinci-eight/dfx/triangle', 'davinci-eight/scene/createDrawList', 'davinci-eight/scene/Material', 'davinci-eight/scene/Mesh', 'davinci-eight/scene/MeshNormalMaterial', 'davinci-eight/scene/PerspectiveCamera', 'davinci-eight/scene/Scene', 'davinci-eight/scene/WebGLRenderer', 'davinci-eight/geometries/Geometry', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BarnGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/DodecahedronGeometry', 'davinci-eight/geometries/EllipticalCylinderGeometry', 'davinci-eight/geometries/IcosahedronGeometry', 'davinci-eight/geometries/KleinBottleGeometry', 'davinci-eight/geometries/MobiusStripGeometry', 'davinci-eight/geometries/OctahedronGeometry', 'davinci-eight/geometries/SurfaceGeometry', 'davinci-eight/geometries/PolyhedronGeometry', 'davinci-eight/geometries/RevolutionGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/geometries/TubeGeometry', 'davinci-eight/geometries/VortexGeometry', 'davinci-eight/programs/shaderProgram', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/programFromScripts', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/Quaternion', 'davinci-eight/math/rotor3', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector1', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/math/Vector4', 'davinci-eight/math/VectorN', 'davinci-eight/mesh/ArrowBuilder', 'davinci-eight/mesh/CylinderArgs', 'davinci-eight/renderers/initWebGL', 'davinci-eight/renderers/renderer', 'davinci-eight/utils/contextProxy', 'davinci-eight/utils/Model', 'davinci-eight/utils/refChange', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, frustum, frustumMatrix, perspective, perspectiveMatrix, view, viewMatrix, AttribLocation, Color, core, DrawMode, Face3, Symbolic, UniformLocation, Curve, DrawAttribute, DrawElements, Simplex, Vertex, checkGeometry, computeFaceNormals, cube, quadrilateral, square, tetrahedron, toDrawElements, triangle, createDrawList, Material, Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, WebGLRenderer, Geometry, ArrowGeometry, BarnGeometry, BoxGeometry, CylinderGeometry, DodecahedronGeometry, EllipticalCylinderGeometry, IcosahedronGeometry, KleinBottleGeometry, MobiusStripGeometry, OctahedronGeometry, SurfaceGeometry, PolyhedronGeometry, RevolutionGeometry, SphereGeometry, TetrahedronGeometry, TubeGeometry, VortexGeometry, shaderProgram, smartProgram, programFromScripts, Matrix3, Matrix4, Quaternion, rotor3, Spinor3, Vector1, Vector2, Vector3, Vector4, VectorN, ArrowBuilder, CylinderArgs, initWebGL, renderer, contextProxy, Model, refChange, workbench3D, windowAnimationRunner) {
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
    return eight;
});
