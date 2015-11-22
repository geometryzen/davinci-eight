define(["require", "exports", 'davinci-eight/slideshow/Slide', 'davinci-eight/slideshow/Director', 'davinci-eight/slideshow/DirectorKeyboardHandler', 'davinci-eight/slideshow/animations/WaitAnimation', 'davinci-eight/slideshow/animations/ColorAnimation', 'davinci-eight/slideshow/animations/Vector2Animation', 'davinci-eight/slideshow/animations/Vector3Animation', 'davinci-eight/slideshow/animations/Spinor2Animation', 'davinci-eight/slideshow/animations/Spinor3Animation', 'davinci-eight/cameras/createFrustum', 'davinci-eight/cameras/createPerspective', 'davinci-eight/cameras/createView', 'davinci-eight/cameras/frustumMatrix', 'davinci-eight/cameras/perspectiveMatrix', 'davinci-eight/cameras/viewMatrix', 'davinci-eight/commands/BlendFactor', 'davinci-eight/commands/WebGLBlendFunc', 'davinci-eight/commands/WebGLClearColor', 'davinci-eight/commands/Capability', 'davinci-eight/commands/WebGLDisable', 'davinci-eight/commands/WebGLEnable', 'davinci-eight/core/AttribLocation', 'davinci-eight/core/Color', 'davinci-eight/core', 'davinci-eight/core/DrawMode', 'davinci-eight/core/GraphicsProgramSymbols', 'davinci-eight/core/UniformLocation', 'davinci-eight/curves/Curve', 'davinci-eight/devices/Keyboard', 'davinci-eight/geometries/DrawAttribute', 'davinci-eight/geometries/DrawPrimitive', 'davinci-eight/geometries/Simplex', 'davinci-eight/geometries/Vertex', 'davinci-eight/geometries/simplicesToGeometryMeta', 'davinci-eight/geometries/computeFaceNormals', 'davinci-eight/geometries/cube', 'davinci-eight/geometries/quadrilateral', 'davinci-eight/geometries/square', 'davinci-eight/geometries/tetrahedron', 'davinci-eight/geometries/simplicesToDrawPrimitive', 'davinci-eight/geometries/triangle', 'davinci-eight/topologies/Topology', 'davinci-eight/topologies/PointTopology', 'davinci-eight/topologies/LineTopology', 'davinci-eight/topologies/MeshTopology', 'davinci-eight/topologies/GridTopology', 'davinci-eight/scene/createDrawList', 'davinci-eight/scene/Drawable', 'davinci-eight/scene/PerspectiveCamera', 'davinci-eight/scene/Scene', 'davinci-eight/scene/GraphicsContext', 'davinci-eight/geometries/AxialSimplexGeometry', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BarnSimplexGeometry', 'davinci-eight/geometries/ConeGeometry', 'davinci-eight/geometries/ConeSimplexGeometry', 'davinci-eight/geometries/CuboidGeometry', 'davinci-eight/geometries/CuboidSimplexGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/CylinderSimplexGeometry', 'davinci-eight/geometries/DodecahedronSimplexGeometry', 'davinci-eight/geometries/IcosahedronSimplexGeometry', 'davinci-eight/geometries/KleinBottleSimplexGeometry', 'davinci-eight/geometries/Simplex1Geometry', 'davinci-eight/geometries/MobiusStripSimplexGeometry', 'davinci-eight/geometries/OctahedronSimplexGeometry', 'davinci-eight/geometries/SliceSimplexGeometry', 'davinci-eight/geometries/GridSimplexGeometry', 'davinci-eight/geometries/PolyhedronSimplexGeometry', 'davinci-eight/geometries/RevolutionSimplexGeometry', 'davinci-eight/geometries/RingGeometry', 'davinci-eight/geometries/RingSimplexGeometry', 'davinci-eight/geometries/SphericalPolarSimplexGeometry', 'davinci-eight/geometries/TetrahedronSimplexGeometry', 'davinci-eight/geometries/VortexSimplexGeometry', 'davinci-eight/programs/createGraphicsProgram', 'davinci-eight/programs/smartProgram', 'davinci-eight/programs/programFromScripts', 'davinci-eight/materials/GraphicsProgram', 'davinci-eight/materials/HTMLScriptsGraphicsProgram', 'davinci-eight/materials/LineMaterial', 'davinci-eight/materials/MeshMaterial', 'davinci-eight/materials/MeshLambertMaterial', 'davinci-eight/materials/PointMaterial', 'davinci-eight/materials/GraphicsProgramBuilder', 'davinci-eight/mappers/RoundUniform', 'davinci-eight/math/Dimensions', 'davinci-eight/math/Euclidean2', 'davinci-eight/math/Euclidean3', 'davinci-eight/math/mathcore', 'davinci-eight/math/R1', 'davinci-eight/math/Mat2R', 'davinci-eight/math/Mat3R', 'davinci-eight/math/Mat4R', 'davinci-eight/math/QQ', 'davinci-eight/math/Unit', 'davinci-eight/math/G2', 'davinci-eight/math/G3', 'davinci-eight/math/SpinG2', 'davinci-eight/math/SpinG3', 'davinci-eight/math/R2', 'davinci-eight/math/R3', 'davinci-eight/math/R4', 'davinci-eight/math/VectorN', 'davinci-eight/facets/AmbientLight', 'davinci-eight/facets/ColorFacet', 'davinci-eight/facets/DirectionalLightE3', 'davinci-eight/facets/EulerFacet', 'davinci-eight/facets/ModelFacetE3', 'davinci-eight/facets/PointSizeFacet', 'davinci-eight/facets/ReflectionFacetE2', 'davinci-eight/facets/ReflectionFacetE3', 'davinci-eight/facets/RigidBodyFacetE3', 'davinci-eight/facets/Vector3Facet', 'davinci-eight/models/ModelE2', 'davinci-eight/models/ModelE3', 'davinci-eight/models/RigidBodyE2', 'davinci-eight/models/RigidBodyE3', 'davinci-eight/renderers/initWebGL', 'davinci-eight/renderers/renderer', 'davinci-eight/utils/contextProxy', 'davinci-eight/utils/getCanvasElementById', 'davinci-eight/collections/IUnknownArray', 'davinci-eight/collections/NumberIUnknownMap', 'davinci-eight/utils/refChange', 'davinci-eight/utils/Shareable', 'davinci-eight/collections/StringIUnknownMap', 'davinci-eight/utils/workbench3D', 'davinci-eight/utils/windowAnimationRunner'], function (require, exports, Slide, Director, DirectorKeyboardHandler, WaitAnimation, ColorAnimation, Vector2Animation, Vector3Animation, Spinor2Animation, Spinor3Animation, createFrustum, createPerspective, createView, frustumMatrix, perspectiveMatrix, viewMatrix, BlendFactor, WebGLBlendFunc, WebGLClearColor, Capability, WebGLDisable, WebGLEnable, AttribLocation, Color, core, DrawMode, GraphicsProgramSymbols, UniformLocation, Curve, Keyboard, DrawAttribute, DrawPrimitive, Simplex, Vertex, simplicesToGeometryMeta, computeFaceNormals, cube, quadrilateral, square, tetrahedron, simplicesToDrawPrimitive, triangle, Topology, PointTopology, LineTopology, MeshTopology, GridTopology, createDrawList, Drawable, PerspectiveCamera, Scene, GraphicsContext, AxialSimplexGeometry, ArrowGeometry, BarnSimplexGeometry, ConeGeometry, ConeSimplexGeometry, CuboidGeometry, CuboidSimplexGeometry, CylinderGeometry, CylinderSimplexGeometry, DodecahedronSimplexGeometry, IcosahedronSimplexGeometry, KleinBottleSimplexGeometry, Simplex1Geometry, MobiusStripSimplexGeometry, OctahedronSimplexGeometry, SliceSimplexGeometry, GridSimplexGeometry, PolyhedronSimplexGeometry, RevolutionSimplexGeometry, RingGeometry, RingSimplexGeometry, SphericalPolarSimplexGeometry, TetrahedronSimplexGeometry, VortexSimplexGeometry, createGraphicsProgram, smartProgram, programFromScripts, GraphicsProgram, HTMLScriptsGraphicsProgram, LineMaterial, MeshMaterial, MeshLambertMaterial, PointMaterial, GraphicsProgramBuilder, RoundUniform, Dimensions, Euclidean2, Euclidean3, mathcore, R1, Mat2R, Mat3R, Mat4R, QQ, Unit, G2, G3, SpinG2, SpinG3, R2, R3, R4, VectorN, AmbientLight, ColorFacet, DirectionalLightE3, EulerFacet, ModelFacetE3, PointSizeFacet, ReflectionFacetE2, ReflectionFacetE3, RigidBodyFacetE3, Vector3Facet, ModelE2, ModelE3, RigidBodyE2, RigidBodyE3, initWebGL, renderer, contextProxy, getCanvasElementById, IUnknownArray, NumberIUnknownMap, refChange, Shareable, StringIUnknownMap, workbench3D, windowAnimationRunner) {
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
        get Vector2Animation() { return Vector2Animation; },
        get Vector3Animation() { return Vector3Animation; },
        get Spinor2Animation() { return Spinor2Animation; },
        get Spinor3Animation() { return Spinor3Animation; },
        // devices
        get Keyboard() { return Keyboard; },
        // TODO: Arrange in alphabetical order in order to assess width of API.
        // materials
        get HTMLScriptsGraphicsProgram() { return HTMLScriptsGraphicsProgram; },
        get GraphicsProgram() { return GraphicsProgram; },
        get LineMaterial() { return LineMaterial; },
        get MeshMaterial() { return MeshMaterial; },
        get MeshLambertMaterial() { return MeshLambertMaterial; },
        get PointMaterial() { return PointMaterial; },
        get GraphicsProgramBuilder() { return GraphicsProgramBuilder; },
        //commands
        get BlendFactor() { return BlendFactor; },
        get Capability() { return Capability; },
        get WebGLBlendFunc() { return WebGLBlendFunc; },
        get WebGLClearColor() { return WebGLClearColor; },
        get WebGLDisable() { return WebGLDisable; },
        get WebGLEnable() { return WebGLEnable; },
        get initWebGL() { return initWebGL; },
        get createFrustum() { return createFrustum; },
        get createPerspective() { return createPerspective; },
        get createView() { return createView; },
        get ModelE2() { return ModelE2; },
        get ModelE3() { return ModelE3; },
        get EulerFacet() { return EulerFacet; },
        get RigidBodyFacetE3() { return RigidBodyFacetE3; },
        get ModelFacetE3() { return ModelFacetE3; },
        get RigidBodyE2() { return RigidBodyE2; },
        get RigidBodyE3() { return RigidBodyE3; },
        get Simplex() { return Simplex; },
        get Vertex() { return Vertex; },
        get frustumMatrix() { return frustumMatrix; },
        get perspectiveMatrix() { return perspectiveMatrix; },
        get viewMatrix() { return viewMatrix; },
        get Scene() { return Scene; },
        get Drawable() { return Drawable; },
        get PerspectiveCamera() { return PerspectiveCamera; },
        get getCanvasElementById() { return getCanvasElementById; },
        get GraphicsContext() { return GraphicsContext; },
        get createDrawList() { return createDrawList; },
        get renderer() { return renderer; },
        get webgl() { return contextProxy; },
        workbench: workbench3D,
        animation: windowAnimationRunner,
        get DrawMode() { return DrawMode; },
        get AttribLocation() { return AttribLocation; },
        get UniformLocation() { return UniformLocation; },
        get createGraphicsProgram() {
            return createGraphicsProgram;
        },
        get smartProgram() {
            return smartProgram;
        },
        get Color() { return Color; },
        get AxialSimplexGeometry() { return AxialSimplexGeometry; },
        get ArrowGeometry() { return ArrowGeometry; },
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
        // get TextSimplexGeometry() { return TextSimplexGeometry },
        get VortexSimplexGeometry() { return VortexSimplexGeometry; },
        get Topology() { return Topology; },
        get PointTopology() { return PointTopology; },
        get LineTopology() { return LineTopology; },
        get MeshTopology() { return MeshTopology; },
        get GridTopology() { return GridTopology; },
        get Dimensions() { return Dimensions; },
        get Unit() { return Unit; },
        get Euclidean2() { return Euclidean2; },
        get Euclidean3() { return Euclidean3; },
        get Mat2R() { return Mat2R; },
        get Mat3R() { return Mat3R; },
        get Mat4R() { return Mat4R; },
        get QQ() { return QQ; },
        get G2() { return G2; },
        get G3() { return G3; },
        get R1() { return R1; },
        get SpinG2() { return SpinG2; },
        get SpinG3() { return SpinG3; },
        get R2() { return R2; },
        get R3() { return R3; },
        get R4() { return R4; },
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
        get GraphicsProgramSymbols() { return GraphicsProgramSymbols; },
        // programs
        get programFromScripts() { return programFromScripts; },
        get DrawAttribute() { return DrawAttribute; },
        get DrawPrimitive() { return DrawPrimitive; },
        // facets
        get AmbientLight() { return AmbientLight; },
        get ColorFacet() { return ColorFacet; },
        get DirectionalLightE3() { return DirectionalLightE3; },
        get PointSizeFacet() { return PointSizeFacet; },
        get ReflectionFacetE2() { return ReflectionFacetE2; },
        get ReflectionFacetE3() { return ReflectionFacetE3; },
        get Vector3Facet() { return Vector3Facet; },
        // utils
        get IUnknownArray() { return IUnknownArray; },
        get NumberIUnknownMap() { return NumberIUnknownMap; },
        get refChange() { return refChange; },
        get Shareable() { return Shareable; },
        get StringIUnknownMap() { return StringIUnknownMap; },
        // universal math functions
        get cos() { return mathcore.cos; },
        get cosh() { return mathcore.cosh; },
        get exp() { return mathcore.exp; },
        get log() { return mathcore.log; },
        get norm() { return mathcore.norm; },
        get quad() { return mathcore.quad; },
        get sin() { return mathcore.sin; },
        get sinh() { return mathcore.sinh; },
        get sqrt() { return mathcore.sqrt; }
    };
    return eight;
});
