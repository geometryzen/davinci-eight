//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'EIGHT'.
//
declare module EIGHT
{
  /**
   * @class DrawMode
   */
  enum DrawMode {
    /**
     * POINTS
     */
    POINTS,
    LINES,
    TRIANGLES
  }
  enum DataUsage {
    STATIC_DRAW,
    DYNAMIC_DRAW,
    STREAM_DRAW
  }
  /**
   *
   */
  function initWebGL(canvas: HTMLCanvasElement, attributes: any): WebGLRenderingContext;

  /**
   *
   */
  class RenderingContextUser {
    /**
     * Notify the target that it is no longer required, and request to free, dispose, or delete any WebGL resources acquired and owned by the target.
     */
    contextFree(): void;
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
  class Drawable extends RenderingContextUser {
    drawGroupName: string;
    /**
     *
     */
    useProgram(): void;
    /**
     *
     */
    draw(ambients: UniformProvider): void;
  }
  class World extends RenderingContextUser
  {
    drawGroups: {[drawGroupName:string]: Drawable[]},
    /**
     * Add a drawable to the root node of the world.
     */
    add(drawable: Drawable): void;
  }
  /**
   * Manages the lifecycle of an attribute used in a vertex shader.
   */
  class ShaderAttributeLocation {
    constructor(name: string, glslType: string) {
    }
    contextFree();
    contextGain(context: WebGLRenderingContext, program: WebGLProgram);
    contextLoss();
    enable();
    disable();
    dataFormat(size: number, type?: number, normalized?: boolean, stride?: number, offset?: number);
    bufferData(data: AttributeProvider);
  }
  class ShaderUniformLocation {
    constructor(name: string, glslType: string);
    contextFree();
    contextGain(context: WebGLRenderingContext, program: WebGLProgram);
    contextLoss();
    uniform2f(x: number, y: number);
    uniform2fv(data: number[]);
    uniform3fv(data: number[]);
    uniform4fv(data: number[]);
    uniformMatrix3fv(transpose: boolean, matrix: Float32Array);
    uniformMatrix4fv(transpose: boolean, matrix: Float32Array);
  }
  /**
   *
   */
  class Mutable<T> {
    data: T;
    callback: () => T;
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
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number);
  }
  interface Spinor3Coords {
    yz: number;
    zx: number;
    xy: number;
    w: number;
  }
  class Spinor3 extends Mutable<number[]> implements Spinor3Coords {
    public yz: number;
    public zx: number;
    public xy: number;
    public w: number;
    public data: number[];
    public callback: () => number[];
    constructor(spinor?: number[]);
    clone(): Spinor3;
    toString(): string;
  }
  interface Cartesian3 {
    x: number;
    y: number;
    z: number;
  }
  class Vector3 extends Mutable<number[]> implements Cartesian3 {
    public x: number;
    public y: number;
    public z: number;
    public data: number[];
    public callback: () => number[];
    public static e1: Vector3;
    public static e2: Vector3;
    public static e3: Vector3;
    constructor(vector?: number[]);
    multiplyScalar(s: number): Vector3;
    clone(): Vector3;
    copy(v: Cartesian3): Vector3;
    cross(v: Cartesian3): Vector3;
    crossVectors(a: Cartesian3, b: Cartesian3): Vector3;
    normalize(): Vector3;
  }
  /**
   *
   */
  interface UniformMetaInfo {
    name: string;
    glslType: string;
  }
  interface UniformMetaInfos {
    [property: string]: UniformMetaInfo
  }
  /**
   * Provides the runtime and design time data required to use a uniform in a vertex shader.
   */
  class UniformProvider {
    getUniformFloat(name: string): number;
    getUniformMatrix3(name: string): { transpose: boolean; matrix3: Float32Array };
    getUniformMatrix4(name: string): { transpose: boolean; matrix4: Float32Array };
    getUniformVector2(name: string): number[];
    getUniformVector3(name: string): number[];
    getUniformVector4(name: string): number[];
    getUniformMetaInfos(): UniformMetaInfos;
  }
  /**
   *
   */
  class AmbientLight extends UniformProvider {
    public color: UniformColor;
    constructor(options?: {color?: Color; name?: string});
  }
  /**
   *
   */
  class ChainedUniformProvider extends UniformProvider {
    constructor(one: UniformProvider, two: UniformProvider);
  }
  /**
   *
   */
  class DefaultUniformProvider extends UniformProvider {
    constructor();
  }
  /**
   *
   */
  class DirectionalLight extends UniformProvider {
    public color: UniformColor;
    public direction: UniformVector3;
    constructor(options?: {color?: Color; direction?: Vector3; name?: string});
  }
  /**
   *
   */
  class PointLight extends UniformProvider {
    public color: UniformColor;
    public position: UniformVector3;
    constructor(options?: {color?: Color; position?: Vector3; name?: string});
  }
  /**
   *
   */
  class MultiUniformProvider extends UniformProvider {
    constructor(providers: UniformProvider[]);
  }
  /**
   *
   */
  function uniforms(providers: UniformProvider[]): UniformProvider;
  /**
   *
   */
  class UniformVariable<T> extends UniformProvider {
    data: T;
    callback: () => T;
  }
  /**
   * Represents a uniform vec3 for a Color.
   */
  class UniformColor extends UniformVariable<Color> {
    constructor(name: string, id?: string);
  }
  /**
   * Represents a uniform vec3 for a Vector3.
   */
  class UniformVector3 extends UniformVariable<Vector3> {
    constructor(name: string, id?: string);
  }
  /**
   * Represents a uniform vec4 for a Spinor3.
   */
  class UniformSpinor3 extends UniformVariable<Spinor3> {
    constructor(name: string, id?: string);
  }
  /**
   * Represents a uniform float.
   */
  class UniformFloat extends UniformVariable<number> {
    constructor(name: string, id?: string);
  }
  /**
   * Represents a uniform mat4.
   */
  class UniformMat4 extends UniformVariable<{ transpose: boolean; matrix4: Float32Array}> {
    constructor(name: string, id?: string);
  }
  /**
   * Represents a uniform vec2.
   */
  class UniformVec2 extends UniformVariable<number[]> {
    constructor(name: string, id?: string);
  }
  /**
   * Represents a uniform vec3.
   */
  class UniformVec3 extends UniformVariable<number[]> {
    constructor(name: string, id?: string);
  }
  /**
   * Represents a uniform vec4.
   */
  class UniformVec4 extends UniformVariable<number[]> {
    constructor(name: string, id?: string);
  }
  /**
   * Provides the uniform for the model to view coordinates transformation.
   */
  class View extends UniformProvider {
    /**
     * The position of the view reference point, VRP.
     */
    eye: Cartesian3;
    /**
     * A special point in the scene that defines the viewplane normal, VPN or n.
     * n = eye - look, normalized to unity.
     */
    look: Cartesian3;
    /**
     * A unit vector used to determine the view horizontal direction, u.
     * u = cross(up, n), and
     * v = cross(n, u).
     */
    up: Cartesian3;
  }
  class Frustum extends View {
    left: number;
    right: number;
    bottom: number;
    top: number;
    near: number;
    far: number;
  }
  /**
   * A transformation from the 3D world or view volume to the canonical view volume.
   * The canonical view volume is the cube that extends from -1 to +1
   * in all cartesian directions. 
   */
  class LinearPerspectiveCamera extends View {
    /**
     * field of view angle in the view volume vertical plane, measured in radians.
     */
    fov: number;
    /**
     * ratio of width divided by height of the view volume.
     */
    aspect: number;
    /**
     * distance to the near plane of the view volume from the view reference point.
     */
    near: number;
    /**
     * distance to the far plane of the view volume from the view reference point.
     */
    far: number;
    /**
     * Convenience method for setting the aspect property allowing chainable method calls.
     */
    setAspect(aspect: number): LinearPerspectiveCamera;
    /**
     * Convenience method for setting the eye property allowing chainable method calls.
     */
    setEye(eye: {x: number; y: number; z:number}): LinearPerspectiveCamera;
  }
  interface AttributeMetaInfo {
    name: string,
    glslType: string,
    size: number,
    type?: number,
    normalized: boolean,
    stride: number,
    offset: number
  }
  interface AttributeMetaInfos {
    [property: string]: AttributeMetaInfo;
  }
  /**
   * ShaderVariableDecl
   */
  interface ShaderVariableDecl {
    /**
     * modifiers
     */
    modifiers: string[];
    /**
     * type
     */
    type: string;
    /**
     * name
     */
    name: string;
  }
  /**
   * A Geometry is the generator of calls to drawArrays or drawElements.
   */
  class AttributeProvider
  {
    draw(context: WebGLRenderingContext): void;
    /**
     * Determines how the thing will be drawn.
     */
    drawMode: DrawMode;
    /**
     * Determines whether this Geometry changes. If so, update may be called repeatedly.
     */
    dynamic: boolean;
    /**
     * Declares the vertex shader attributes the geometry can supply and information required for binding.
     */
    getAttributeMetaInfos(): AttributeMetaInfos;
    /**
     * Determines whether this Geometry uses WebGL's drawElements() for rendering.
     */
    hasElements(): boolean;
    /**
     * Returns the elements used in an index buffer implementation.
     * An implementation of Geometry is not required to support index buffers and may return undefined.
     */
    getElements(): {usage: DataUsage; data: Uint16Array};
    /**
     * Returns the data when drawing using arrays. 
     */
    getVertexAttributeData(name: string): {usage: DataUsage; data: Float32Array};
    /**
     * Notifies the mesh that it should update its array buffers.
     */
    update(attributes: ShaderVariableDecl[]): void;
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
  class Color
  {
    public red: number;
    public green: number;
    public blue: number;
    public data: number[];
    constructor(data?: number[]);
  }
  class GeometryAdapter extends AttributeProvider
  {
    public color: Color;
    constructor(geometry: Geometry, options?: {drawMode?: DrawMode});
  }
  class CurveMesh extends AttributeProvider {
    constructor(
      n: number,
      generator: (i: number, time: number) => {x: number; y: number; z: number});
  }
  class LatticeMesh extends AttributeProvider {
    constructor(
      I: number,
      J: number,
      K: number,
      generator: (i: number, j: number, k: number, time: number) => { x: number; y: number; z: number });
  }
  class BoxGeometry extends Geometry {
    constructor(
      width: number,
      height: number,
      depth: number,
      widthSegments?:number,
      heightSegments?:number,
      depthSegments?:number);
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
      thetaLength?: number);
  }
  class RGBMesh extends AttributeProvider {
    constructor();
  }
  /**
   * A vertex shader and a fragment shader combined into a program.
   */
  class ShaderProgram extends RenderingContextUser
  {
    attributes: ShaderVariableDecl[];
    constants: ShaderVariableDecl[];
    uniforms: ShaderVariableDecl[];
    varyings: ShaderVariableDecl[];
    program: WebGLProgram;
    programId: string;
    vertexShader: string;
    fragmentShader: string;
    /**
     * Makes the ShaderProgram the current program for WebGL.
     * This method has no effect if the ShaderProgram does not have a WebGLRenderingContext.
     */
    use(): void;
    /**
     *
     */
    attributeLocation(name: string): ShaderAttributeLocation;
    /**
     *
     */
    uniformLocation(name: string): ShaderUniformLocation;
  }
  /**
   * The combination of a geometry, model and a shaderProgram.
   */
  class DrawableModel<MESH extends AttributeProvider, SHADERS extends ShaderProgram, MODEL extends UniformProvider> extends Drawable
  {
    mesh: MESH;
    shaders: SHADERS;
    model: MODEL;
  }
  class Viewport extends RenderingContextUser
  {
    canvas: HTMLCanvasElement;
    context: WebGLRenderingContext;
    x: number;
    y: number;
    width: number;
    height: number;
    /**
     *
     */
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    render(world: World, views: UniformProvider[]): void;
    setSize(width: number, height: number): void;
  }
  interface ViewportParameters {
    alpha?: boolean;
    antialias?: boolean;
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
    time: number;
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
  function view(): View;
  /**
   * Constructs and returns a LinearPerspectiveCamera.
   */
  function frustum(
    left?: number,
    right?: number,
    bottom?: number,
    top?: number,
    near?: number,
    far?: number): Frustum;
  function perspective(
    /**
     * The field of view angle in the y-direction, measured in radians.
     */
    fov?: number,
    aspect?: number,
    near?: number,
    far?: number): LinearPerspectiveCamera;
  /**
   * Constructs and returns a Viewport.
   * @param options Optional parameters for modifying the WebGL context.
   */
  function viewport(canvas: HTMLCanvasElement, options?: ViewportParameters): Viewport;
  /**
   * Constructs a ShaderProgram from the specified shader codes.
   */
  function pointsProgram(): ShaderProgram;
  /**
   * Constructs a ShaderProgram from the specified vertex and fragment shader codes.
   */
  function shaderProgram(vertexShader: string, fragmentShader: string): ShaderProgram;
  /**
   * Constructs a ShaderProgram from the specified vertex and fragment shader script element identifiers.
   */
  function shaderProgramFromScripts(vsId: string, fsId: string, $document?: Document): ShaderProgram;
  /**
   * Constructs a ShaderProgram by introspecting a Geometry.
   */
  function smartProgram(attributes: AttributeMetaInfos, uniformsList: UniformMetaInfos[]): ShaderProgram;
  /**
   * Constructs a Drawable from the specified attribute provider and program.
   * @param geometry
   * @param shaderProgram
   */
  function drawableModel<A extends AttributeProvider, S extends ShaderProgram, U extends UniformProvider>(attributes: A, shaders: S, uniforms: U): DrawableModel<A, S, U>;
  /**
   *
   */
  class ModelMatrixUniformProvider extends UniformProvider {
    public position: Vector3;
    public attitude: Spinor3;
    constructor();
  }
  /**
   * Constructs and returns an arrow mesh.
   */
  function arrowMesh(
    options?: {
      wireFrame?: boolean
    }
  ): AttributeProvider;
  /**
   *
   */
  function arrow(
    ambients: UniformProvider
  ): DrawableModel<AttributeProvider, ShaderProgram, ModelMatrixUniformProvider>;
  /**
   *
   */
  interface BoxOptions {
    width?: number;
    height?: number;
    number?: number;
    widthSegments?: number;
    heightSegments?: number;
    numberSegments?: number;
    wireFrame?: boolean;
  }
  /**
   *
   */
  class BoxBuilder {
    width: number;
    height: number;
    number: number;
    widthSegments: number;
    heightSegments: number;
    numberSegments: number;
    wireFrame: boolean;
    constructor(options?: BoxOptions);
    setWidth(width: number): BoxBuilder;
    setHeight(height: number): BoxBuilder;
    setDepth(depth: number): BoxBuilder;
    setWidthSegments(widthSegments: number): BoxBuilder;
    setHeightSegments(heightSegments: number): BoxBuilder;
    setDepthSegments(depthSegments: number): BoxBuilder;
    setWireFrame(wireFrame: boolean): BoxBuilder;
    buildMesh(): AttributeProvider;
  }
  /**
   * Constructs and returns a box mesh.
   */
  function boxMesh(options?: BoxOptions): AttributeProvider;
  /**
   *
   */
  function box(ambients: UniformProvider, options: BoxOptions): DrawableModel<AttributeProvider, ShaderProgram, ModelMatrixUniformProvider>;
  /**
   * Constructs and returns a cylinder mesh.
   */
  function cylinderMesh(
    options?: {
      wireFrame?: boolean
    }
  ): AttributeProvider;
  /**
   *
   */
  function cylinder(
    ambients: UniformProvider
  ): DrawableModel<AttributeProvider, ShaderProgram, ModelMatrixUniformProvider>;
  /**
   *
   */
  interface SphereOptions {
    radius?: number;
    widthSegments?: number;
    heightSegments?: number;
    phiStart?: number;
    phiLength?: number;
    thetaStart?: number;
    thetaLength?: number;
    wireFrame?: boolean;
  }
  /**
   *
   */
  class SphereBuilder {
    radius: number;
    widthSegments: number;
    heightSegments: number;
    phiStart: number;
    phiLength: number;
    thetaStart: number;
    thetaLength: number;
    wireFrame: boolean;
    constructor(options?: SphereOptions);
    setRadius(radius: number): SphereBuilder;
    setWidthSegments(widthSegments: number): SphereBuilder;
    setHeightSegments(heightSegments: number): SphereBuilder;
    setPhiStart(phiStart: number): SphereBuilder;
    setPhiLength(phiLength: number): SphereBuilder;
    setThetaStart(phiStart: number): SphereBuilder;
    setThetaLength(phiLength: number): SphereBuilder;
    setWireFrame(wireFrame: boolean): SphereBuilder;
    buildMesh(): AttributeProvider;
  }
  /**
   * Constructs and returns an vortex mesh.
   */
  function sphereMesh(options?: SphereOptions): AttributeProvider;
  /**
   *
   */
  function sphere(ambients: UniformProvider, options?: SphereOptions): DrawableModel<AttributeProvider, ShaderProgram, ModelMatrixUniformProvider>;
  /**
   * Constructs and returns an vortex mesh.
   */
  function vortexMesh(
    options?: {
      wireFrame?: boolean
    }
  ): AttributeProvider;
  /**
   *
   */
  function vortex(
    ambients: UniformProvider
  ): DrawableModel<AttributeProvider, ShaderProgram, ModelMatrixUniformProvider>;
  /**
   *
   */
  interface CuboidMesh extends AttributeProvider {
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
    color: Color;
    /**
     * The cuboid should be rendered using a gray scale.
     */
    grayScale: boolean;
  }
  /**
   * Constructs and returns a cuboid mesh.
   */
  function cuboid(spec?: {
    position?:{
      name?:string
    },
    color?:{
      name?:string,
      value?:Color
    }
    normal?:{
      name?:string
    }
  }): CuboidMesh;
  /**
   * A surface generated by the parametric equation:
   * a * cos(phi) * sin(theta) + b * cos(theta) + c * sin(phi) * sin(theta),
   * where phi and theta are the conventional spherical coordinates.
   */
  interface EllipsoidMesh extends AttributeProvider {
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
   * Constructs and returns an ellipsoid mesh.
   */
  function ellipsoid(): EllipsoidMesh;
  /**
   * Constructs and returns a prism mesh.
   */
  function prism(): AttributeProvider;
  /**
   *
   */
  class Curve {
    constructor();
  }
  /**
   * Constructs and returns a new Workbench3D.
   */
  function workbench(canvas: HTMLCanvasElement, viewport: Viewport, view: View, window: Window): Workbench3D;
  /**
   * Constructs and returns a WindowAnimationRunner.
   */
  function animation(
    animate: {(time: number): void;},
    options?: {
      setUp?: () => void;
      tearDown?: { (animateException): void; };
      terminate?: (time: number) => boolean;
      window?: Window}): WindowAnimationRunner;
  /**
   *
   */
  interface RenderingContextMonitor
  {
    /**
     * Starts the monitoring of the WebGL context.
     */
    start(): RenderingContextMonitor;
    /**
     * Stops the monitoring of the WebGL context.
     */
    stop(): RenderingContextMonitor;
    /**
     *
     */
    addContextUser(user: RenderingContextUser): RenderingContextMonitor;
    /**
     *
     */
    context: WebGLRenderingContext;
  }
  /**
   * Constructs and returns a RenderingContextMonitor.
   */
  function contextMonitor(canvas: HTMLCanvasElement, attributes?: any): RenderingContextMonitor;

  /**
   *
   */
  function initWebGL(canvas: HTMLCanvasElement, attributes: any): WebGLRenderingContext;
  /**
   * The version string of the davinci-eight module.
   */
  var VERSION: string;
}

declare module 'EIGHT'
{
  export = EIGHT;
}
