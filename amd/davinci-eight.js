/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
define(["require", "exports", 'davinci-eight/slideshow/Animator', 'davinci-eight/slideshow/Director', 'davinci-eight/slideshow/animations/Animation', 'davinci-eight/slideshow/animations/ColorTo', 'davinci-eight/slideshow/animations/MoveTo', 'davinci-eight/slideshow/animations/SpinTo', 'davinci-eight/slideshow/tasks/ColorTask', 'davinci-eight/slideshow/tasks/CubeTask', 'davinci-eight/slideshow/tasks/MoveTask', 'davinci-eight/slideshow/tasks/SpinTask', 'davinci-eight/cameras/createFrustum', 'davinci-eight/cameras/createPerspective', 'davinci-eight/cameras/createView', 'davinci-eight/cameras/frustumMatrix', 'davinci-eight/cameras/perspectiveMatrix', 'davinci-eight/cameras/viewMatrix', 'davinci-eight/commands/WebGLClear', 'davinci-eight/commands/WebGLClearColor', 'davinci-eight/commands/WebGLEnable', 'davinci-eight/core/AttribLocation', 'davinci-eight/core/Color', 'davinci-eight/core', 'davinci-eight/core/DrawMode', 'davinci-eight/core/Symbolic', 'davinci-eight/core/UniformLocation', 'davinci-eight/curves/Curve', 'davinci-eight/geometries/GeometryAttribute', 'davinci-eight/geometries/Simplex', 'davinci-eight/geometries/Vertex', 'davinci-eight/geometries/toGeometryMeta', 'davinci-eight/geometries/computeFaceNormals', 'davinci-eight/geometries/cube', 'davinci-eight/geometries/quadrilateral', 'davinci-eight/geometries/square', 'davinci-eight/geometries/tetrahedron', 'davinci-eight/geometries/toGeometryData', 'davinci-eight/geometries/triangle', 'davinci-eight/scene/createDrawList', 'davinci-eight/scene/Drawable', 'davinci-eight/scene/PerspectiveCamera', 'davinci-eight/scene/Scene', 'davinci-eight/scene/Canvas3D', 'davinci-eight/geometries/GeometryElements', 'davinci-eight/geometries/BarnGeometry', 'davinci-eight/geometries/CuboidGeometry', 'davinci-eight/geometries/DodecahedronGeometry', 'davinci-eight/geometries/IcosahedronGeometry', 'davinci-eight/geometries/KleinBottleGeometry', 'davinci-eight/geometries/Simplex1Geometry', 'davinci-eight/geometries/MobiusStripGeometry', 'davinci-eight/geometries/OctahedronGeometry', 'davinci-eight/geometries/SurfaceGeometry', 'davinci-eight/geometries/PolyhedronGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/programs/createMaterial', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/programFromScripts', 'davinci-eight/materials/Material', 'davinci-eight/materials/HTMLScriptsMaterial', 'davinci-eight/materials/LineMaterial', 'davinci-eight/materials/MeshMaterial', 'davinci-eight/materials/PointMaterial', 'davinci-eight/materials/SmartMaterialBuilder', 'davinci-eight/mappers/RoundUniform', 'davinci-eight/math/Euclidean3', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector1', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/math/Vector4', 'davinci-eight/math/VectorN', 'davinci-eight/mesh/ArrowBuilder', 'davinci-eight/mesh/CylinderArgs', 'davinci-eight/models/EulerFacet', 'davinci-eight/models/ModelFacet', 'davinci-eight/renderers/initWebGL', 'davinci-eight/renderers/renderer', 'davinci-eight/uniforms/ColorFacet', 'davinci-eight/uniforms/SineWaveUniform', 'davinci-eight/utils/contextProxy', 'davinci-eight/utils/IUnknownArray', 'davinci-eight/utils/NumberIUnknownMap', 'davinci-eight/utils/refChange', 'davinci-eight/utils/Shareable', 'davinci-eight/utils/StringIUnknownMap', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, Animator, Director, Animation, ColorTo, MoveTo, SpinTo, ColorTask, CubeTask, MoveTask, SpinTask, createFrustum, createPerspective, createView, frustumMatrix, perspectiveMatrix, viewMatrix, WebGLClear, WebGLClearColor, WebGLEnable, AttribLocation, Color, core, DrawMode, Symbolic, UniformLocation, Curve, GeometryAttribute, Simplex, Vertex, toGeometryMeta, computeFaceNormals, cube, quadrilateral, square, tetrahedron, toGeometryData, triangle, createDrawList, Drawable, PerspectiveCamera, Scene, Canvas3D, GeometryElements, BarnGeometry, CuboidGeometry, DodecahedronGeometry, IcosahedronGeometry, KleinBottleGeometry, Simplex1Geometry, MobiusStripGeometry, OctahedronGeometry, SurfaceGeometry, PolyhedronGeometry, SphereGeometry, TetrahedronGeometry, createMaterial, smartProgram, programFromScripts, Material, HTMLScriptsMaterial, LineMaterial, MeshMaterial, PointMaterial, SmartMaterialBuilder, RoundUniform, Euclidean3, Matrix3, Matrix4, Spinor3, Vector1, Vector2, Vector3, Vector4, VectorN, ArrowBuilder, CylinderArgs, EulerFacet, ModelFacet, initWebGL, renderer, ColorFacet, SineWaveUniform, contextProxy, IUnknownArray, NumberIUnknownMap, refChange, Shareable, StringIUnknownMap, workbench3D, windowAnimationRunner) {
    /**
     * @module EIGHT
     */
    var eight = {
        /**
         * The publish date of the latest version of the library.
         * @property LAST_MODIFIED
         * @type string
         * @readOnly
         */
        get LAST_MODIFIED() { return core.LAST_MODIFIED; },
        get strict() {
            return core.strict;
        },
        set strict(value) {
            core.strict = value;
        },
        /**
         * The semantic version of the library.
         * @property VERSION
         * @type string
         * @readOnly
         */
        get VERSION() { return core.VERSION; },
        // slideshow
        get Animator() { return Animator; },
        get Director() { return Director; },
        get Animation() { return Animation; },
        get ColorTo() { return ColorTo; },
        get MoveTo() { return MoveTo; },
        get SpinTo() { return SpinTo; },
        get ColorTask() { return ColorTask; },
        get CubeTask() { return CubeTask; },
        get MoveTask() { return MoveTask; },
        get SpinTask() { return SpinTask; },
        // TODO: Arrange in alphabetical order in order to assess width of API.
        // materials
        get HTMLScriptsMaterial() { return HTMLScriptsMaterial; },
        get Material() { return Material; },
        get LineMaterial() { return LineMaterial; },
        get MeshMaterial() { return MeshMaterial; },
        get PointMaterial() { return PointMaterial; },
        get SmartMaterialBuilder() { return SmartMaterialBuilder; },
        //commands
        get WebGLClear() { return WebGLClear; },
        get WebGLClearColor() { return WebGLClearColor; },
        get WebGLEnable() { return WebGLEnable; },
        get initWebGL() { return initWebGL; },
        get createFrustum() { return createFrustum; },
        get createPerspective() { return createPerspective; },
        get createView() { return createView; },
        get EulerFacet() { return EulerFacet; },
        get ModelFacet() { return ModelFacet; },
        get Simplex() { return Simplex; },
        get Vertex() { return Vertex; },
        get frustumMatrix() { return frustumMatrix; },
        get perspectiveMatrix() { return perspectiveMatrix; },
        get viewMatrix() { return viewMatrix; },
        get Scene() { return Scene; },
        get Drawable() { return Drawable; },
        get PerspectiveCamera() { return PerspectiveCamera; },
        get Canvas3D() { return Canvas3D; },
        get createDrawList() { return createDrawList; },
        get renderer() { return renderer; },
        get webgl() { return contextProxy; },
        workbench: workbench3D,
        animation: windowAnimationRunner,
        get DrawMode() { return DrawMode; },
        get AttribLocation() { return AttribLocation; },
        get UniformLocation() { return UniformLocation; },
        get createMaterial() {
            return createMaterial;
        },
        get smartProgram() {
            return smartProgram;
        },
        get Color() { return Color; },
        get CompatcGeometry() { return GeometryElements; },
        //  get ArrowGeometry() { return ArrowGeometry },
        get BarnGeometry() { return BarnGeometry; },
        get CuboidGeometry() { return CuboidGeometry; },
        //  get CylinderGeometry() { return CylinderGeometry },
        get DodecahedronGeometry() { return DodecahedronGeometry; },
        //  get EllipticalCylinderGeometry() { return EllipticalCylinderGeometry },
        get IcosahedronGeometry() { return IcosahedronGeometry; },
        get KleinBottleGeometry() { return KleinBottleGeometry; },
        get Simplex1Geometry() { return Simplex1Geometry; },
        get MobiusStripGeometry() { return MobiusStripGeometry; },
        get OctahedronGeometry() { return OctahedronGeometry; },
        get SurfaceGeometry() { return SurfaceGeometry; },
        get PolyhedronGeometry() { return PolyhedronGeometry; },
        //  get RevolutionGeometry() { return RevolutionGeometry },
        get SphereGeometry() { return SphereGeometry; },
        get TetrahedronGeometry() { return TetrahedronGeometry; },
        //  get TubeGeometry() { return TubeGeometry },
        //  get VortexGeometry() { return VortexGeometry },
        get Euclidean3() { return Euclidean3; },
        get Matrix3() { return Matrix3; },
        get Matrix4() { return Matrix4; },
        get Spinor3() { return Spinor3; },
        get Vector1() { return Vector1; },
        get Vector2() { return Vector2; },
        get Vector3() { return Vector3; },
        get Vector4() { return Vector4; },
        get VectorN() { return VectorN; },
        get Curve() { return Curve; },
        // mappers
        get RoundUniform() { return RoundUniform; },
        // mesh
        get ArrowBuilder() { return ArrowBuilder; },
        get toGeometryMeta() { return toGeometryMeta; },
        get computeFaceNormals() { return computeFaceNormals; },
        get cube() { return cube; },
        get quadrilateral() { return quadrilateral; },
        get square() { return square; },
        get tetrahedron() { return tetrahedron; },
        get triangle() { return triangle; },
        get toGeometryData() { return toGeometryData; },
        get CylinderArgs() { return CylinderArgs; },
        get Symbolic() { return Symbolic; },
        // programs
        get programFromScripts() { return programFromScripts; },
        get GeometryAttribute() { return GeometryAttribute; },
        get GeometryElements() { return GeometryElements; },
        // uniforms
        get ColorFacet() { return ColorFacet; },
        get SineWaveUniform() { return SineWaveUniform; },
        // utils
        get IUnknownArray() { return IUnknownArray; },
        get NumberIUnknownMap() { return NumberIUnknownMap; },
        get refChange() { return refChange; },
        get Shareable() { return Shareable; },
        get StringIUnknownMap() { return StringIUnknownMap; }
    };
    return eight;
});
