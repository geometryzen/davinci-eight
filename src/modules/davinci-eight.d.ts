//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'eight'.
//
declare module eight
{
  interface Scene
  {
    /**
     * Adda a mesh to the root node of the scene.
     */
    add(mesh: Mesh): void;
    tearDown(): void;
    onContextLoss(): void;
    onContextGain(context: WebGLRenderingContext): void;
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
   * A transformation from the 3D world to the 2D canvas.
   */
  interface Projection
  {
  }
  /**
   * A simplex of triangular regions
   */
  interface Geometry
  {
  }
  /**
   * The combination of a geometry and a material.
   */
  interface Mesh
  {
    /**
     * The attitude of the mesh expressed as a rotor.
     */
    attitude: Euclidean3;
    /**
     * The position of the mesh relative to the origin. 
     */
    position: Euclidean3;
  }
  interface WebGLContextMonitor
  {
    /**
     * Starts the monitoring of the WebGL context.
     */
    start(): void;
    /**
     * Stops the monitoring of the WebGL context.
     */
    stop(): void;
  }
  interface WebGLRenderer
  {
    canvas: HTMLCanvasElement;
    context: WebGLRenderingContext;
    onContextLoss(): void;
    onContextGain(context: WebGLRenderingContext): void;
    render(scene: Scene, camera: Projection): void;
  }
  interface WindowAnimationRunner
  {
    start(): void;
    stop(): void;
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
  function perspective(fov: number, aspect: number, near: number, far: number): Projection;
  /**
   * Constructs and returns a WebGL renderer.
   */
  function renderer(): WebGLRenderer;
  /**
   * Constructs a mesh from the specified geometry and material.
   */
  function mesh(geometry: Geometry): Mesh;
  /**
   * Constructs and returns a box geometry.
   */
  function box(): Geometry;
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
  function workbench(canvas: HTMLCanvasElement, renderer: WebGLRenderer, camera: Projection, window: Window): Workbench3D;
  /**
   * Constructs and returns a WindowAnimationRnner.
   */
  function animationRunner(tick: {(time: number): void;}, terminate: {(time: number): boolean;}, setUp: {(): void;}, tearDown: {(e: Error): void;}, window: Window): WindowAnimationRunner;
  /**
   * Constructs and returns a WebGLContextMonitor.
   */
  function contextMonitor(canvas: HTMLCanvasElement, contextLoss: {(): void;}, contextGain: {(context: WebGLRenderingContext): void;}): WebGLContextMonitor;
}

declare module 'eight'
{
  export = eight;
}
