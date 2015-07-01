/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import CurveGeometry = require('davinci-eight/geometries/CurveGeometry');
import LatticeGeometry = require('davinci-eight/geometries/LatticeGeometry');
import RGBGeometry = require('davinci-eight/geometries/RGBGeometry');
import VertexAttribArray = require('davinci-eight/objects/VertexAttribArray');
declare var eight: {
    'VERSION': string;
    perspective: (fov?: number, aspect?: number, near?: number, far?: number) => {
        position: blade.Euclidean3;
        attitude: blade.Euclidean3;
        aspect: number;
        projectionMatrix: number[];
    };
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
    mesh: <G extends Geometry, M extends Material>(geometry: G, material: M) => Mesh<G, M>;
    box: (spec?: any) => Geometry;
    CurveGeometry: typeof CurveGeometry;
    LatticeGeometry: typeof LatticeGeometry;
    RGBGeometry: typeof RGBGeometry;
    prism: (spec?: any) => Geometry;
    VertexAttribArray: typeof VertexAttribArray;
    rawShaderMaterial: (vertexShader: string, fragmentShader: string) => Material;
};
export = eight;
