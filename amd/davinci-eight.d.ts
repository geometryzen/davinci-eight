/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import Object3D = require('davinci-eight/core/Object3D');
import Camera = require('davinci-eight/cameras/Camera');
import PerspectiveCamera = require('davinci-eight/cameras/PerspectiveCamera');
import Scene = require('davinci-eight/worlds/Scene');
import WebGLRenderer = require('davinci-eight/renderers/WebGLRenderer');
import Mesh = require('davinci-eight/objects/Mesh');
import CurveGeometry = require('davinci-eight/geometries/CurveGeometry');
import LatticeGeometry = require('davinci-eight/geometries/LatticeGeometry');
import Face3 = require('davinci-eight/core/Face3');
import Geometry = require('davinci-eight/geometries/Geometry');
import GeometryVertexAttributeProvider = require('davinci-eight/geometries/GeometryVertexAttributeProvider');
import BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
import DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
import IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
import KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
import MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
import OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
import ParametricGeometry = require('davinci-eight/geometries/ParametricGeometry');
import PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
import RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
import SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
import TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
import TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
import VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
import RGBGeometry = require('davinci-eight/geometries/RGBGeometry');
import ShaderAttributeVariable = require('davinci-eight/objects/ShaderAttributeVariable');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import MeshBasicMaterial = require('davinci-eight/materials/MeshBasicMaterial');
import MeshNormalMaterial = require('davinci-eight/materials/MeshNormalMaterial');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
import FactoredDrawable = require('davinci-eight/objects/FactoredDrawable');
import Curve = require('davinci-eight/curves/Curve');
/**
 * @module EIGHT
 */
declare var eight: {
    'VERSION': string;
    perspective: (fov?: number, aspect?: number, near?: number, far?: number) => {
        position: Vector3;
        attitude: Spinor3;
        aspect: number;
        projectionMatrix: number[];
    };
    world: () => World;
    object3D: () => Object3D;
    renderer: (parameters?: RendererParameters) => Renderer;
    contextMonitor: (canvas: HTMLCanvasElement, contextFree: () => void, contextGain: (gl: WebGLRenderingContext, contextGainId: string) => void, contextLoss: () => void) => {
        start: (context: WebGLRenderingContext) => void;
        stop: () => void;
    };
    workbench: (canvas: HTMLCanvasElement, renderer: any, camera: {
        aspect: number;
    }, win?: Window) => {
        setUp: () => void;
        tearDown: () => void;
    };
    animationRunner: (tick: (time: number) => void, terminate: (time: number) => void, setUp: () => void, tearDown: (ex: any) => void, win?: Window) => {
        start: () => void;
        stop: () => void;
    };
    mesh: <G extends VertexAttributeProvider, M extends Material>(geometry: G, material: M, meshUniforms: VertexUniformProvider) => FactoredDrawable<G, M>;
    box: (spec?: any) => VertexAttributeProvider;
    cuboid: (spec?: {
        position?: {
            name?: string;
        };
        color?: {
            name?: string;
            value?: number[];
        };
        normal?: {
            name?: string;
        };
    }) => CuboidGeometry;
    ellipsoid: (spec?: any) => EllipsoidGeometry;
    prism: (spec?: any) => VertexAttributeProvider;
    CurveGeometry: typeof CurveGeometry;
    LatticeGeometry: typeof LatticeGeometry;
    RGBGeometry: typeof RGBGeometry;
    ShaderAttributeVariable: typeof ShaderAttributeVariable;
    pointsMaterial: () => Material;
    shaderMaterial: () => ShaderMaterial;
    smartMaterial: (attributes: AttributeMetaInfos, uniforms: UniformMetaInfo) => SmartMaterial;
    Scene: typeof Scene;
    Camera: typeof Camera;
    PerspectiveCamera: typeof PerspectiveCamera;
    WebGLRenderer: typeof WebGLRenderer;
    Face3: typeof Face3;
    Geometry: typeof Geometry;
    GeometryVertexAttributeProvider: typeof GeometryVertexAttributeProvider;
    BoxGeometry: typeof BoxGeometry;
    CylinderGeometry: typeof CylinderGeometry;
    DodecahedronGeometry: typeof DodecahedronGeometry;
    IcosahedronGeometry: typeof IcosahedronGeometry;
    KleinBottleGeometry: typeof KleinBottleGeometry;
    MobiusStripGeometry: typeof MobiusStripGeometry;
    OctahedronGeometry: typeof OctahedronGeometry;
    Object3D: typeof Object3D;
    ParametricGeometry: typeof ParametricGeometry;
    PolyhedronGeometry: typeof PolyhedronGeometry;
    RevolutionGeometry: typeof RevolutionGeometry;
    SphereGeometry: typeof SphereGeometry;
    TetrahedronGeometry: typeof TetrahedronGeometry;
    TubeGeometry: typeof TubeGeometry;
    ArrowGeometry: typeof ArrowGeometry;
    VortexGeometry: typeof VortexGeometry;
    Mesh: typeof Mesh;
    MeshBasicMaterial: typeof MeshBasicMaterial;
    MeshNormalMaterial: typeof MeshNormalMaterial;
    Matrix3: typeof Matrix3;
    Matrix4: typeof Matrix4;
    Spinor3: typeof Spinor3;
    Vector2: typeof Vector2;
    Vector3: typeof Vector3;
    Curve: typeof Curve;
};
export = eight;
