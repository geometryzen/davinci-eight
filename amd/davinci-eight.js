define(["require", "exports", 'davinci-eight/commands/BlendFactor', 'davinci-eight/commands/WebGLBlendFunc', 'davinci-eight/commands/WebGLClearColor', 'davinci-eight/commands/Capability', 'davinci-eight/commands/WebGLDisable', 'davinci-eight/commands/WebGLEnable', 'davinci-eight/controls/CameraControls', 'davinci-eight/core/AttribLocation', 'davinci-eight/core/Color', 'davinci-eight/core', 'davinci-eight/core/Drawable', 'davinci-eight/core/DrawMode', 'davinci-eight/core/GeometryContainer', 'davinci-eight/core/GeometryElements', 'davinci-eight/core/GeometryPrimitive', 'davinci-eight/core/GraphicsProgramSymbols', 'davinci-eight/core/Mesh', 'davinci-eight/core/Scene', 'davinci-eight/core/UniformLocation', 'davinci-eight/core/WebGLRenderer', 'davinci-eight/curves/Curve', 'davinci-eight/facets/AmbientLight', 'davinci-eight/facets/ColorFacet', 'davinci-eight/facets/DirectionalLight', 'davinci-eight/facets/ModelFacet', 'davinci-eight/facets/PointSizeFacet', 'davinci-eight/facets/ReflectionFacetE2', 'davinci-eight/facets/ReflectionFacetE3', 'davinci-eight/facets/Vector3Facet', 'davinci-eight/facets/frustumMatrix', 'davinci-eight/facets/PerspectiveCamera', 'davinci-eight/facets/perspectiveMatrix', 'davinci-eight/facets/viewMatrix', 'davinci-eight/facets/ModelE2', 'davinci-eight/facets/ModelE3', 'davinci-eight/geometries/DrawAttribute', 'davinci-eight/geometries/DrawPrimitive', 'davinci-eight/geometries/Simplex', 'davinci-eight/geometries/Vertex', 'davinci-eight/geometries/ArrowGeometry', 'davinci-eight/geometries/BoxGeometry', 'davinci-eight/geometries/CylinderGeometry', 'davinci-eight/geometries/SphereGeometry', 'davinci-eight/geometries/TetrahedronGeometry', 'davinci-eight/materials/HTMLScriptsMaterial', 'davinci-eight/materials/LineMaterial', 'davinci-eight/materials/MeshMaterial', 'davinci-eight/materials/MeshNormalMaterial', 'davinci-eight/materials/PointMaterial', 'davinci-eight/materials/GraphicsProgramBuilder', 'davinci-eight/materials/smartProgram', 'davinci-eight/materials/programFromScripts', 'davinci-eight/math/Dimensions', 'davinci-eight/math/G2', 'davinci-eight/math/G3', 'davinci-eight/math/mathcore', 'davinci-eight/math/Vector1', 'davinci-eight/math/Matrix2', 'davinci-eight/math/Matrix3', 'davinci-eight/math/Matrix4', 'davinci-eight/math/QQ', 'davinci-eight/math/Unit', 'davinci-eight/math/G2m', 'davinci-eight/math/G3m', 'davinci-eight/math/Spinor2', 'davinci-eight/math/Spinor3', 'davinci-eight/math/Vector2', 'davinci-eight/math/Vector3', 'davinci-eight/math/Vector4', 'davinci-eight/math/VectorN', 'davinci-eight/overlay/Overlay', 'davinci-eight/utils/getCanvasElementById', 'davinci-eight/collections/ShareableArray', 'davinci-eight/collections/NumberIUnknownMap', 'davinci-eight/core/refChange', 'davinci-eight/core/Shareable', 'davinci-eight/collections/StringIUnknownMap', 'davinci-eight/utils/animation', 'davinci-eight/visual/Arrow', 'davinci-eight/visual/Sphere', 'davinci-eight/visual/Box', 'davinci-eight/visual/RigidBody', 'davinci-eight/visual/Cylinder', 'davinci-eight/visual/Tetrahedron', 'davinci-eight/visual/Trail', 'davinci-eight/visual/bootstrap'], function (require, exports, BlendFactor_1, WebGLBlendFunc_1, WebGLClearColor_1, Capability_1, WebGLDisable_1, WebGLEnable_1, CameraControls_1, AttribLocation_1, Color_1, core_1, Drawable_1, DrawMode_1, GeometryContainer_1, GeometryElements_1, GeometryPrimitive_1, GraphicsProgramSymbols_1, Mesh_1, Scene_1, UniformLocation_1, WebGLRenderer_1, Curve_1, AmbientLight_1, ColorFacet_1, DirectionalLight_1, ModelFacet_1, PointSizeFacet_1, ReflectionFacetE2_1, ReflectionFacetE3_1, Vector3Facet_1, frustumMatrix_1, PerspectiveCamera_1, perspectiveMatrix_1, viewMatrix_1, ModelE2_1, ModelE3_1, DrawAttribute_1, DrawPrimitive_1, Simplex_1, Vertex_1, ArrowGeometry_1, BoxGeometry_1, CylinderGeometry_1, SphereGeometry_1, TetrahedronGeometry_1, HTMLScriptsMaterial_1, LineMaterial_1, MeshMaterial_1, MeshNormalMaterial_1, PointMaterial_1, GraphicsProgramBuilder_1, smartProgram_1, programFromScripts_1, Dimensions_1, G2_1, G3_1, mathcore_1, Vector1_1, Matrix2_1, Matrix3_1, Matrix4_1, QQ_1, Unit_1, G2m_1, G3m_1, Spinor2_1, Spinor3_1, Vector2_1, Vector3_1, Vector4_1, VectorN_1, Overlay_1, getCanvasElementById_1, ShareableArray_1, NumberIUnknownMap_1, refChange_1, Shareable_1, StringIUnknownMap_1, animation_1, Arrow_1, Sphere_1, Box_1, RigidBody_1, Cylinder_1, Tetrahedron_1, Trail_1, bootstrap_1) {
    var eight = {
        get LAST_MODIFIED() { return core_1.default.LAST_MODIFIED; },
        get safemode() {
            return core_1.default.safemode;
        },
        set safemode(safemode) {
            core_1.default.safemode = safemode;
        },
        get strict() {
            return core_1.default.strict;
        },
        set strict(value) {
            core_1.default.strict = value;
        },
        get verbose() {
            return core_1.default.verbose;
        },
        set verbose(value) {
            if (typeof value === 'boolean') {
                core_1.default.verbose = value;
            }
            else {
                throw new TypeError('verbose must be a boolean');
            }
        },
        get VERSION() { return core_1.default.VERSION; },
        get HTMLScriptsMaterial() { return HTMLScriptsMaterial_1.default; },
        get LineMaterial() { return LineMaterial_1.default; },
        get MeshMaterial() { return MeshMaterial_1.default; },
        get MeshNormalMaterial() { return MeshNormalMaterial_1.default; },
        get PointMaterial() { return PointMaterial_1.default; },
        get GraphicsProgramBuilder() { return GraphicsProgramBuilder_1.default; },
        get BlendFactor() { return BlendFactor_1.default; },
        get Capability() { return Capability_1.default; },
        get WebGLBlendFunc() { return WebGLBlendFunc_1.default; },
        get WebGLClearColor() { return WebGLClearColor_1.default; },
        get WebGLDisable() { return WebGLDisable_1.default; },
        get WebGLEnable() { return WebGLEnable_1.default; },
        get ModelE2() { return ModelE2_1.default; },
        get ModelE3() { return ModelE3_1.default; },
        get ModelFacet() { return ModelFacet_1.default; },
        get Simplex() { return Simplex_1.default; },
        get Vertex() { return Vertex_1.default; },
        get frustumMatrix() { return frustumMatrix_1.default; },
        get perspectiveMatrix() { return perspectiveMatrix_1.default; },
        get viewMatrix() { return viewMatrix_1.default; },
        get Scene() { return Scene_1.default; },
        get Drawable() { return Drawable_1.default; },
        get PerspectiveCamera() { return PerspectiveCamera_1.default; },
        get getCanvasElementById() { return getCanvasElementById_1.default; },
        get WebGLRenderer() { return WebGLRenderer_1.default; },
        get animation() { return animation_1.default; },
        get DrawMode() { return DrawMode_1.default; },
        get AttribLocation() { return AttribLocation_1.default; },
        get UniformLocation() { return UniformLocation_1.default; },
        get smartProgram() {
            return smartProgram_1.default;
        },
        get Color() { return Color_1.default; },
        get CameraControls() { return CameraControls_1.default; },
        get AmbientLight() { return AmbientLight_1.default; },
        get ColorFacet() { return ColorFacet_1.default; },
        get DirectionalLight() { return DirectionalLight_1.default; },
        get PointSizeFacet() { return PointSizeFacet_1.default; },
        get ReflectionFacetE2() { return ReflectionFacetE2_1.default; },
        get ReflectionFacetE3() { return ReflectionFacetE3_1.default; },
        get Vector3Facet() { return Vector3Facet_1.default; },
        get ArrowGeometry() { return ArrowGeometry_1.default; },
        get BoxGeometry() { return BoxGeometry_1.default; },
        get CylinderGeometry() { return CylinderGeometry_1.default; },
        get SphereGeometry() { return SphereGeometry_1.default; },
        get TetrahedronGeometry() { return TetrahedronGeometry_1.default; },
        get Dimensions() { return Dimensions_1.default; },
        get Unit() { return Unit_1.default; },
        get G2() { return G2_1.default; },
        get G3() { return G3_1.default; },
        get Matrix2() { return Matrix2_1.default; },
        get Matrix3() { return Matrix3_1.default; },
        get Matrix4() { return Matrix4_1.default; },
        get QQ() { return QQ_1.default; },
        get G2m() { return G2m_1.default; },
        get G3m() { return G3m_1.default; },
        get Vector1() { return Vector1_1.default; },
        get Spinor2() { return Spinor2_1.default; },
        get Spinor3() { return Spinor3_1.default; },
        get Vector2() { return Vector2_1.default; },
        get Vector3() { return Vector3_1.default; },
        get Vector4() { return Vector4_1.default; },
        get VectorN() { return VectorN_1.default; },
        get Curve() { return Curve_1.default; },
        get GraphicsProgramSymbols() { return GraphicsProgramSymbols_1.default; },
        get GeometryContainer() { return GeometryContainer_1.default; },
        get GeometryElements() { return GeometryElements_1.default; },
        get GeometryPrimitive() { return GeometryPrimitive_1.default; },
        get Overlay() { return Overlay_1.default; },
        get programFromScripts() { return programFromScripts_1.default; },
        get DrawAttribute() { return DrawAttribute_1.default; },
        get DrawPrimitive() { return DrawPrimitive_1.default; },
        get ShareableArray() { return ShareableArray_1.default; },
        get NumberIUnknownMap() { return NumberIUnknownMap_1.default; },
        get refChange() { return refChange_1.default; },
        get Shareable() { return Shareable_1.default; },
        get StringIUnknownMap() { return StringIUnknownMap_1.default; },
        get cos() { return mathcore_1.default.cos; },
        get cosh() { return mathcore_1.default.cosh; },
        get exp() { return mathcore_1.default.exp; },
        get log() { return mathcore_1.default.log; },
        get norm() { return mathcore_1.default.norm; },
        get quad() { return mathcore_1.default.quad; },
        get sin() { return mathcore_1.default.sin; },
        get sinh() { return mathcore_1.default.sinh; },
        get sqrt() { return mathcore_1.default.sqrt; },
        get Arrow() { return Arrow_1.default; },
        get Sphere() { return Sphere_1.default; },
        get Box() { return Box_1.default; },
        get Mesh() { return Mesh_1.default; },
        get RigidBody() { return RigidBody_1.default; },
        get Cylinder() { return Cylinder_1.default; },
        get Tetrahedron() { return Tetrahedron_1.default; },
        get Trail() { return Trail_1.default; },
        get bootstrap() { return bootstrap_1.default; }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = eight;
});
