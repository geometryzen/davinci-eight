//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'eight'.
//
declare module eight
{
  interface Drawable {
    drawGroupName: string;
    useProgram(context: WebGLRenderingContext);
    draw(context: WebGLRenderingContext, time: number);
  }
  interface RenderingContextUser {
    /**
     * Notify that Scene is no longer required and request to free, dispose or delete any WebGL resources acquired and owned by the Scene.
     * The Scene will broadcast this to all Drawable(s) it knows about through add().
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
  interface Scene extends RenderingContextUser
  {
    drawGroups: {[drawGroupName:string]: Drawable[]},
    /**
     * Add a drawable to the root node of the scene.
     */
    add(drawable: Drawable): void;
  }
  class Euclidean3 {
      public w: number;
      public x: number;
      public y: number;
      public z: number;
      public xy: number;
      public yz: number;
      public zx: number;
      public xyz: number;
      constructor(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number);
      static fromCartesian(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number): Euclidean3;
      static fromObject(self?: {
          w?: number;
          x?: number;
          y?: number;
          z?: number;
          xy?: number;
          yz?: number;
          zx?: number;
          xyz?: number;
      }): Euclidean3;
      public coordinates(): number[];
      public coordinate(index: number): number;
      /**
       * Returns the sum of the target and the argument.
       */
      public add(rhs: Euclidean3): Euclidean3;
      /**
       * Returns the difference of the target and the argument.
       */ 
      public sub(rhs: Euclidean3): Euclidean3;
      /**
       * Returns the product of the target and the argument.
       */
      public mul(rhs: any): Euclidean3;
      /**
       * Returns the quotient of the target and the argument.
       */
      public div(rhs: any): Euclidean3;
      /**
       * Returns the outer product of the the target and the argument. 
       */
      public wedge(rhs: Euclidean3): Euclidean3;
      /**
       * Returns the left contraction of the target and the argument.
       */
      public lshift(rhs: Euclidean3): Euclidean3;
      /**
       * Returns the right contraction of the target and the argument.
       */
      public rshift(rhs: Euclidean3): Euclidean3;
      /**
       * Returns the part of the target with the specified grade.
       */
      public grade(index: number): Euclidean3;
      /**
       * Return the dot product of the target with the argument.
       */
      public dot(vector: Euclidean3): number;
      /**
       * Returns the cross product of the target with the argument. 
       */
      public cross(vector: Euclidean3): Euclidean3;
      /**
       * Returns the number of components in the Euclidean3.
       */
      public length(): number;
      /**
       * Returns the norm of the Euclidean3. For a vector, this would be the magnitude.
       */
      public norm(): Euclidean3;
      /**
       * Returns the quadrance of the Euclidean3. The norm is the square root of the quadrance.
       */
      public quad(): Euclidean3;
      public sqrt(): Euclidean3;
      public toString(): string;
      public toStringIJK(): string;
      public toStringLATEX(): string;
  }
  /**
   * A transformation from the 3D world to the view cube.
   */
  interface Camera
  {
    projectionMatrix: Float32Array;
  }
  /**
   * A Geometry is the generator of calls to drawArrays or drawElements.
   * The Mesh-Geometry-Material separation of concerns implements a Drawable.
   */
  interface Geometry
  {
    draw(context: WebGLRenderingContext): void;
    /**
     * Determines whether this Geometry changes. If so, update may be called repeatedly.
     */
    dynamic(): boolean;
    /**
     * Declares the vertex shader attributes the geometry can supply and information required for binding.
     */
    getAttributes(): {name: string, size: number, normalized: boolean, stride: number, offset: number}[];
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
    getVertexAttribArrayData(name: string): Float32Array;
    /**
     * Notifies the geometry that it should update its array buffers.
     */
    update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void;
  }
  class CurveGeometry implements Geometry {
    constructor(
      n: number,
      generator: (i: number, time: number) => {x: number; y: number; z: number});
    draw(context: WebGLRenderingContext): void;
    dynamic(): boolean;
    hasElements(): boolean;
    getAttributes(): {name: string, size: number, normalized: boolean, stride: number, offset: number}[];
    getElements(): Uint16Array;
    getVertexAttribArrayData(name: string): Float32Array;
    update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void;
  }
  class LatticeGeometry implements Geometry {
    constructor(
      I: number,
      J: number,
      K: number,
      generator: (i: number, j: number, k: number, time: number) => { x: number; y: number; z: number });
    draw(context: WebGLRenderingContext): void;
    dynamic(): boolean;
    getAttributes(): {name: string, size: number, normalized: boolean, stride: number, offset: number}[];
    hasElements(): boolean;
    getElements(): Uint16Array;
    getVertexAttribArrayData(name: string): Float32Array;
    update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void;
  }
  class RGBGeometry implements Geometry {
    constructor();
    draw(context: WebGLRenderingContext): void;
    dynamic(): boolean;
    getAttributes(): {name: string, size: number, normalized: boolean, stride: number, offset: number}[];
    hasElements(): boolean;
    getElements(): Uint16Array;
    getVertexAttribArrayData(name: string): Float32Array;
    update(time: number, attributes: {modifiers: string[], type: string, name: string}[]): void;
  }
  /**
   * A vertex shader and a fragment shader combined into a program.
   */
  interface Material extends RenderingContextUser
  {
    attributes: {modifiers: string[], type: string, name: string}[];
    uniforms: {modifiers: string[], type: string, name: string}[];
    varyings: {modifiers: string[], type: string, name: string}[];
    program: WebGLProgram;
    programId: string;
  }
  /**
   * The combination of a geometry and a material.
   */
  interface Mesh<G extends Geometry, M extends Material> extends Drawable
  {
    geometry: G;
    material: M;
    /**
     * The attitude of the mesh expressed as a rotor.
     */
    attitude: Euclidean3;
    /**
     * The position of the mesh relative to the origin. 
     */
    position: Euclidean3;
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
  interface Renderer
  {
    canvas: HTMLCanvasElement;
    context: WebGLRenderingContext;
    contextFree(): void;
    contextGain(gl: WebGLRenderingContext, contextGainId: string): void;
    contextLoss(): void;
    render(scene: Scene): void;
    setSize(width: number, height: number): void;
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
   * Constructs and returns a Scene.
   */
  function scene(): Scene;
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
   * Constructs a Material from the specified shader codes.
   */
  function rawShaderMaterial(vertexShader: string, fragmentShader: string): Material;
  /**
   * Constructs a mesh from the specified geometry and material.
   * The uniformCallback must be supplied if the vertex shader has uniform variables.
   * @param geometry
   * @param material
   * @param uniformCallback
   */
  function mesh<G extends Geometry, M extends Material>(geometry: G, material: M, uniformCallback?: (name: string) => {transpose: boolean, value: any}): Mesh<G, M>;
  /**
   * Constructs and returns a box geometry.
   */
  function box(): Geometry;
  /**
   *
   */
  interface CuboidGeometry extends Geometry {
    /**
     * The axis corresponding to e1.
     */
    a: blade.Euclidean3;
    /**
     * The axis corresponding to e2.
     */
    b: blade.Euclidean3;
    /**
     * The axis corresponding to e3.
     */
    c: blade.Euclidean3;
    /**
     * The color of the cuboid.
     */
    color: number[];
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
  interface EllipsoidGeometry extends Geometry {
    /**
     * The axis corresponding to (theta, phi) = (PI/2,0).
     */
    a: blade.Euclidean3;
    /**
     * The axis corresponding to theta = 0.
     */
    b: blade.Euclidean3;
    /**
     * The axis corresponding to (theta, phi) = (PI/2,PI/2).
     */
    c: blade.Euclidean3;
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
  /**
   * Constructs and returns an ellipsoid geometry.
   */
  function ellipsoid(): EllipsoidGeometry;
  /**
   * Constructs and returns a prism geometry.
   */
  function prism(): Geometry;
  /**
   * Returns a Euclidean 3-dimensional number representing a scalar.
   */
  function scalarE3(w: number): Euclidean3;
  /**
   * Returns a vector from its cartesian components.
   * @param x The component of the vector in the x-axis direction.
   * @param y The component of the vector in the y-axis direction.
   * @param z The component of the vector in the z-axis direction.
   */
  function vectorE3(x: number, y: number, z: number): Euclidean3;
  /**
   * Returns a bivector from its cartesian components.
   * @param xy The bivector component in the xy-plane.
   * @param yz The bivector component in the yz-plane.
   * @param zx The bivector component in the zx-plane.
   */
  function bivectorE3(xy: number, yz: number, zx: number): Euclidean3;
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
   * The version string of the eight module.
   */
  var VERSION: string;
}

declare module 'eight'
{
  export = eight;
}
