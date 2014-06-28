//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
//
declare module eight
{
  interface Scene
  {
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
      public add(rhs: Euclidean3): Euclidean3;
      public sub(rhs: Euclidean3): Euclidean3;
      public mul(rhs: any): Euclidean3;
      public div(rhs: any): Euclidean3;
      public wedge(rhs: Euclidean3): Euclidean3;
      public lshift(rhs: Euclidean3): Euclidean3;
      public rshift(rhs: Euclidean3): Euclidean3;
      public grade(index: number): Euclidean3;
      public dot(vector: Euclidean3): number;
      public cross(vector: Euclidean3): Euclidean3;
      public length(): number;
      public norm(): Euclidean3;
      public quad(): Euclidean3;
      public sqrt(): Euclidean3;
      public toString(): string;
      public toStringIJK(): string;
      public toStringLATEX(): string;
  }
  interface Projection
  {
  }
  interface Geometry
  {
  }
  interface Mesh
  {
    attitude: Euclidean3;
    position: Euclidean3;
  }
  interface WebGLContextMonitor
  {
    start(): void;
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
  function scene(): Scene;
  function perspective(fov: number, aspect: number, near: number, far: number): Projection;
  function renderer(): WebGLRenderer;
  function mesh(geometry: Geometry): Mesh;
  function box(): Geometry;
  function prism(): Geometry;
  function scalarE3(w: number): Euclidean3;
  function vectorE3(x: number, y: number, z: number): Euclidean3;
  function bivectorE3(xy: number, yz: number, zx: number): Euclidean3;
  function workbench(canvas: HTMLCanvasElement, renderer: WebGLRenderer, camera: Projection, window: Window): Workbench3D;
  function animationRunner(tick: {(time: number): void;}, terminate: {(time: number): boolean;}, setUp: {(): void;}, tearDown: {(e: Error): void;}, window: Window): WindowAnimationRunner;
  function contextMonitor(canvas: HTMLCanvasElement, contextLoss: {(): void;}, contextGain: {(context: WebGLRenderingContext): void;}): WebGLContextMonitor;
}

declare module 'eight'
{
  export = eight;
}
