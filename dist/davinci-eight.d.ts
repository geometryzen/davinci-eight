//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'EIGHT'.
//
/**
 * WebGL library for mathematical physics using Geometric Algebra.
 * VERSION:  2.98.0
 * GITHUB:   https://github.com/geometryzen/davinci-eight
 * MODIFIED: 2015-09-18
 */
declare module EIGHT {

/**
 * Enables clients of IUnknown instances to declare their references.
 */
interface IUnknown {
  /**
   * Notifies this instance that something is referencing it.
   */
  addRef(): number;
  /**
   * Notifies this instance that something is dereferencing it.
   */
  release(): number;
}

/**
 * Convenience base class for classes requiring reference counting.
 * 
 * Derived classes should implement the method destructor(): void.
 */
class Shareable implements IUnknown {
  /**
   * type: A human-readable name for the derived class type.
   */
  constructor(type: string);
  /**
   * Notifies this instance that something is referencing it.
   */
  addRef(): number;
  /**
   * Notifies this instance that something is dereferencing it.
   */
  release(): number;
}

/**
 *
 */
interface ContextListener {
  /**
   * Called to request the dependent to free any WebGL resources acquired and owned.
   * The dependent may assume that its cached context is still valid in order
   * to properly dispose of any cached resources. In the case of shared objects, this
   * method may be called multiple times for what is logically the same context. In such
   * cases the dependent must be idempotent and respond only to the first request.
   * canvasId: Determines the context for which resources are being freed.
   */
  contextFree(canvasId: number): void;
  /**
   * Called to inform the dependent of a new WebGL rendering context.
   * The implementation should ignore the notification if it has already
   * received the same context.
   * manager: If there's something strange in your neighborhood.
   */
  contextGain(manager: ContextManager): void;
  /**
   * Called to inform the dependent of a loss of WebGL rendering context.
   * The dependent must assume that any cached context is invalid.
   * The dependent must not try to use and cached context to free resources.
   * The dependent should reset its state to that for which there is no context.
   * canvasId: Determines the context for which resources are being lost.
   */
  contextLoss(canvasId: number): void;
}

/**
 *
 */
interface IResource extends IUnknown, ContextListener {

}

/**
 *
 */
interface IBufferGeometry extends IUnknown {
  uuid: string;
  bind(program: IMaterial, aNameToKeyName?: {[name: string]: string}): void;
  draw(): void;
  unbind(): void;
}

/**
 *
 */
class GeometryData {
  public k: number;
  public indices: VectorN<number>;
  public attributes: {[name: string]: DrawAttribute};
  constructor(k: number, indices: VectorN<number>, attributes: {[name: string]: DrawAttribute});
}

/**
 *
 */
class DrawAttribute {
  public values: VectorN<number>;
  public size: number;
  constructor(values: VectorN<number>, size: number);
}

/**
 * A simplex is the generalization of a triangle or tetrahedron to arbitrary dimensions.
 * A k-simplex is the convex hull of its k + 1 vertices.
 */
class Simplex {
  public vertices: Vertex[];
  /**
   * k: The initial number of vertices in the simplex is k + 1.
   */
  constructor(k: number);
  /**
   * An empty set can be consired to be a -1 simplex (algebraic topology).
   */
  public static K_FOR_EMPTY: number;
  /**
   * A single point may be considered a 0-simplex.
   */
  public static K_FOR_POINT: number;
  /**
   * A line segment may be considered a 1-simplex.
   */
  public static K_FOR_LINE_SEGMENT: number;
  /**
   * A 2-simplex is a triangle.
   */
  public static K_FOR_TRIANGLE: number;
  /**
   * A 3-simplex is a tetrahedron.
   */
  public static K_FOR_TETRAHEDRON: number;
  /**
   * A 4-simplex is a 5-cell.
   */
  public static K_FOR_FIVE_CELL: number;
  public static computeFaceNormals(simplex: Simplex, name: string);
  public static indices(simplex: Simplex): number[];
  /**
   * Applies the boundary operation the specified number of times.
   * times: The number of times to apply the boundary operation.
   * triangles are converted into three lines.
   * lines are converted into two points.
   * points are converted into the empty geometry.
   */
  public static boundary(geometry: Simplex[], n?: number): Simplex[];
  /**
   * Applies the subdivide operation the specified number of times.
   * times: The number of times to apply the subdivide operation.
   * The subdivide operation computes the midpoint of all pairs of vertices
   * and then uses the original points and midpoints to create new simplices
   * that span the original simplex. 
   */
  public static subdivide(simplices: Simplex[], times?: number): Simplex[];
}

/**
 *
 */
 class Vertex {
  public attributes: { [name: string]: VectorN<number> };
  public opposing: Simplex[];
  public parent: Simplex;
  constructor();
}

/**
 *
 */
interface GeometryMeta {
  k: number;
  attributes: { [key: string]: { size: number; name?: string } };
}

/**
 * Computes the mapping from attribute name to size.
 * Reports inconsistencies in the geometry by throwing exceptions.
 * When used with toGeometryData(), allows names and sizes to be mapped.
 */
function toGeometryMeta(geometry: Simplex[]): GeometryMeta;

/**
 *
 */
function computeFaceNormals(simplex: Simplex, positionName?: string, normalName?: string): void;

/**
 * Creates a cube of the specified side length.
 *
 *    6------ 5
 *   /|      /|
 *  1-------0 |
 *  | |     | |
 *  | 7-----|-4
 *  |/      |/
 *  2-------3
 *
 * The triangle simplices are:
 * 1-2-0, 3-0-2, ...
 */
function cube(size?: number): Simplex[];

/**
 *
 *  b-------a
 *  |       | 
 *  |       |
 *  |       |
 *  c-------d
 *
 * The quadrilateral is split into two triangles: b-c-a and d-a-c, like a "Z".
 * The zeroth vertex for each triangle is opposite the other triangle.
 */
function quadrilateral(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes?: { [name: string]: VectorN<number>[] }, triangles?: Simplex[]): Simplex[];

/**
 *
 *  b-------a
 *  |       | 
 *  |       |
 *  |       |
 *  c-------d
 *
 * The square is split into two triangles: b-c-a and d-a-c, like a "Z".
 * The zeroth vertex for each triangle is opposite the other triangle.
 */
function square(size?: number): Simplex[];

/**
 * The tetrahedron is composed of four triangles: abc, bdc, cda, dba.
 */
function tetrahedron(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, d: VectorN<number>, attributes?: { [name: string]: VectorN<number>[] }, triangles?: Simplex[]): Simplex[];

/**
 *
 */
function triangle(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes?: { [name: string]: VectorN<number>[] }, triangles?: Simplex[]): Simplex[];

/**
 * geometry to GeometryData conversion.
 */
function toGeometryData(data: Simplex[], meta?: GeometryMeta): GeometryData;

/**
 *
 */
interface ContextProgramListener {
  contextFree(): void;
  contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
  contextLoss(): void;
}

/**
 * Manages the lifecycle of an attribute used in a vertex shader.
 */
class AttribLocation implements ContextProgramListener {
  index: number;
  constructor(name: string, size: number, type: number);
  contextFree(): void;
  contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
  contextLoss(): void;
  enable(): void;
  disable(): void;
  vertexPointer(size: number, normalized?: boolean, stride?: number, offset?: number): void;
}

/**
 * A wrapper around a `WebGLBuffer` that is associated at construction with
 * a particular kind of target.
 */
interface IBuffer extends IResource {
  /**
   * Makes this buffer current by binding it to the appropriate target.
   */
  bind(): void;
  /**
   * Clears the appropriate target so that this buffer is no longer bound.
   */
  unbind(): void;
}

/**
 *
 */
class UniformLocation implements ContextProgramListener {
  constructor(monitor: ContextManager, name: string);
  contextFree(): void;
  contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
  contextLoss(): void;
  uniform1f(x: number): void;
  uniform2f(x: number, y: number): void;
  uniform3f(x: number, y: number, z: number): void;
  uniform4f(x: number, y: number, z: number, w: number): void;
  matrix1(transpose: boolean, matrix: Matrix1): void;
  matrix2(transpose: boolean, matrix: Matrix2): void;
  matrix3(transpose: boolean, matrix: Matrix3): void;
  matrix4(transpose: boolean, matrix: Matrix4): void;
  vector1(vector: Vector1): void;
  vector2(vector: Vector2): void;
  vector3(vector: Vector3): void;
  vector4(vector: Vector4): void;
}

/**
 *
 */
interface ITexture extends IResource {
  bind(): void;
  unbind(): void;
}

/**
 * A reference-counted wrapper around a `WebGLTexture`.
 * It is associated with the `TEXTURE_2D` target at construction time. 
 */
interface ITexture2D extends ITexture {

}

/**
 * A reference-counted wrapper around a `WebGLTexture`.
 * It is associated with the `TEXTURE_CUBE_MAP` target at construction time. 
 */
interface ITextureCubeMap extends ITexture {

}

/**
 *
 */
interface Mutable<T> {
  data: T;
  callback: () => T;
}

/**
 *
 */
interface LinearElement<I, M, S> {
  add(rhs: I): M;
  clone(): M;
  copy(source: I): M;
  difference(a: I, b: I): M;
  divideScalar(scalar: number): M;
  lerp(target: I, alpha: number): M;
  multiplyScalar(scalar: number): M;
//reflect(vector: I): M;
  rotate(rotor: S): M;
  sub(rhs: I): M;
  sum(a: I, b: I): M;
}

/**
 *
 */
interface GeometricElement<I, M> extends LinearElement<I, M, I> {
  exp(): M;
  magnitude(): number;
  multiply(element: I): M;
  product(a: I, b: I): M;
  quaditude(): number;
}

/**
 *
 */
class Matrix1 {
  public data: Float32Array;
  constructor(data: Float32Array);
}

/**
 *
 */
class Matrix2 {
  public data: Float32Array;
  constructor(data: Float32Array);
}

/**
 *
 */
class Matrix3 {
  public data: Float32Array;
  constructor(data: Float32Array);
  /**
   * Generates a new identity matrix.
   */
  static identity(): Matrix3;
  /**
   *
   */
  identity(): Matrix4;
  /**
   *
   */
  normalFromMatrix4(matrix: Matrix4): void;
}

/**
 *
 */
class Matrix4 {
  public data: Float32Array;
  constructor(data: Float32Array);
  /**
   * Generates a new identity matrix.
   */
  static identity(): Matrix4;
  /**
   * Generates a new scaling matrix.
   */
  static scaling(scale: Cartesian3): Matrix4;
  /**
   * Generates a new translation matrix.
   */
  static translation(vector: Cartesian3): Matrix4;
  /**
   * Generates a new rotation matrix.
   */
  static rotation(spinor: Spinor3Coords): Matrix4;
  /**
   *
   */
  copy(matrix: Matrix4): Matrix4;
  /**
   *
   */
  determinant(): number;
  /**
   *
   */
  identity(): Matrix4;
  invert(m: Matrix4, throwOnSingular?: boolean): Matrix4;
  multiply(matrix: Matrix4): Matrix4;
  product(a: Matrix4, b: Matrix4): Matrix4;
  rotate(spinor: Spinor3Coords): void;
  rotation(spinor: Spinor3Coords): void;
  scale(scale: Cartesian3): void;
  scaling(scale: Cartesian3): void;
  translate(displacement: Cartesian3): void;
  translation(displacement: Cartesian3): void;
  frustum(left: number, right: number, bottom: number, top: number, near: number, far: number);
  toString(): string;
  toFixed(digits?: number): string;
}

/**
 *
 */
interface Cartesian1 {
  x: number;
}

/**
 *
 */
interface Cartesian2 {
  x: number;
  y: number;
}

/**
 *
 */
class VectorN<T> implements Mutable<T[]> {
  public callback: () => T[];
  public data: T[];
  public modified: boolean;
  constructor(data: T[], modified?: boolean, size?: number);
  clone(): VectorN<T>;
  getComponent(index: number): T;
  pop(): T;
  push(value: T): number;
  setComponent(index: number, value: T): void;
  toArray(array?: T[], offset?: number): T[];
  toLocaleString(): string;
  toString(): string;
}

/**
 *
 */
class Vector1 extends VectorN<number> implements Cartesian1 {
  public x: number;
  constructor(data?: number[], modified?: boolean);
}

/**
 *
 */
class Vector2 extends VectorN<number> implements Cartesian2 {
  public x: number;
  public y: number;
  constructor(data?: number[], modified?: boolean);
  add(v: Cartesian2): Vector2;
  sum(a: Cartesian2, b: Cartesian2): Vector2;
  copy(v: Cartesian2): Vector2;
  magnitude(): number;
  multiplyScalar(s: number): Vector2;
  quaditude(): number;
  set(x: number, y: number): Vector2;
  sub(v: Cartesian2): Vector2;
  difference(a: Cartesian2, b: Cartesian2): Vector2;
}

/**
 * R = mn (i.e. a versor), with the constraint that R * ~R = ~R * R = 1
 *
 * The magnitude constraint means that a Rotor3 can be implemented with a unit scale,
 * leaving only 3 parameters. This should improve computational efficiency.
 */
interface Rotor3 extends Spinor3Coords {
  modified: boolean;
  copy(spinor: Spinor3Coords): Rotor3;
  exp(): Rotor3;
  multiply(spinor: Spinor3Coords): Rotor3;
  multiplyScalar(s: number): Rotor3;
  product(a: Spinor3Coords, b: Spinor3Coords): Rotor3;
  reverse(): Rotor3;
  toString(): string;
  wedgeVectors(m: Cartesian3, n: Cartesian3): Rotor3;
}

/**
 *
 */
function rotor3(): Rotor3;

/**
 *
 */
interface Spinor3Coords {
  yz: number;
  zx: number;
  xy: number;
  w: number;
}

/**
 *
 */
class Spinor3 extends VectorN<number> implements Spinor3Coords, GeometricElement<Spinor3Coords, Spinor3> {
  public yz: number;
  public zx: number;
  public xy: number;
  public w: number;
  constructor(data?: number[], modified?: boolean);
  add(rhs: Spinor3Coords): Spinor3;
  clone(): Spinor3;
  copy(spinor: Spinor3Coords): Spinor3;
  difference(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
  divideScalar(scalar: number): Spinor3;
  exp(): Spinor3;
  lerp(target: Spinor3Coords, alpha: number): Spinor3;
  magnitude(): number;
  multiply(rhs: Spinor3Coords): Spinor3;
  multiplyScalar(scalar: number): Spinor3;
  /**
   * Sets this Spinor3 to the geometric product of the vectors a and b, a * b.
   */
  product(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
  quaditude(): number;
  reverse(): Spinor3;
  rotate(rotor: Spinor3Coords): Spinor3;
  sub(rhs: Spinor3Coords): Spinor3;
  sum(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
  toString(): string;
  /**
   * Sets this Spinor3 to the outer product of the vectors a and b, a ^ b.
   */
  wedgeVectors(a: Cartesian3, b: Cartesian3): Spinor3;
}

/**
 * `Components` of a vector in a 3-dimensional cartesian coordinate system.
 */
interface Cartesian3 {
  /**
   * The magnitude of the projection onto the standard e1 basis vector. 
   */
  x: number;
  /**
   * The magnitude of the projection onto the standard e2 basis vector. 
   */
  y: number;
  /**
   * The magnitude of the projection onto the standard e2 basis vector. 
   */
  z: number;
}

/**
 *
 */
 class Vector3 extends VectorN<number> implements Cartesian3, LinearElement<Cartesian3, Vector3, Spinor3Coords> {
  public x: number;
  public y: number;
  public z: number;
  public static e1: Vector3;
  public static e2: Vector3;
  public static e3: Vector3;
  public static copy(vector: Cartesian3): Vector3;
  constructor(data?: number[], modified?: boolean);
  add(rhs: Cartesian3): Vector3;
  clone(): Vector3;
  copy(v: Cartesian3): Vector3;
  cross(v: Cartesian3): Vector3;
  crossVectors(a: Cartesian3, b: Cartesian3): Vector3;
  difference(a: Cartesian3, b: Cartesian3): Vector3;
  distanceTo(position: Cartesian3): number;
  divideScalar(rhs: number): Vector3;
  magnitude(): number;
  lerp(target: Cartesian3, alpha: number): Vector3;
  multiplyScalar(rhs: number): Vector3;
  normalize(): Vector3;
  quaditude(): number;
  quadranceTo(position: Cartesian3): number;
  rotate(rotor: Spinor3Coords): Vector3;
  set(x: number, y: number, z: number): Vector3;
  setMagnitude(magnitude: number): Vector3;
  sub(rhs: Cartesian3): Vector3;
  sum(a: Cartesian3, b: Cartesian3): Vector3;
}

/**
 *
 */
interface Cartesian4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

/**
 *
 */
class Vector4 extends VectorN<number> implements Cartesian4 {
  public x: number;
  public y: number;
  public z: number;
  public w: number;
  constructor(data?: number[], modified?: boolean);
}

/**
 *
 */
interface UniformDataVisitor {
  uniform1f(name: string, x: number);
  uniform2f(name: string, x: number, y: number);
  uniform3f(name: string, x: number, y: number, z: number);
  uniform4f(name: string, x: number, y: number, z: number, w: number);
  uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1);
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2);
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3);
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4);
  uniformVector1(name: string, vector: Vector1);
  uniformVector2(name: string, vector: Vector2);
  uniformVector3(name: string, vector: Vector3);
  uniformVector4(name: string, vector: Vector4);
}

/**
 *
 */
interface UniformData {
  setUniforms(visitor: UniformDataVisitor, canvasId): void;
}

/**
 * Provides the uniform for the model to view coordinates transformation.
 */
interface View extends UniformData {
  /**
   * The position of the view reference point, VRP.
   */
  eye: Vector3;
  /**
   * A special point in the world coordinates that defines the viewplane normal, VPN or n.
   * n = eye - look, normalized to unity.
   */
  look: Cartesian3;
  /**
   * A unit vector used to determine the view horizontal direction, u.
   * u = cross(up, n), and
   * v = cross(n, u).
   */
  up: Vector3;
  /**
   * Convenience method for setting the eye property allowing chainable method calls.
   */
  setEye(eye: Cartesian3): View;
  /**
   * Convenience method for setting the look property allowing chainable method calls.
   */
  setLook(look: Cartesian3): View;
  /**
   * Convenience method for setting the up property allowing chainable method calls.
   */
  setUp(up: Cartesian3): View;
}

/**
 *
 */
 interface Frustum extends View {
  left: number;
  right: number;
  bottom: number;
  top: number;
  near: number;
  far: number;
  /**
   * Convenience method for setting the eye property allowing chainable method calls.
   */
  setEye(eye: Cartesian3): Frustum;
  /**
   * Convenience method for setting the look property allowing chainable method calls.
   */
  setLook(look: Cartesian3): Frustum;
  /**
   * Convenience method for setting the up property allowing chainable method calls.
   */
  setUp(up: Cartesian3): Frustum;
}

/**
 * A transformation from the 3D world coordinates or view volume to the canonical view volume.
 * The canonical view volume is the cube that extends from -1 to +1
 * in all cartesian directions. 
 */
interface Perspective extends View {
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
   * Convenience method for setting the fov property allowing chainable method calls.
   */
  setFov(fov: number): Perspective;
  /**
   * Convenience method for setting the aspect property allowing chainable method calls.
   */
  setAspect(aspect: number): Perspective;
  /**
   * Convenience method for setting the near property allowing chainable method calls.
   */
  setNear(near: number): Perspective;
  /**
   * Convenience method for setting the far property allowing chainable method calls.
   */
  setFar(far: number): Perspective;
  /**
   * Convenience method for setting the eye property allowing chainable method calls.
   */
  setEye(eye: Cartesian3): Perspective;
  /**
   * Convenience method for setting the look property allowing chainable method calls.
   */
  setLook(look: Cartesian3): Perspective;
  /**
   * Convenience method for setting the up property allowing chainable method calls.
   */
  setUp(up: Cartesian3): Perspective;
}

/**
 *
 */
class Face3 {
  public a: number;
  public b: number;
  public c: number;
  public vertexNormals: Cartesian3[];
  constructor(a: number, b: number, c: number, vertexNormals?: Cartesian3[]);
}

/**
 *
 */
 class Sphere {
  public center: Cartesian3;
  public radius: number;
  constructor(center?: Cartesian3, radius?: number);
  setFromPoints(points: Cartesian3[]);
}

/**
 * A complex holds a list of simplices.
 */
class Complex {
  public data: Simplex[];
  /**
   * Summary information on the simplices such as dimensionality and sizes for attributes.
   * This same data structure may be used to map vertex attribute names to program names.
   */
  public meta: GeometryMeta;
  public dynamic: boolean;
  public verticesNeedUpdate: boolean;
  public elementsNeedUpdate: boolean;
  public uvsNeedUpdate: boolean;
  constructor();
  /**
   * Applies the boundary operation to the geometry.
   * Under the boundary operation, each k-simplex becomes several simplices of dimension k - 1.
   * For example, the following mappings hold:
   * Tetrahedron   =>  4 Triangles.
   * Triangle      =>  3 Line Segments.
   * Line Segment  =>  2 Points.
   * Point         =>  1 Empty Simplex.
   * Empty Simplex =>  Empty set.
   *
   * The initial mapping step in computing the boundary operation produces the type Simplex[][].
   * This is reduced, by concatenating elements, back to the type Simplex[].
   * 
   * times: The number of times to apply the boundary operation. Default is one (1).
   */
  public boundary(times?: number): Complex;
  /**
   * Updates the `meta` property by scanning the vertices.
   */
  public check(): Complex;
  /**
   * Subdivides the simplices of the geometry to produce finer detail.
   * times: The number of times to subdivide. Default is one (1).
   */
  public subdivide(times?: number): Complex;
  /**
   * Computes and returns the arrays used to draw in WebGL.
   */
  public toGeometry(): Geometry;
}

/**
 *
 */
 class Color
{
  public red: number;
  public green: number;
  public blue: number;
  public data: number[];
  public modified: boolean;
  constructor(data?: number[]);
  public static fromHSL(H: number, S: number, L: number): Color;
  public static fromRGB(red: number, green: number, blue: number): Color;
}

/**
 * A collection of WebGLProgram(s), one for each canvas in which the program is used.
 */
interface IMaterial extends IResource, UniformDataVisitor
{
  /**
   *
   */
  programId: string;
  /**
   *
   */
  vertexShader: string;
  /**
   *
   */
  fragmentShader: string;
  /**
   * Makes the program the current program for WebGL.
   * canvasId: Determines which WebGLProgram to use.
   */
  use(canvasId: number): void;
  /**
   * A map of attribute name to attribute location for active attributes.
   */
  attributes: { [name: string]: AttribLocation };
  /**
   * A map of uniform name to uniform location for active uniforms.
   */
  uniforms: { [name: string]: UniformLocation };
}

/**
 *
 */
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

/**
 * Creates and returns a Frustum.
 */
function createFrustum(left?: number, right?: number, bottom?: number, top?: number, near?: number, far?: number): Frustum;

/**
 * Computes a frustum matrix.
 */
function frustumMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number, matrix?: Float32Array): Float32Array;

/**
 * Creates and returns a Perspective.
 */
function createPerspective(options?: {fov?: number; aspect?: number; near?: number; far?: number; projectionMatrixName?: string; viewMatrixName?: string}): Perspective;

/**
 * Computes a perspective matrix.
 */
function perspectiveMatrix(fov: number, aspect: number, near: number, far: number, matrix?: Matrix4): Matrix4;

/**
 * Creates and returns a View.
 */
function createView(): View;

/**
 * Computes a view matrix.
 */
function viewMatrix(eye: Cartesian3, look: Cartesian3, up: Cartesian3, matrix?: Matrix4): Matrix4;

/**
 * Constructs a program from the specified vertex and fragment shader codes.
 */
function createMaterial(contexts: ContextMonitor[], vertexShader: string, fragmentShader: string, bindings?: string[]): IMaterial;

/**
 *
 */
interface AttribMetaInfo {
  /**
   * The type keyword as it appears in the GLSL shader program.
   * This property is used for program generation.
   */
  glslType: string,
}

/**
 *
 */
interface UniformMetaInfo {
  /**
   * Specifies an optional override of the name used as a key.
   */
  name?: string;
  /**
   * The type keyword as it appears in the GLSL shader program.
   */
  glslType: string;
}

/**
 * Constructs a program by introspecting a geometry.
 * monitors
 * attributes
 * uniformsList
 * bindings Used for setting indices.
 */
function smartProgram(monitors: ContextMonitor[], attributes: {[name:string]:AttribMetaInfo}, uniforms: {[name:string]:UniformMetaInfo}, bindings?: string[]): IMaterial;

/**
 *
 */
class Curve {
  constructor();
}

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
interface ContextMonitor {
  /**
   *
   */
  addContextListener(user: ContextListener): void;
  /**
   *
   */
  removeContextListener(user: ContextListener): void;
}

/**
 *
 */
interface ContextManager  extends ContextUnique, IUnknown
{
  createArrayBuffer(): IBuffer;
  createElementArrayBuffer(): IBuffer;
  createBufferGeometry(elements: GeometryData, mode?: number, usage?: number): IBufferGeometry;
  createTexture2D(): ITexture2D;
  createTextureCubeMap(): ITextureCubeMap;
  gl: WebGLRenderingContext;
  canvasElement: HTMLCanvasElement;
}

/**
 * Constructs and returns a ContextManager.
 * canvas: The HTML5 Canvas to be used for WebGL rendering.
 * canvasId: The optional user-defined integer identifier for the canvas. Default is zero (0).
 * attributes: Optional attributes for initializing the context.
 */
function webgl(canvas: HTMLCanvasElement, canvasId?: number, attributes?: WebGLContextAttributes): ContextManager;

/**
 *
 */
class Model implements UniformData {
  public position: Vector3;
  public attitude: Spinor3;
  public scale: Vector3;
  public color: Vector3;
  /**
   * Model implements UniformData required for manipulating a body.
   */ 
  constructor();
  setUniforms(visitor: UniformDataVisitor, canvasId: number): void;
}

/**
 * The publish date of the latest version of the library.
 */
var LAST_MODIFIED: string

/**
 * The version string of the davinci-eight module.
 */
var VERSION: string;

/**
 * Record reference count changes and debug reference counts.
 *
 * Instrumenting reference counting:
 *   constructor():
 *     refChange(uuid, 'YourClassName',+1);
 *   addRef():
 *     refChange(uuid, 'YourClassName',+1);
 *   release():
 *     refChange(uuid, 'YourClassName',-1);
 *
 * Debugging reference counts:
 *   Start tracking reference counts:
 *     refChange('start'[, 'where']);
 *     The system will record reference count changes.
 *   Stop tracking reference counts:
 *     refChange('stop'[, 'where']);
 *     The system will compute the total outstanding number of reference counts.
 *   Dump tracking reference counts:
 *     refChange('dump'[, 'where']);
 *     The system will log net reference count changes to the console.
 *   Don't track reference counts (default):
 *     refChange('reset'[, 'where']);
 *     The system will clear statistics and enter will not record changes.
 *   Trace reference counts for a particular class:
 *     refChange('trace', 'YourClassName');
 *     The system will report reference count changes on the specified class.
 *
 * Returns the number of outstanding reference counts for the 'stop' command.
 */
function refChange(uuid: string, name?: string, change?: number): number;

/**
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 */
class Symbolic {
  /**
   * 'aColor'
   */
  static ATTRIBUTE_COLOR: string;
  /**
   * 'aGeometryIndex'
   */
  static ATTRIBUTE_GEOMETRY_INDEX: string;
  /**
   * 'aNormal'
   */
  static ATTRIBUTE_NORMAL: string;
  /**
   * 'aPosition'
   */
  static ATTRIBUTE_POSITION: string;
  /**
   * 'aTextureCoords'
   */
  static ATTRIBUTE_TEXTURE_COORDS:string;

  static UNIFORM_AMBIENT_LIGHT: string;
  static UNIFORM_COLOR: string;
  static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string;
  static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string;
  static UNIFORM_POINT_LIGHT_COLOR: string;
  static UNIFORM_POINT_LIGHT_POSITION: string;
  static UNIFORM_PROJECTION_MATRIX: string;
  static UNIFORM_MODEL_MATRIX: string;
  static UNIFORM_NORMAL_MATRIX: string;
  static UNIFORM_VIEW_MATRIX: string;

  static VARYING_COLOR: string;
  static VARYING_LIGHT: string;
}
////////////////////////////////////////////////////////
// scene
///////////////////////////////////////////////////////

/**
 *
 */
interface ContextUnique {
  /**
   * The user-assigned unique identifier of a canvas.
   */
  canvasId: number;
}

/**
 *
 */
interface ContextController {
  start(canvas: HTMLCanvasElement, canvasId: number): void
  stop(): void;
  // TODO: kill
  // kill(): void;
}

/**
 *
 */
interface ContextKahuna extends ContextController, ContextManager, ContextMonitor, ContextUnique {

}

/**
 * The Drawable interface indicates that the implementation can make a call
 * to either drawArrays or drawElements on the WebGL rendering context.
 */
interface IDrawable extends IResource {
  /**
   *
   */
  material: IMaterial;
  /**
   * canvasId: Identifies the canvas on which to draw.
   */
  draw(canvasId: number): void;
}

/**
 *
 */
class Object3D {
  constructor();
}

/**
 *
 */
interface IDrawList extends ContextListener, IUnknown {
  add(drawable: IDrawable): void;
  draw(ambients: UniformData, canvasId: number): void;
  remove(drawable: IDrawable): void;
  traverse(callback: (drawable: IDrawable) => void, canvasId: number): void;
}

/**
 *
 */
class Scene implements IDrawList {
  constructor(monitors?: ContextMonitor[]);
  add(drawable: IDrawable): void;
  addRef(): number;
  contextFree(canvasId: number): void;
  contextGain(manager: ContextManager): void;
  contextLoss(canvasId: number): void;
  draw(ambients: UniformData, canvasId: number): void;
  release(): number;
  remove(drawable: IDrawable): void;
  traverse(callback: (drawable: IDrawable) => void, canvasId: number): void;
}

/**
 *
 */
interface ICamera extends IDrawable {
}

/**
 *
 */
class PerspectiveCamera implements ICamera, Perspective, UniformData {
  /**
   * The aspect ratio of the viewport, i.e., width / height.
   */
  aspect: number;
  /**
   * The position of the camera.
   */
  eye: Vector3;
  /**
   * The distance to the far plane of the viewport.
   */
  far: number;
  /**
   * The field of view is the angle in the camera horizontal plane that the viewport subtends at the camera.
   * The field of view is measured in radians.
   */
  fov: number;
  /**
   * The point (position vector) that the camera looks at.
   */
  look: Vector3;
  /**
   *The distance to the near plane of the viewport.
   */
  near: number;
  /**
   *
   */
  position: Vector3;
  /**
   * Optional material used for rendering this instance.
   */
  material: IMaterial;
  /**
   * The "guess" direction that is used to generate the upwards direction for the camera. 
   */
  up: Vector3
  /**
   * fov...: The `fov` property.
   * aspect: The `aspect` property.
   * near..: The `near` property.
   * far...: The `far` property.
   */
  constructor(fov?: number, aspect?: number, near?: number, far?: number)
  addRef(): number
  contextFree(canvasId: number): void
  contextGain(manager: ContextManager): void
  contextLoss(canvasId: number): void
  draw(canvasId: number): void
  setAspect(aspect: number): PerspectiveCamera
  setEye(eye: Cartesian3): PerspectiveCamera
  setFar(far: number): PerspectiveCamera
  setFov(fov: number): PerspectiveCamera
  setLook(look: Cartesian3): PerspectiveCamera
  setNear(near: number): PerspectiveCamera
  setUp(up: Cartesian3): PerspectiveCamera
  /**
   * sets the uniform values from this instance into the WebGLProgram(s) defined by the arguments.
   * visitor.: The visitor which is receiving the uniform values.
   * canvasId: The identifier of the canvas.
   */
  setUniforms(visitor: UniformDataVisitor, canvasId: number): void
  release(): number
}

/**
 *
 */
interface IPrologCommand extends IUnknown {
  name: string;
  execute(manager: ContextManager): void;
}

/**
 *
 */
interface ContextRenderer extends ContextListener, IUnknown {
  /**
   * Determines whether prolog commands are run automatically as part of the render() call.
   * It may be useful to manually exceute the prolog commands if you want to render
   * multiple times within the animation loop without e.g., clearing the color and depth buffers.
   */
  autoProlog: boolean;
  /**
   * Execute the commands in the prolog list.
   */
  prolog(): void;
  /**
   * Pushes a command onto the list of commands to be executed by the `prolog()` method.
   * command: The command to execute.
   */
  addPrologCommand(command: IPrologCommand): void;
  /**
   * Pushes a command onto the list of commands to be executed on contextGain.
   * command: The command to execute.
   */
  addContextGainCommand(command: IContextCommand): void;
  /**
   * The (readonly) cached WebGL rendering context. The context may sometimes be undefined.
   */
  gl: WebGLRenderingContext;
}

/**
 *
 */
class Canvas3D implements ContextController, ContextMonitor, ContextRenderer {
  /**
   * <p>
   * Determines whether prolog commands are run automatically as part of the render() call.
   * It may be useful to manually exceute the prolog commands if you want to render
   * multiple times within the animation loop without e.g., clearing the color and depth buffers.
   * The deafault is <code>true</code>
   * </p>
   */
  autoProlog: boolean;
  canvasId: number;
  gl: WebGLRenderingContext;
  /**
   * If the canvasElement property has not been initialized by calling `start()`,
   * then any attempt to access this property will trigger the construction of
   * a new HTML canvas element which will remain in effect for this Canvas3D
   * until `stop()` is called.
   */
  canvasElement: HTMLCanvasElement;
  constructor(attributes?: WebGLContextAttributes);
  addContextListener(user: ContextListener): void;
  addRef(): number;
  contextFree(canvasId: number): void;
  contextGain(manager: ContextManager): void;
  contextLoss(canvasId: number): void;
  createArrayBuffer(): IBuffer;
  createBufferGeometry(elements: GeometryData, mode?: number, usage?: number): IBufferGeometry;
  createElementArrayBuffer(): IBuffer;
  createTexture2D(): ITexture2D;
  createTextureCubeMap(): ITextureCubeMap;
  /**
   * Executes commands in the prolog list. e.g., 
   */
  prolog(): void;
  addPrologCommand(command: IPrologCommand): void;
  addContextGainCommand(command: IContextCommand): void;
  release(): number;
  removeContextListener(user: ContextListener): void;
  setSize(width: number, height: number): void;
  start(canvas: HTMLCanvasElement, canvasId: number): void;
  stop(): void;
}

/**
 *
 */
class CuboidComplex extends Complex {
  /**
   * width: The side length in the x-axis direction.
   * height: The side length in the y-axis direction.
   * depth: The side length in the z-axis direction.
   * widthSegments: The number of line segments in the x-axis direction.
   * heightSegments: The number of line segments in the y-axis direction.
   * depthSegments: The number of line segments in the z-axis direction.
   * wireFrame: Determines whether the geometry computes line segments or triangles.
   */
  constructor(width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number, wireFrame?: boolean);
}

/**
 *
 */
class CuboidGeometry extends Geometry {
  x: number;
  y: number;
  z: number;
  xSegments: number;
  ySegments: number;
  zSegments: number;
  lines: boolean;
  constructor(width?: number, height?: number, depth?: number);
  /**
   * calculates the geometry from the current state of parameters.
   */
  calculate(): void;
}
/**
 *
 */
class Material implements IMaterial {
  program: WebGLProgram;
  programId: string;
  vertexShader: string;
  fragmentShader: string;
  attributes: { [name: string]: AttribLocation };
  uniforms: { [name: string]: UniformLocation };
  constructor(monitors: ContextMonitor[], name: string);
  addRef(): number;
  release(): number;
  use(canvasId: number): void;
  enableAttrib(name: string): void;
  disableAttrib(name: string): void;
  contextFree(canvasId: number): void;
  contextGain(manager: ContextManager): void;
  contextLoss(canvasId: number): void;
  uniform1f(name: string, x: number): void;
  uniform2f(name: string, x: number, y: number): void;
  uniform3f(name: string, x: number, y: number, z: number): void;
  uniform4f(name: string, x: number, y: number, z: number, w: number): void;
  uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1): void;
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2): void;
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3): void;
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4): void;
  uniformVector1(name: string, vector: Vector1): void;
  uniformVector2(name: string, vector: Vector2): void;
  uniformVector3(name: string, vector: Vector3): void;
  uniformVector4(name: string, vector: Vector4): void;
}

/**
 * <p>
 * A geometry holds the instructions for rendering a 3D mesh. (d.ts)
 * </p>
 */
class Geometry {
  /**
   *
   */
  public data: GeometryData;
  /**
   *
   */
  public meta: GeometryMeta;
  /**
   * data:
   * meta:
   */
  constructor(data: GeometryData, meta: GeometryMeta);
}

/**
 *
 */
class Mesh<G extends Geometry, M extends IMaterial, U extends UniformData> implements IDrawable {
  geometry: G;
  material: M;
  model: U;
  constructor(geometry: G, material: M, model: U);
  addRef(): number;
  release(): number;
  draw(canvasId: number): void;
  contextFree(): void;
  contextGain(manager: ContextManager): void;
  contextLoss(): void;
}

/**
 *
 */
class HTMLScriptsMaterial extends Material {
  /**
   * contexts:  The contexts that this material must support.
   * scriptIds: The id properties of the script elements. Defaults to [].
   * dom:       The document object model. Defaults to document.
   */
  constructor(contexts: ContextMonitor[], scriptIds?: string[], dom?: Document);
}

/**
 *
 */
interface MeshNormalMaterialParameters {

}

class MeshNormalMaterial extends Material {
  constructor(contexts?: ContextMonitor[], parameters?: MeshNormalMaterialParameters);
}

class SmartMaterialBuilder {
  constructor(geometry?: Geometry);
  public attribute(key: string, size: number, name?: string): SmartMaterialBuilder;
  public uniform(key: string, type: string, name?: string): SmartMaterialBuilder;
  public build(contexts: ContextMonitor[]): Material;
}

// FIXME SineUniformsSetter
class SineWaveUniform extends Shareable implements UniformData {
  public amplitude: number;
  public omega: number;
  public mean: number;
  public uName: string;
  constructor(omega: number, uName?: string);
  setUniforms(visitor: UniformDataVisitor, canvasId: number): void;
}

class EulerModel implements UniformData {
  rotation: Vector3;
  constructor()
  setUniforms(visitor: UniformDataVisitor, canvasId: number): void
}

interface IRigidBody3 extends IUnknown {
  position: Vector3;
  attitude: Spinor3;
}

/**
 * A model for a rigid body in 3-dimensional space.
 * This class may be used concretely or extended.
 */
class RigidBody3 extends Shareable implements IRigidBody3 {
  /**
   * The position vector of the rigid body.
   */
  public position: Vector3;
  /**
   * The attitude spinor of the rigid body.
   */
  public attitude: Spinor3;
  /**
   * The `attitude` is initialized to the default for `Spinor3`.
   * The `position` is initialized to the default for `Vector3`.
   * This class assumes that it is being used concretely if the type is 'RigidBody3'.
   * type: The class name of the derived class. Defaults to 'RigidBody3'.
   */
  constructor(type?: string)
}


class RoundUniform implements UniformDataVisitor {
  next: UniformDataVisitor;
  constructor();
  uniform1f(name: string, x: number);
  uniform2f(name: string, x: number, y: number);
  uniform3f(name: string, x: number, y: number, z: number);
  uniform4f(name: string, x: number, y: number, z: number, w: number);
  uniformMatrix1(name: string, transpose: boolean, matrix: Matrix1);
  uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2);
  uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3);
  uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4);
  uniformVector1(name: string, vector: Vector1);
  uniformVector2(name: string, vector: Vector2);
  uniformVector3(name: string, vector: Vector3);
  uniformVector4(name: string, vector: Vector4);
}

// commands

interface IContextCommand extends IUnknown {
  name: string;
  execute(gl: WebGLRenderingContext): void;
}

/**
 * clear(mask: number): void
 */
class WebGLClear extends Shareable implements IContextCommand {
  public mask: number;
  public name: string;
  /**
   *
   */
  constructor(mask?: number);
  /**
   *
   */
  execute(gl: WebGLRenderingContext): void;
  /**
   *
   */
  destructor(): void;
}

/**
 * `clearColor(red: number, green: number, blue: number, alpha: number): void`
 */
class WebGLClearColor extends Shareable implements IContextCommand, ContextListener {
  red: number;
  green: number;
  blue: number;
  alpha: number;
  name: string;
  constructor(red?: number, green?: number, blue?: number, alpha?: number);
  /**
   * canvasId
   */
  contextFree(canvasId: number): void;
  /**
   * manager
   */
  contextGain(manager: ContextManager): void;
  /**
   * canvasId
   */
  contextLoss(canvasId: number): void;
  /**
   * Executes the gl.clearColor command using the instance properties for red, green ,blue and alpha. 
   * gl The WebGL rendering context.
   */
  execute(gl: WebGLRenderingContext): void;
}

/**
 * `enable(capability: number): void`
 */
class WebGLEnable extends Shareable implements IContextCommand, ContextListener {
  public capability: number;
  public name: string;
  /**
   *
   */
  constructor(capability: number);
  /**
   *
   */
  contextFree(canvasId: number): void;
  /**
   *
   */
  contextGain(manager: ContextManager): void;
  /**
   *
   */
  contextLoss(canvasId: number): void;
  /**
   *
   */
  execute(gl: WebGLRenderingContext): void;
  /**
   *
   */
  destructor(): void;
}

}

declare module 'eight'
{
  export = EIGHT;
}
