/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import Camera = require('davinci-eight/cameras/Camera');
import PerspectiveCamera = require('davinci-eight/cameras/PerspectiveCamera');
import Mesh = require('davinci-eight/objects/Mesh');
import CurveGeometry = require('davinci-eight/geometries/CurveGeometry');
import LatticeGeometry = require('davinci-eight/geometries/LatticeGeometry');
import RGBGeometry = require('davinci-eight/geometries/RGBGeometry');
import ShaderAttributeVariable = require('davinci-eight/objects/ShaderAttributeVariable');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import MeshBasicMaterial = require('davinci-eight/materials/MeshBasicMaterial');
declare var eight: {
    'VERSION': string;
    perspective: (fov?: number, aspect?: number, near?: number, far?: number) => {
        position: blade.Euclidean3;
        attitude: blade.Euclidean3;
        aspect: number;
        projectionMatrix: number[];
    };
    Camera: typeof Camera;
    PerspectiveCamera: typeof PerspectiveCamera;
    scene: () => Scene;
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
    mesh: <G extends Geometry, M extends Material>(geometry: G, material: M, meshUniforms: UniformProvider) => FactoredDrawable<G, M>;
    Mesh: typeof Mesh;
    box: (spec?: any) => Geometry;
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
    prism: (spec?: any) => Geometry;
    CurveGeometry: typeof CurveGeometry;
    LatticeGeometry: typeof LatticeGeometry;
    RGBGeometry: typeof RGBGeometry;
    ShaderAttributeVariable: typeof ShaderAttributeVariable;
    pointsMaterial: () => Material;
    shaderMaterial: () => ShaderMaterial;
    smartMaterial: (attributes: AttributeMetaInfos, uniforms: UniformMetaInfo) => SmartMaterial;
    MeshBasicMaterial: typeof MeshBasicMaterial;
    Matrix3: typeof Matrix3;
    Matrix4: typeof Matrix4;
};
export = eight;
