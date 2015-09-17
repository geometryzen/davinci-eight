/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import Frustum = require('davinci-eight/cameras/Frustum');
import Perspective = require('davinci-eight/cameras/Perspective');
import View = require('davinci-eight/cameras/View');
import AttribLocation = require('davinci-eight/core/AttribLocation');
import AttribMetaInfos = require('davinci-eight/core/AttribMetaInfos');
import Color = require('davinci-eight/core/Color');
import DrawMode = require('davinci-eight/core/DrawMode');
import Face3 = require('davinci-eight/core/Face3');
import ContextKahuna = require('davinci-eight/core/ContextKahuna');
import ContextMonitor = require('davinci-eight/core/ContextMonitor');
import Symbolic = require('davinci-eight/core/Symbolic');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import UniformLocation = require('davinci-eight/core/UniformLocation');
import Curve = require('davinci-eight/curves/Curve');
import DrawAttribute = require('davinci-eight/dfx/DrawAttribute');
import DrawElements = require('davinci-eight/dfx/DrawElements');
import Simplex = require('davinci-eight/dfx/Simplex');
import Vertex = require('davinci-eight/dfx/Vertex');
import GeometryInfo = require('davinci-eight/dfx/GeometryInfo');
import IDrawList = require('davinci-eight/scene/IDrawList');
import Material = require('davinci-eight/scene/Material');
import Mesh = require('davinci-eight/scene/Mesh');
import MeshNormalMaterial = require('davinci-eight/scene/MeshNormalMaterial');
import PerspectiveCamera = require('davinci-eight/scene/PerspectiveCamera');
import Scene = require('davinci-eight/scene/Scene');
import WebGLRenderer = require('davinci-eight/scene/WebGLRenderer');
import Geometry = require('davinci-eight/geometries/Geometry');
import BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
import Cartesian3 = require('davinci-eight/math/Cartesian3');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Quaternion = require('davinci-eight/math/Quaternion');
import Rotor3 = require('davinci-eight/math/Rotor3');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector1 = require('davinci-eight/math/Vector1');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
import Vector4 = require('davinci-eight/math/Vector4');
import VectorN = require('davinci-eight/math/VectorN');
import ArrowBuilder = require('davinci-eight/mesh/ArrowBuilder');
import CylinderArgs = require('davinci-eight/mesh/CylinderArgs');
import IProgram = require('davinci-eight/core/IProgram');
import Renderer = require('davinci-eight/renderers/Renderer');
import Model = require('davinci-eight/utils/Model');
import WindowAnimationRunner = require('davinci-eight/utils/WindowAnimationRunner');
/**
 * @module EIGHT
 */
declare var eight: {
    'VERSION': string;
    initWebGL: (canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes) => WebGLRenderingContext;
    Model: typeof Model;
    Simplex: typeof Simplex;
    Vertex: typeof Vertex;
    frustum: (viewMatrixName: string, projectionMatrixName: string) => Frustum;
    frustumMatrix: (left: number, right: number, bottom: number, top: number, near: number, far: number, matrix?: Float32Array) => Float32Array;
    perspective: (options?: {
        fov?: number;
        aspect?: number;
        near?: number;
        far?: number;
        projectionMatrixName?: string;
        viewMatrixName?: string;
    }) => Perspective;
    perspectiveMatrix: (fov: number, aspect: number, near: number, far: number, matrix?: Matrix4) => Matrix4;
    view: (options?: {
        viewMatrixName?: string;
    }) => View;
    viewMatrix: (eye: Cartesian3, look: Cartesian3, up: Cartesian3, matrix?: Matrix4) => Matrix4;
    Scene: typeof Scene;
    Material: typeof Material;
    Mesh: typeof Mesh;
    MeshNormalMaterial: typeof MeshNormalMaterial;
    PerspectiveCamera: typeof PerspectiveCamera;
    WebGLRenderer: typeof WebGLRenderer;
    createDrawList: () => IDrawList;
    renderer: (canvas: HTMLCanvasElement) => Renderer;
    webgl: (canvas: HTMLCanvasElement, canvasId?: number, attributes?: WebGLContextAttributes) => ContextKahuna;
    workbench: (canvas: HTMLCanvasElement, renderer: any, camera: {
        aspect: number;
    }, win?: Window) => {
        setUp: () => void;
        tearDown: () => void;
    };
    animation: (animate: (time: number) => void, options?: {
        setUp?: () => void;
        tearDown?: (animateException: any) => void;
        terminate?: (time: number) => boolean;
        window?: Window;
    }) => WindowAnimationRunner;
    DrawMode: typeof DrawMode;
    AttribLocation: typeof AttribLocation;
    UniformLocation: typeof UniformLocation;
    shaderProgram: (monitors: ContextMonitor[], vertexShader: string, fragmentShader: string, attribs: string[]) => IProgram;
    smartProgram: (monitors: ContextMonitor[], attributes: AttribMetaInfos, uniforms: UniformMetaInfos, bindings: string[]) => IProgram;
    Color: typeof Color;
    Face3: typeof Face3;
    Geometry: typeof Geometry;
    BoxGeometry: typeof BoxGeometry;
    Matrix3: typeof Matrix3;
    Matrix4: typeof Matrix4;
    rotor3: () => Rotor3;
    Spinor3: typeof Spinor3;
    Quaternion: typeof Quaternion;
    Vector1: typeof Vector1;
    Vector2: typeof Vector2;
    Vector3: typeof Vector3;
    Vector4: typeof Vector4;
    VectorN: typeof VectorN;
    Curve: typeof Curve;
    ArrowBuilder: typeof ArrowBuilder;
    checkGeometry: (geometry: Simplex[]) => GeometryInfo;
    computeFaceNormals: (simplex: Simplex, positionName?: string, normalName?: string) => void;
    cube: (size?: number) => Simplex[];
    quadrilateral: (a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes?: {
        [name: string]: VectorN<number>[];
    }, triangles?: Simplex[]) => Simplex[];
    square: (size?: number) => Simplex[];
    tetrahedron: (a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes?: {
        [name: string]: VectorN<number>[];
    }, triangles?: Simplex[]) => Simplex[];
    triangle: (a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes?: {
        [name: string]: VectorN<number>[];
    }, triangles?: Simplex[]) => Simplex[];
    toDrawElements: (geometry: Simplex[], geometryInfo?: GeometryInfo) => DrawElements;
    CylinderArgs: typeof CylinderArgs;
    Symbolic: typeof Symbolic;
    programFromScripts: (monitors: ContextMonitor[], vsId: string, fsId: string, $document: Document, attribs?: string[]) => IProgram;
    DrawAttribute: typeof DrawAttribute;
    DrawElements: typeof DrawElements;
    refChange: (uuid: string, name?: string, change?: number) => number;
};
export = eight;
