//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'EIGHT'.
//
declare module EIGHT
{
  class Drawable {
    drawGroupName: string;
    useProgram(context: WebGLRenderingContext);
    draw(context: WebGLRenderingContext, time: number);
  }
  class RenderingContextUser {
    /**
     * Notify the target that it is no longer required, and request to free, dispose, or delete any WebGL resources acquired and owned by the target.
     */
    contextFree(context: WebGLRenderingContext): void;
    /**
     * Notification of a new WebGLRenderingContext.
     * @param context The WebGLRenderingContext.
     * @param contextId A unique identifier used to distinguish the context.
     */
    contextGain(context: WebGLRenderingContext, contextGainId: string): void;
    /**
     * Notification that any WebGL resources cached are invalid because the WebGLContext has been lost.
     * This is a cue to rest to the initial state without attempting to dispose or free held resources.
     */
    contextLoss(): void;
    /**
     * Determines whether this context user has a valid WebGLRenderingContext.
     */
    hasContext(): boolean;
  }
  class World extends RenderingContextUser
  {
    drawGroups: {[drawGroupName:string]: Drawable[]},
    /**
     * Add a drawable to the root node of the world.
     */
    add(drawable: Drawable): void;
  }
  class Matrix3 {
    public elements: number[];
    constructor();
    identity(): void;
    normalFromMatrix4(matrix: Matrix4): void;
  }
  class Matrix4 {
    public elements: number[];
    constructor();
    identity(): void;
    mul(matrix: Matrix4): void;
    translate(position: { x: number, y: number, z: number }): void;
    rotate(rotation: { yz: number, zx: number, xy: number, w: number }): void;
  }
  class Spinor3 {
    public yz: number;
    public zx: number;
    public xy: number;
    public w: number;
    constructor(spinor: { yz: number, zx: number, xy: number, w: number });
  }
  class Vector3 {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number, y: number, z: number);
    multiplyScalar(s: number): Vector3;
  }
  /**
   *
   */
  interface UniformMetaInfo {
    [property: string]: {
      name: string;
      type: string;
    }
  }
  interface VertexUniformProvider {
    getUniformMatrix3(name: string): { transpose: boolean; matrix3: Float32Array };
    getUniformMatrix4(name: string): { transpose: boolean; matrix4: Float32Array };
  }
  /**
   * A transformation from the 3D world to the view cube.
   */
  class Camera extends Drawable implements VertexUniformProvider {
    public projectionMatrix: Matrix4;
    constructor();
    getUniformMatrix3(name: string): { transpose: boolean; matrix3: Float32Array };
    getUniformMatrix4(name: string): { transpose: boolean; matrix4: Float32Array };
    static getUniformMetaInfo(): UniformMetaInfo;
  }
  class PerspectiveCamera extends Camera implements VertexUniformProvider {
    constructor(fov: number, aspect: number, near: number, far: number);
  }
  /**
   * A Geometry is the generator of calls to drawArrays or drawElements.
   */
  class VertexAttributeProvider
  {
    draw(context: WebGLRenderingContext): void;
    /**
     * Determines whether this Geometry changes. If so, update may be called repeatedly.
     */
    dynamic(): boolean;
    /**
     * Declares the vertex shader attributes the geometry can supply and information required for binding.
     */
    getAttributeMetaInfos(): {property: string, name: string, type: string, size: number, normalized: boolean, stride: number, offset: number}[];
    /**
     * Determines whether this Geometry uses WebGL's drawElements() for rendering.
     */
    hasElements(): boolean;
    /**
     * Returns the elements used in an index buffer implementation.
     * An implementation of Geometry is not required to support index buffers and may return undefined.
     */
    getElements(): Uint16Array;
    /**
     * Returns the data when drawing using arrays. 
     */
    getVertexAttributeData(name: string): Float32Array;
    /**
     * Notifies the geometry that it should update its array buffers.
     */
    update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void;
  }
  class Face3 {
    constructor(a: number, b: number, c: number);
  }
  /**
   * Base class for geometries.
   * A geometry holds all data necessary to describe a 3D model.
   */
  class Geometry {
    /**
     * Set to true if the faces array has been updated.
     */
    public elementsNeedUpdate: boolean;
    /**
     * Array of vertices.
     * The array of vertices holds every position of points in the model.
     * To signal an update in this array, Geometry.verticesNeedUpdate needs to be set to true.
     */
    public vertices: Vector3[];
    /**
     * Set to true if the vertices array has been updated.
     */
    public verticesNeedUpdate: boolean;
    /**
     * Array of triangles.
     * The array of faces describe how each vertex in the model is connected with each other.
     * To signal an update in this array, Geometry.elementsNeedUpdate needs to be set to true.
     */
    public faces: Face3[];
    /**
     * The constructor takes no arguments.
     */
    constructor();
    computeBoundingSphere(): void;
  }
  class CurveGeometry extends VertexAttributeProvider {
    constructor(
      n: number,
      generator: (i: number, time: number) => {x: number; y: number; z: number});
  }
  class LatticeGeometry extends VertexAttributeProvider {
    constructor(
      I: number,
      J: number,
      K: number,
      generator: (i: number, j: number, k: number, time: number) => { x: number; y: number; z: number });
  }
  class BoxGeometry extends VertexAttributeProvider {
    constructor(width: number, height: number, depth: number);
  }
  class CylinderGeometry extends Geometry {
    constructor(
      radiusTop?: number,
      radiusBottom?: number,
      height?: number,
      radialSegments?: number,
      heightSegments?: number,
      openEnded?: boolean,
      thetaStart?: number,
      thetaLength?: number):
  }
  class RGBGeometry extends VertexAttributeProvider {
    constructor();
  }
  /**
   * A vertex shader and a fragment shader combined into a program.
   */
  class Material extends RenderingContextUser
  {
    attributes: {modifiers: string[], type: string, name: string}[];
    uniforms: {modifiers: string[], type: string, name: string}[];
    varyings: {modifiers: string[], type: string, name: string}[];
    program: WebGLProgram;
    programId: string;
  }
  interface ShaderMaterial extends Material {
    vertexShader: string;
    fragmentShader: string;
  }
  interface SmartMaterial extends Material {
  }
  /**
   * The combination of a geometry and a material.
   */
  class FactoredDrawable<G, M extends Material> extends Drawable
  {
    geometry: G;
    material: M;
    /**
     * The attitude of the mesh expressed as a spinor.
     */
    attitude: Spinor3;
    /**
     * The position of the mesh relative to the origin. 
     */
    position: Vector3;
  }
  interface RenderingContextMonitor
  {
    /**
     * Starts the monitoring of the WebGL context.
     */
    start(context: WebGLRenderingContext): void;
    /**
     * Stops the monitoring of the WebGL context.
     */
    stop(): void;
  }
  class Renderer
  {
    domElement: HTMLCanvasElement;
    context: WebGLRenderingContext;
    contextFree(): void;
    contextGain(gl: WebGLRenderingContext, contextGainId: string): void;
    contextLoss(): void;
    render(world: World, ambientUniforms: VertexUniformProvider): void;
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    setSize(width: number, height: number): void;
  }
  class WebGLRenderer extends Renderer {
    setClearColor(color: number, alpha?: number): void;
  }
  interface RendererParameters {
    alpha?: boolean;
    antialias?: boolean;
    canvas?: HTMLCanvasElement;
    depth?: boolean;
    premultipliedAlpha?: boolean;
    preserveDrawingBuffer?: boolean;
    stencil?: boolean;
  }
  interface WindowAnimationRunner
  {
    start(): void;
    stop(): void;
    reset(): void;
    lap(): void;
    time(): number;
    isRunning: boolean;
    isPaused: boolean;
  }
  interface Workbench3D
  {
    setUp(): void;
    tearDown(): void;
  }
  /**
   * Constructs and returns a World.
   */
  function world(): World;
  /**
   *
   */
  class Scene extends World {
  }
  /**
   * Constructs and returns a Linear Perspective projection camera.
   */
  function perspective(
    /**
     * The field of view angle in the y-direction, measured in radians.
     */
    fov: number, aspect: number, near: number, far: number): Camera;
  /**
   * Constructs and returns a WebGL renderer.
   * @param parameters Optional parameters for modifying the WebGL context.
   */
  function renderer(parameters?: RendererParameters): Renderer;
  /**
   * Constructs a Material from the specified shader codes.
   */
  function pointsMaterial(): Material;
  /**
   * Constructs a ShaderMaterial from the specified shader codes.
   */
  function shaderMaterial(): ShaderMaterial;
  /**
   * Constructs a Material by introspecting a Geometry.
   */
  function smartMaterial(geometry: VertexAttributeProvider, uniforms: UniformMetaInfo): SmartMaterial;
  /**
   * Constructs a mesh from the specified geometry and material.
   * The uniformCallback must be supplied if the vertex shader has uniform variables.
   * @param geometry
   * @param material
   * @param uniformCallback
   */
  function mesh<G extends VertexAttributeProvider, M extends Material>(geometry: G, material: M, meshUniforms?: VertexUniformProvider): FactoredDrawable<G, M>;
  class Mesh<G extends Geometry, M extends Material> extends FactoredDrawable<G,M> {
    constructor(geometry: G, material: M);
    static getUniformMetaInfo(): UniformMetaInfo;
  }
  class MeshBasicMaterial extends Material {
  }
  class MeshNormalMaterial extends Material {
  }
  /**
   * Constructs and returns a box geometry.
   */
  function box(): VertexAttributeProvider;
  /**
   *
   */
  interface CuboidGeometry extends VertexAttributeProvider {
    /**
     * The axis corresponding to e1.
     */
    a: Vector3;
    /**
     * The axis corresponding to e2.
     */
    b: Vector3;
    /**
     * The axis corresponding to e3.
     */
    c: Vector3;
    /**
     * The color of the cuboid.
     */
    color: number[];
    /**
     * The cuboid should be rendered using a gray scale.
     */
    grayScale: boolean;
  }
  /**
   * Constructs and returns a cuboid geometry.
   */
  function cuboid(spec?: {
    position?:{
      name?:string
    },
    color?:{
      name?:string,
      value?:number[]
    }
    normal?:{
      name?:string
    }
  }): CuboidGeometry;
  /**
   * A surface generated by the parametric equation:
   * a * cos(phi) * sin(theta) + b * cos(theta) + c * sin(phi) * sin(theta),
   * where phi and theta are the conventional spherical coordinates.
   */
  interface EllipsoidGeometry extends VertexAttributeProvider {
    /**
     * The axis corresponding to (theta, phi) = (PI/2,0).
     */
    a: Vector3;
    /**
     * The axis corresponding to theta = 0.
     */
    b: Vector3;
    /**
     * The axis corresponding to (theta, phi) = (PI/2,PI/2).
     */
    c: Vector3;
    /**
     * The number of segments in the theta parameter.
     */
    thetaSegments: number;
    /**
     * The theta starting angle in radians.
     */
    thetaStart: number;
    /**
     * The theta sweep angle in radians.
     */
    thetaLength: number;
    /**
     * The number of segments in the phi parameter.
     */
    phiSegments: number;
    /**
     * The phi starting angle in radians.
     */
    phiStart: number;
    /**
     * The phi sweep angle in radians.
     */
    phiLength: number;
  }
  class ArrowGeometry extends Geometry {
    constructor();
  }
  class VortexGeometry extends Geometry {
    constructor();
  }
  class PolyhedronGeometry extends Geometry {
    constructor(vertices: number[], indices: number[], radius?:  number, detail?: number);
  }
  class DodecahedronGeometry extends PolyhedronGeometry {
    constructor(radius?: number, detail?: number);
  }
  class IcosahedronGeometry extends PolyhedronGeometry {
    constructor(radius?: number, detail?: number);
  }
  class KleinBottleGeometry extends ParametricGeometry {
    constructor(uSegments: number, vSegments: number);
  }
  class MobiusStripGeometry extends ParametricGeometry {
    constructor(uSegments: number, vSegments: number);
  }
  class OctahedronGeometry extends PolyhedronGeometry {
    constructor(radius?: number, detail?: number);
  }
  class ParametricGeometry extends Geometry {
    constructor(parametricFunction: (u: number, v: number) => Vector3, uSegments: number, vSegments: number);
  }
  class SphereGeometry extends Geometry {
    constructor(
      radius?: number,
      widthSegments?: number,
      heightSegments?: number,
      phiStart?: number,
      phiLength?: number,
      thetaStart?: number,
      thetaLength?: number);
  }
  class TetrahedronGeometry extends PolyhedronGeometry {
    constructor(radius?: number, detail?: number);
  }
  class TubeGeometry extends Geometry {
    constructor(
      path: Curve,
      segments?: number,
      radius?: number,
      radialSegments?: number,
      closed?: boolean,
      taper?: (u: number)=>number);
  }
  /**
   * Constructs and returns an ellipsoid geometry.
   */
  function ellipsoid(): EllipsoidGeometry;
  /**
   * Constructs and returns a prism geometry.
   */
  function prism(): VertexAttributeProvider;
  class Curve() {
  }
  /**
   * Constructs and returns a new Workbench3D.
   */
  function workbench(canvas: HTMLCanvasElement, renderer: Renderer, camera: Camera, window: Window): Workbench3D;
  /**
   * Constructs and returns a WindowAnimationRunner.
   */
  function animationRunner(tick: {(time: number): void;}, terminate: {(time: number): boolean;}, setUp: {(): void;}, tearDown: {(e: Error): void;}, window: Window): WindowAnimationRunner;
  /**
   * Constructs and returns a RenderingContextMonitor.
   */
  function contextMonitor(
    canvas: HTMLCanvasElement,
    contextFree: {(): void;},
    contextGain: {(context: WebGLRenderingContext, contextGainId: string): void;},
    contextLoss: {(): void;}
    ): RenderingContextMonitor;

  /**
   * The version string of the davinci-eight module.
   */
  var VERSION: string;
}

declare module 'EIGHT'
{
  export = EIGHT;
}
