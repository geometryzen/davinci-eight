/// <reference path="../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import Frustum = require('davinci-eight/cameras/Frustum');
import Perspective = require('davinci-eight/cameras/Perspective');
import View = require('davinci-eight/cameras/View');
import AttribLocation = require('davinci-eight/core/AttribLocation');
import AttribMetaInfos = require('davinci-eight/core/AttribMetaInfos');
import AttribProvider = require('davinci-eight/core/AttribProvider');
import DefaultAttribProvider = require('davinci-eight/core/DefaultAttribProvider');
import Color = require('davinci-eight/core/Color');
import DrawMode = require('davinci-eight/core/DrawMode');
import Face3 = require('davinci-eight/core/Face3');
import Primitive = require('davinci-eight/core/Primitive');
import ContextManager = require('davinci-eight/core/ContextManager');
import Symbolic = require('davinci-eight/core/Symbolic');
import UniformData = require('davinci-eight/core/UniformData');
import UniformMetaInfos = require('davinci-eight/core/UniformMetaInfos');
import UniformLocation = require('davinci-eight/core/UniformLocation');
import Curve = require('davinci-eight/curves/Curve');
import DrawAttribute = require('davinci-eight/dfx/DrawAttribute');
import DrawElements = require('davinci-eight/dfx/DrawElements');
import Simplex = require('davinci-eight/dfx/Simplex');
import Vertex = require('davinci-eight/dfx/Vertex');
import DrawList = require('davinci-eight/drawLists/DrawList');
import Geometry3 = require('davinci-eight/geometries/Geometry3');
import GeometryAdapter = require('davinci-eight/geometries/GeometryAdapter');
import ArrowGeometry = require('davinci-eight/geometries/ArrowGeometry');
import BarnGeometry = require('davinci-eight/geometries/BarnGeometry');
import BoxGeometry = require('davinci-eight/geometries/BoxGeometry');
import CylinderGeometry = require('davinci-eight/geometries/CylinderGeometry');
import DodecahedronGeometry = require('davinci-eight/geometries/DodecahedronGeometry');
import EllipticalCylinderGeometry = require('davinci-eight/geometries/EllipticalCylinderGeometry');
import IcosahedronGeometry = require('davinci-eight/geometries/IcosahedronGeometry');
import KleinBottleGeometry = require('davinci-eight/geometries/KleinBottleGeometry');
import MobiusStripGeometry = require('davinci-eight/geometries/MobiusStripGeometry');
import OctahedronGeometry = require('davinci-eight/geometries/OctahedronGeometry');
import SurfaceGeometry = require('davinci-eight/geometries/SurfaceGeometry');
import PolyhedronGeometry = require('davinci-eight/geometries/PolyhedronGeometry');
import RevolutionGeometry = require('davinci-eight/geometries/RevolutionGeometry');
import SphereGeometry = require('davinci-eight/geometries/SphereGeometry');
import TetrahedronGeometry = require('davinci-eight/geometries/TetrahedronGeometry');
import TubeGeometry = require('davinci-eight/geometries/TubeGeometry');
import VortexGeometry = require('davinci-eight/geometries/VortexGeometry');
import Cartesian3 = require('davinci-eight/math/Cartesian3');
import Matrix3 = require('davinci-eight/math/Matrix3');
import Matrix4 = require('davinci-eight/math/Matrix4');
import Quaternion = require('davinci-eight/math/Quaternion');
import Spinor3 = require('davinci-eight/math/Spinor3');
import Vector1 = require('davinci-eight/math/Vector1');
import Vector2 = require('davinci-eight/math/Vector2');
import Vector3 = require('davinci-eight/math/Vector3');
import Vector4 = require('davinci-eight/math/Vector4');
import VectorN = require('davinci-eight/math/VectorN');
import ArrowBuilder = require('davinci-eight/mesh/ArrowBuilder');
import ArrowOptions = require('davinci-eight/mesh/ArrowOptions');
import BoxBuilder = require('davinci-eight/mesh/BoxBuilder');
import BoxOptions = require('davinci-eight/mesh/BoxOptions');
import CylinderArgs = require('davinci-eight/mesh/CylinderArgs');
import CylinderOptions = require('davinci-eight/mesh/CylinderOptions');
import CylinderMeshBuilder = require('davinci-eight/mesh/CylinderMeshBuilder');
import SphereBuilder = require('davinci-eight/mesh/SphereBuilder');
import SphereOptions = require('davinci-eight/mesh/SphereOptions');
import Program = require('davinci-eight/core/Program');
import Renderer = require('davinci-eight/renderers/Renderer');
import RendererParameters = require('davinci-eight/renderers/RendererParameters');
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
    scene: () => DrawList;
    renderer: (canvas: HTMLCanvasElement, parameters?: RendererParameters) => Renderer;
    webgl: (canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes) => ContextManager;
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
    DefaultAttribProvider: typeof DefaultAttribProvider;
    primitive: <MESH extends AttribProvider, MODEL extends UniformData>(mesh: MESH, program: Program, model: MODEL) => Primitive<MESH, MODEL>;
    DrawMode: typeof DrawMode;
    AttribLocation: typeof AttribLocation;
    UniformLocation: typeof UniformLocation;
    shaderProgram: (monitor: ContextManager, vertexShader: string, fragmentShader: string, attribs: string[]) => Program;
    smartProgram: (monitor: ContextManager, attributes: AttribMetaInfos, uniformsList: UniformMetaInfos[], attribs: string[]) => Program;
    Color: typeof Color;
    Face3: typeof Face3;
    Geometry3: typeof Geometry3;
    GeometryAdapter: typeof GeometryAdapter;
    ArrowGeometry: typeof ArrowGeometry;
    BarnGeometry: typeof BarnGeometry;
    BoxGeometry: typeof BoxGeometry;
    CylinderGeometry: typeof CylinderGeometry;
    DodecahedronGeometry: typeof DodecahedronGeometry;
    EllipticalCylinderGeometry: typeof EllipticalCylinderGeometry;
    IcosahedronGeometry: typeof IcosahedronGeometry;
    KleinBottleGeometry: typeof KleinBottleGeometry;
    MobiusStripGeometry: typeof MobiusStripGeometry;
    OctahedronGeometry: typeof OctahedronGeometry;
    SurfaceGeometry: typeof SurfaceGeometry;
    PolyhedronGeometry: typeof PolyhedronGeometry;
    RevolutionGeometry: typeof RevolutionGeometry;
    SphereGeometry: typeof SphereGeometry;
    TetrahedronGeometry: typeof TetrahedronGeometry;
    TubeGeometry: typeof TubeGeometry;
    VortexGeometry: typeof VortexGeometry;
    Matrix3: typeof Matrix3;
    Matrix4: typeof Matrix4;
    Spinor3: typeof Spinor3;
    Quaternion: typeof Quaternion;
    Vector1: typeof Vector1;
    Vector2: typeof Vector2;
    Vector3: typeof Vector3;
    Vector4: typeof Vector4;
    VectorN: typeof VectorN;
    Curve: typeof Curve;
    arrowMesh: (monitor: ContextManager, options?: ArrowOptions) => AttribProvider;
    ArrowBuilder: typeof ArrowBuilder;
    boxMesh: (monitor: ContextManager, options?: BoxOptions) => AttribProvider;
    BoxBuilder: typeof BoxBuilder;
    checkGeometry: (geometry: Simplex[]) => {
        [key: string]: {
            size: number;
            name?: string;
        };
    };
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
    toDrawElements: (geometry: Simplex[], attribMap?: {
        [name: string]: {
            name?: string;
            size: number;
        };
    }) => DrawElements;
    CylinderArgs: typeof CylinderArgs;
    cylinderMesh: (monitor: ContextManager, options?: CylinderOptions) => AttribProvider;
    CylinderMeshBuilder: typeof CylinderMeshBuilder;
    sphereMesh: (monitor: ContextManager, options?: SphereOptions) => AttribProvider;
    SphereBuilder: typeof SphereBuilder;
    Symbolic: typeof Symbolic;
    vortexMesh: (monitor: ContextManager, options?: {
        wireFrame?: boolean;
    }) => AttribProvider;
    programFromScripts: (monitor: ContextManager, vsId: string, fsId: string, $document: Document, attribs?: string[]) => Program;
    DrawAttribute: typeof DrawAttribute;
    DrawElements: typeof DrawElements;
    refChange: (uuid: string, name?: string, change?: number) => number;
};
export = eight;
