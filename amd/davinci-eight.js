define(["require", "exports", 'davinci-eight/slideshow/Slide', 'davinci-eight/slideshow/Director', 'davinci-eight/slideshow/DirectorKeyboardHandler', 'davinci-eight/slideshow/animations/WaitAnimation', 'davinci-eight/slideshow/animations/ColorAnimation', 'davinci-eight/slideshow/animations/Vector3Animation', 'davinci-eight/slideshow/animations/Spinor3Animation', 'davinci-eight/slideshow/commands/AnimateDrawableCommand', 'davinci-eight/slideshow/commands/CreateCuboidDrawable', 'davinci-eight/slideshow/commands/DestroyDrawableCommand', 'davinci-eight/slideshow/commands/TestCommand', 'davinci-eight/slideshow/commands/TestCommand', 'davinci-eight/slideshow/commands/UseDrawableInSceneCommand', 'davinci-eight/cameras/createFrustum', 'davinci-eight/cameras/createPerspective', 'davinci-eight/cameras/createView', 'davinci-eight/cameras/frustumMatrix', 'davinci-eight/cameras/perspectiveMatrix', 'davinci-eight/cameras/viewMatrix', 'davinci-eight/commands/WebGLBlendFunc', 'davinci-eight/commands/WebGLClearColor', 'davinci-eight/commands/WebGLDisable', 'davinci-eight/commands/WebGLEnable', 'davinci-eight/core/AttribLocation', 'davinci-eight/core/Color', 'davinci-eight/core', 'davinci-eight/core/DrawMode', 'davinci-eight/core/Symbolic', 'davinci-eight/core/UniformLocation', 'davinci-eight/curves/Curve', 'davinci-eight/devices/Keyboard', 'davinci-eight/geometries/DrawAttribute', 'davinci-eight/geometries/DrawPrimitive', 'davinci-eight/geometries/Simplex', 'davinci-eight/geometries/Vertex', 'davinci-eight/geometries/simplicesToGeometryMeta', 'davinci-eight/geometries/computeFaceNormals', 'davinci-eight/geometries/cube', 'davinci-eight/geometries/quadrilateral', 'davinci-eight/geometries/square', 'davinci-eight/geometries/tetrahedron', 'davinci-eight/geometries/simplicesToDrawPrimitive', 'davinci-eight/geometries/triangle', 'davinci-eight/topologies/Topology', 'davinci-eight/topologies/PointTopology', 'davinci-eight/topologies/LineTopology', 'davinci-eight/topologies/MeshTopology', 'davinci-eight/topologies/GridTopology', 'davinci-eight/scene/createDrawList', 'davinci-eight/scene/Drawable', 'davinci-eight/scene/PerspectiveCamera', 'davinci-eight/scene/Scene', 'davinci-eight/scene/Canvas3D', 'davinci-eight/geometries/AxialSimplexGeometry', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/ArrowSimplexGeometry', 'davinci-eight/geometries/BarnSimplexGeometry', 'davinci-eight/geometries/ConeGeometry', 'davinci-eight/geometries/ConeSimplexGeometry', 'davinci-eight/geometries/CuboidGeometry', 'davinci-eight/geometries/CuboidSimplexGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/CylinderSimplexGeometry', 'davinci-eight/geometries/DodecahedronSimplexGeometry', 'davinci-eight/geometries/IcosahedronSimplexGeometry', 'davinci-eight/geometries/KleinBottleSimplexGeometry', 'davinci-eight/geometries/Simplex1Geometry', 'davinci-eight/geometries/MobiusStripSimplexGeometry', 'davinci-eight/geometries/OctahedronSimplexGeometry', 'davinci-eight/geometries/SliceSimplexGeometry', 'davinci-eight/geometries/GridSimplexGeometry', 'davinci-eight/geometries/PolyhedronSimplexGeometry', 'davinci-eight/geometries/RevolutionSimplexGeometry', 'davinci-eight/geometries/RingGeometry', 'davinci-eight/geometries/RingSimplexGeometry', 'davinci-eight/geometries/SphericalPolarSimplexGeometry', 'davinci-eight/geometries/TetrahedronSimplexGeometry', 'davinci-eight/geometries/VortexSimplexGeometry', 'davinci-eight/programs/createMaterial', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/programFromScripts', 'davinci-eight/materials/Material', 'davinci-eight/materials/HTMLScriptsMaterial', 'davinci-eight/materials/LineMaterial', 'davinci-eight/materials/MeshMaterial', 'davinci-eight/materials/MeshLambertMaterial', 'davinci-eight/materials/PointMaterial', 'davinci-eight/materials/SmartMaterialBuilder', 'davinci-eight/mappers/RoundUniform', 'davinci-eight/math/Euclidean3', 'davinci-eight/math/MutableNumber', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/MutableSpinorE3', 'davinci-eight/math/MutableVectorE2', 'davinci-eight/math/MutableVectorE3', 'davinci-eight/math/MutableVectorE4', 'davinci-eight/math/VectorN', 'davinci-eight/models/EulerFacet', 'davinci-eight/models/KinematicRigidBodyFacetE3', 'davinci-eight/models/ModelFacet', 'davinci-eight/renderers/initWebGL', 'davinci-eight/renderers/renderer', 'davinci-eight/uniforms/AmbientLight', 'davinci-eight/uniforms/ColorFacet', 'davinci-eight/uniforms/DirectionalLight', 'davinci-eight/uniforms/PointSize', 'davinci-eight/uniforms/Vector3Uniform', 'davinci-eight/utils/contextProxy', 'davinci-eight/collections/IUnknownArray', 'davinci-eight/collections/NumberIUnknownMap', 'davinci-eight/utils/refChange', 'davinci-eight/utils/Shareable', 'davinci-eight/collections/StringIUnknownMap', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, Slide, Director, DirectorKeyboardHandler, WaitAnimation, ColorAnimation, Vector3Animation, Spinor3Animation, AnimateDrawableCommand, CreateCuboidDrawable, DestroyDrawableCommand, GeometryCommand, TestCommand, UseDrawableInSceneCommand, createFrustum, createPerspective, createView, frustumMatrix, perspectiveMatrix, viewMatrix, WebGLBlendFunc, WebGLClearColor, WebGLDisable, WebGLEnable, AttribLocation, Color, core, DrawMode, Symbolic, UniformLocation, Curve, Keyboard, DrawAttribute, DrawPrimitive, Simplex, Vertex, simplicesToGeometryMeta, computeFaceNormals, cube, quadrilateral, square, tetrahedron, simplicesToDrawPrimitive, triangle, Topology, PointTopology, LineTopology, MeshTopology, GridTopology, createDrawList, Drawable, PerspectiveCamera, Scene, Canvas3D, AxialSimplexGeometry, ArrowGeometry, ArrowSimplexGeometry, BarnSimplexGeometry, ConeGeometry, ConeSimplexGeometry, CuboidGeometry, CuboidSimplexGeometry, CylinderGeometry, CylinderSimplexGeometry, DodecahedronSimplexGeometry, IcosahedronSimplexGeometry, KleinBottleSimplexGeometry, Simplex1Geometry, MobiusStripSimplexGeometry, OctahedronSimplexGeometry, SliceSimplexGeometry, GridSimplexGeometry, PolyhedronSimplexGeometry, RevolutionSimplexGeometry, RingGeometry, RingSimplexGeometry, SphericalPolarSimplexGeometry, TetrahedronSimplexGeometry, VortexSimplexGeometry, createMaterial, smartProgram, programFromScripts, Material, HTMLScriptsMaterial, LineMaterial, MeshMaterial, MeshLambertMaterial, PointMaterial, SmartMaterialBuilder, RoundUniform, Euclidean3, MutableNumber, Matrix3, Matrix4, MutableSpinorE3, MutableVectorE2, MutableVectorE3, MutableVectorE4, VectorN, EulerFacet, KinematicRigidBodyFacetE3, ModelFacet, initWebGL, renderer, AmbientLight, ColorFacet, DirectionalLight, PointSize, Vector3Uniform, contextProxy, IUnknownArray, NumberIUnknownMap, refChange, Shareable, StringIUnknownMap, workbench3D, windowAnimationRunner) {
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
        get Slide() { return Slide; },
        get Director() { return Director; },
        get DirectorKeyboardHandler() { return DirectorKeyboardHandler; },
        get ColorAnimation() { return ColorAnimation; },
        get WaitAnimation() { return WaitAnimation; },
        get Vector3Animation() { return Vector3Animation; },
        get Spinor3Animation() { return Spinor3Animation; },
        get AnimateDrawableCommand() { return AnimateDrawableCommand; },
        get CreateCuboidDrawable() { return CreateCuboidDrawable; },
        get DestroyDrawableCommand() { return DestroyDrawableCommand; },
        get GeometryCommand() { return GeometryCommand; },
        get TestCommand() { return TestCommand; },
        get UseDrawableInSceneCommand() { return UseDrawableInSceneCommand; },
        // devices
        get Keyboard() { return Keyboard; },
        // TODO: Arrange in alphabetical order in order to assess width of API.
        // materials
        get HTMLScriptsMaterial() { return HTMLScriptsMaterial; },
        get Material() { return Material; },
        get LineMaterial() { return LineMaterial; },
        get MeshMaterial() { return MeshMaterial; },
        get MeshLambertMaterial() { return MeshLambertMaterial; },
        get PointMaterial() { return PointMaterial; },
        get SmartMaterialBuilder() { return SmartMaterialBuilder; },
        //commands
        get WebGLBlendFunc() { return WebGLBlendFunc; },
        get WebGLClearColor() { return WebGLClearColor; },
        get WebGLDisable() { return WebGLDisable; },
        get WebGLEnable() { return WebGLEnable; },
        get initWebGL() { return initWebGL; },
        get createFrustum() { return createFrustum; },
        get createPerspective() { return createPerspective; },
        get createView() { return createView; },
        get EulerFacet() { return EulerFacet; },
        get KinematicRigidBodyFacetE3() { return KinematicRigidBodyFacetE3; },
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
        get AxialSimplexGeometry() { return AxialSimplexGeometry; },
        get ArrowGeometry() { return ArrowGeometry; },
        get ArrowSimplexGeometry() { return ArrowSimplexGeometry; },
        get BarnSimplexGeometry() { return BarnSimplexGeometry; },
        get ConeGeometry() { return ConeGeometry; },
        get ConeSimplexGeometry() { return ConeSimplexGeometry; },
        get CuboidGeometry() { return CuboidGeometry; },
        get CuboidSimplexGeometry() { return CuboidSimplexGeometry; },
        get CylinderGeometry() { return CylinderGeometry; },
        get CylinderSimplexGeometry() { return CylinderSimplexGeometry; },
        get DodecahedronSimplexGeometry() { return DodecahedronSimplexGeometry; },
        get IcosahedronSimplexGeometry() { return IcosahedronSimplexGeometry; },
        get KleinBottleSimplexGeometry() { return KleinBottleSimplexGeometry; },
        get Simplex1Geometry() { return Simplex1Geometry; },
        get MobiusStripSimplexGeometry() { return MobiusStripSimplexGeometry; },
        get OctahedronSimplexGeometry() { return OctahedronSimplexGeometry; },
        get GridSimplexGeometry() { return GridSimplexGeometry; },
        get PolyhedronSimplexGeometry() { return PolyhedronSimplexGeometry; },
        get RevolutionSimplexGeometry() { return RevolutionSimplexGeometry; },
        get RingGeometry() { return RingGeometry; },
        get RingSimplexGeometry() { return RingSimplexGeometry; },
        get SliceSimplexGeometry() { return SliceSimplexGeometry; },
        get SphericalPolarSimplexGeometry() { return SphericalPolarSimplexGeometry; },
        get TetrahedronSimplexGeometry() { return TetrahedronSimplexGeometry; },
        get VortexSimplexGeometry() { return VortexSimplexGeometry; },
        get Topology() { return Topology; },
        get PointTopology() { return PointTopology; },
        get LineTopology() { return LineTopology; },
        get MeshTopology() { return MeshTopology; },
        get GridTopology() { return GridTopology; },
        get Euclidean3() { return Euclidean3; },
        get Matrix3() { return Matrix3; },
        get Matrix4() { return Matrix4; },
        get MutableSpinorE3() { return MutableSpinorE3; },
        get MutableNumber() { return MutableNumber; },
        get MutableVectorE2() { return MutableVectorE2; },
        get MutableVectorE3() { return MutableVectorE3; },
        get MutableVectorE4() { return MutableVectorE4; },
        get VectorN() { return VectorN; },
        get Curve() { return Curve; },
        // mappers
        get RoundUniform() { return RoundUniform; },
        get simplicesToGeometryMeta() { return simplicesToGeometryMeta; },
        get computeFaceNormals() { return computeFaceNormals; },
        get cube() { return cube; },
        get quadrilateral() { return quadrilateral; },
        get square() { return square; },
        get tetrahedron() { return tetrahedron; },
        get triangle() { return triangle; },
        get simplicesToDrawPrimitive() { return simplicesToDrawPrimitive; },
        get Symbolic() { return Symbolic; },
        // programs
        get programFromScripts() { return programFromScripts; },
        get DrawAttribute() { return DrawAttribute; },
        get DrawPrimitive() { return DrawPrimitive; },
        // facets
        get AmbientLight() { return AmbientLight; },
        get ColorFacet() { return ColorFacet; },
        get DirectionalLight() { return DirectionalLight; },
        get PointSize() { return PointSize; },
        get Vector3Uniform() { return Vector3Uniform; },
        // utils
        get IUnknownArray() { return IUnknownArray; },
        get NumberIUnknownMap() { return NumberIUnknownMap; },
        get refChange() { return refChange; },
        get Shareable() { return Shareable; },
        get StringIUnknownMap() { return StringIUnknownMap; }
    };
    return eight;
});
