//
// davinci-eight.d.ts
//
// This file was created manually in order to support the davinci-eight library.
// These declarations are appropriate when using the library through the global
// variable, 'EIGHT'.
//
/**
 * WebGL library for mathematical physics using Geometric Algebra.
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

    interface IUnknownExt<T extends IUnknown> extends IUnknown {
        incRef(): T;
        decRef(): T;
    }

    class IUnknownArray<T extends IUnknown> extends Shareable {
        public length: number;
        /**
         * Collection class for maintaining an array of types derived from IUnknown.
         * Provides a safer way to maintain reference counts than a native array.
         */
        constructor(elements?: T[]);
        destructor(): void;
        get(index: number): T;
        /**
         * Gets the element at the specified index without incrementing the reference count.
         * Use this method when you don't intend to hold onto the returned value.
         */
        getWeakRef(index: number): T;
        indexOf(searchElement: T, fromIndex?: number): number;
        slice(begin?: number, end?: number): IUnknownArray<T>;
        splice(index: number, deleteCount: number): IUnknownArray<T>;
        forEach(callback: (value: T, index: number) => void): void;
        push(element: T): number;
        /**
         * Pushes an element onto the tail of the list without incrementing the element reference count.
         */
        pushWeakRef(element: T): number;
        pop(): T;
        shift(): T;
    }

    class NumberIUnknownMap<V extends IUnknown> extends Shareable {
        keys: number[];
        constructor()
        destructor(): void
        exists(key: number): boolean
        get(key: number): V
        getWeakRef(key: number): V
        put(key: number, value: V): void
        putWeakRef(key: number, value: V): void
        forEach(callback: (key: number, value: V) => void)
        remove(key: number): void
    }

    class StringIUnknownMap<V extends IUnknown> extends Shareable {
        keys: string[];
        constructor()
        destructor(): void
        exists(key: string): boolean
        get(key: string): V
        put(key: string, value: V): void
        forEach(callback: (key: string, value: V) => void)
        remove(key: string): void
    }

    /**
     * Convenience base class for classe s requiring reference  counting.
     * 
     * Derived classes should implement the method destructor(): void.
     */
    class Shareable implements IUnknown {
        /**
         * Unique identifier for this instance.
         */
        uuid: string;
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
    interface IContextConsumer extends IUnknown {
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
        contextGain(manager: IContextProvider): void;
        /**
         * Called to inform the dependent of a loss of WebGL rendering context.
         * The dependent must assume that any cached context is invalid.
         * The dependent must not try to use and cached context to free resources.
         * The dependent should reset its state to that for which there is no context.
         * canvasId: Determines the context for which resources are being lost.
         */
        contextLost(canvasId: number): void;
    }

    /**
     *
     */
    interface IResource extends IUnknown, IContextConsumer {

    }

    /**
     *
     */
    interface IBufferGeometry extends IUnknown {
        uuid: string;
        bind(program: IMaterial, aNameToKeyName?: { [name: string]: string }): void;
        draw(): void;
        unbind(): void;
    }

    /**
     *
     */
    class DrawPrimitive {
        public k: number;
        public indices: VectorN<number>;
        public attributes: { [name: string]: DrawAttribute };
        constructor(k: number, indices: VectorN<number>, attributes: { [name: string]: DrawAttribute });
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
        public static EMPTY: number;
        /**
         * A single point may be considered a 0-simplex.
         */
        public static POINT: number;
        /**
         * A line segment may be considered a 1-simplex.
         */
        public static LINE: number;
        /**
         * A 2-simplex is a triangle.
         */
        public static TRIANGLE: number;
        /**
         * A 3-simplex is a tetrahedron.
         */
        public static TETRAHEDRON: number;
        /**
         * A 4-simplex is a 5-cell.
         */
        public static FIVE_CELL: number;
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
     * When used with toDrawPrimitive(), allows names and sizes to be mapped.
     */
    function simplicesToGeometryMeta(geometry: Simplex[]): GeometryMeta;

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
     * geometry to DrawPrimitive conversion.
     */
    function simplicesToDrawPrimitive(simplices: Simplex[], geometryMeta?: GeometryMeta): DrawPrimitive;

    /**
     *
     */
    interface IContextProgramConsumer {
        contextFree(): void;
        contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
        contextLost(): void;
    }

    /**
     * Manages the lifecycle of an attribute used in a vertex shader.
     */
    class AttribLocation implements IContextProgramConsumer {
        index: number;
        constructor(name: string, size: number, type: number);
        contextFree(): void;
        contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
        contextLost(): void;
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
    class UniformLocation implements IContextProgramConsumer {
        constructor(monitor: IContextProvider, name: string);
        contextFree(): void;
        contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
        contextLost(): void;
        uniform1f(x: number): void;
        uniform2f(x: number, y: number): void;
        uniform3f(x: number, y: number, z: number): void;
        uniform4f(x: number, y: number, z: number, w: number): void;
        matrix1(transpose: boolean, matrix: MutableNumber): void;
        matrix2(transpose: boolean, matrix: Matrix2): void;
        matrix3(transpose: boolean, matrix: Matrix3): void;
        matrix4(transpose: boolean, matrix: Matrix4): void;
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
    interface LinearElement<I, M, S, V> {
        add(rhs: I, alpha?: number): M;
        clone(): M;
        copy(source: I): M;
        difference(a: I, b: I): M;
        divideScalar(scalar: number): M;
        lerp(target: I, alpha: number): M;
        scale(scalar: number): M;
        reflect(vector: V): M;
        rotate(rotor: S): M;
        sub(rhs: I): M;
        sum(a: I, b: I): M;
    }

    /**
     *
     */
    interface GeometricElement<I, M, S, V, D> extends LinearElement<I, M, S, V> {
        exp(): M;
        dual(m: D): M;
        log(): M;
        magnitude(): number;
        multiply(element: I): M;
        product(a: I, b: I): M;
        quaditude(): number;
    }

    /**
     * A rational number.
     */
    class Rational {
        numer: number;
        denom: number;
    }

    /**
     * The dimensions of a physical quantity.
     */
    class Dimensions {
        M: Rational;
        L: Rational;
        T: Rational;
        Q: Rational;
        temperature: Rational;
        amount: Rational;
        intensity: Rational;
    }

    /**
     * The uinit of measure for a physical quantity.
     */
    class Unit {
        scale: number;
        dimensions: Dimensions;
    }

    /**
     * A measure with an optional unit of measure.
     */
    class Euclidean3 implements Cartesian3, Spinor3Coords {
        w: number;
        x: number;
        y: number;
        z: number;
        yz: number;
        zx: number;
        xy: number;
        xyz: number;
        uom: Unit;
        static zero: Euclidean3;
        static one: Euclidean3;
        static e1: Euclidean3;
        static e2: Euclidean3;
        static e3: Euclidean3;
        static kilogram: Euclidean3;
        static meter: Euclidean3;
        static second: Euclidean3;
        static coulomb: Euclidean3;
        static ampere: Euclidean3;
        static kelvin: Euclidean3;
        static mole: Euclidean3;
        static candela: Euclidean3;
        toFixed(digits?: number): string
        toString(): string
    }

    /**
     *
     */
    class AbstractMatrix implements Mutable<Float32Array> {
        public data: Float32Array;
        public dimensions: number;
        public callback: () => Float32Array;
        public modified: boolean;
        constructor(data: Float32Array, dimensions: number);
    }

    /**
     *
     */
    class MutableNumber extends AbstractMatrix {
        constructor(data: Float32Array);
    }

    /**
     *
     */
    class Matrix2 extends AbstractMatrix {
        constructor(data: Float32Array);
    }

    /**
     *
     */
    class Matrix3 extends AbstractMatrix {
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
    class Matrix4 extends AbstractMatrix {
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
        clone(): Matrix4;
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
        rotate(spinor: Spinor3Coords): Matrix4;
        rotation(spinor: Spinor3Coords): Matrix4;
        scale(scale: Cartesian3): Matrix4;
        scaling(scale: Cartesian3): Matrix4;
        translate(displacement: Cartesian3): Matrix4;
        translation(displacement: Cartesian3): Matrix4;
        transpose(): Matrix4;
        frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
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
    class MutableNumber extends VectorN<number> implements Cartesian1 {
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
        scale(s: number): Vector2;
        quaditude(): number;
        set(x: number, y: number): Vector2;
        sub(v: Cartesian2): Vector2;
        difference(a: Cartesian2, b: Cartesian2): Vector2;
    }

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
    class Spinor3 extends VectorN<number> implements Spinor3Coords, GeometricElement<Spinor3Coords, Spinor3, Spinor3Coords, Cartesian3, Cartesian3> {
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
        dual(vector: Cartesian3): Spinor3;
        exp(): Spinor3;
        inverse(): Spinor3;
        lerp(target: Spinor3Coords, alpha: number): Spinor3;
        log(): Spinor3;
        magnitude(): number;
        multiply(rhs: Spinor3Coords): Spinor3;
        scale(scalar: number): Spinor3;
        /**
         * Sets this Spinor3 to the geometric product of the vectors a and b, a * b.
         */
        product(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
        quaditude(): number;
        reverse(): Spinor3;
        reflect(n: Cartesian3): Spinor3;
        rotate(rotor: Spinor3Coords): Spinor3;
        /**
         * Sets this Spinor3 to the rotor corresponding to a rotation from vector a to vector b.
         */
        rotor(b: Cartesian3, a: Cartesian3): Spinor3;
        sub(rhs: Spinor3Coords): Spinor3;
        sum(a: Spinor3Coords, b: Spinor3Coords): Spinor3;
        toString(): string;
        /**
         * Sets this Spinor3 to the geometric product of the vectors a and b, a * b.
         */
        spinor(a: Cartesian3, b: Cartesian3): Spinor3;
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
    class Vector3 extends VectorN<number> implements Cartesian3, LinearElement<Cartesian3, Vector3, Spinor3Coords, Vector3> {
        x: number;
        y: number;
        z: number;
        static e1: Vector3;
        static e2: Vector3;
        static e3: Vector3;
        static copy(vector: Cartesian3): Vector3;
        constructor(data?: number[], modified?: boolean);
        /**
         * this += alpha * vector
         */
        add(vector: Cartesian3, alpha?: number): Vector3;
        clone(): Vector3;
        copy(v: Cartesian3): Vector3;
        cross(v: Cartesian3): Vector3;
        crossVectors(a: Cartesian3, b: Cartesian3): Vector3;
        difference(a: Cartesian3, b: Cartesian3): Vector3;
        distanceTo(position: Cartesian3): number;
        divideScalar(rhs: number): Vector3;
        magnitude(): number;
        lerp(target: Cartesian3, alpha: number): Vector3;
        scale(rhs: number): Vector3;
        normalize(): Vector3;
        quaditude(): number;
        quadranceTo(position: Cartesian3): number;
        reflect(n: Cartesian3): Vector3;
        rotate(rotor: Spinor3Coords): Vector3;
        set(x: number, y: number, z: number): Vector3;
        setMagnitude(magnitude: number): Vector3;
        sub(rhs: Cartesian3): Vector3;
        sum(a: Cartesian3, b: Cartesian3): Vector3;
        static copy(vector: Cartesian3): Vector3;
        static lerp(a: Cartesian3, b: Cartesian3, alpha: number): Vector3;
        static random(): Vector3;
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
    interface IFacetVisitor {
        uniform1f(name: string, x: number, canvasId: number): void;
        uniform2f(name: string, x: number, y: number, canvasId: number): void;
        uniform3f(name: string, x: number, y: number, z: number, canvasId: number): void;
        uniform4f(name: string, x: number, y: number, z: number, w: number, canvasId: number): void;
        uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2, canvasId: number): void;
        uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3, canvasId: number): void;
        uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4, canvasId: number): void;
        uniformCartesian2(name: string, vector: Vector2, canvasId: number): void;
        uniformCartesian3(name: string, vector: Vector3, canvasId: number): void;
        uniformCartesian4(name: string, vector: Vector4, canvasId: number): void;
        vector2(name: string, data: number[], canvasId: number): void;
        vector3(name: string, data: number[], canvasId: number): void;
        vector4(name: string, data: number[], canvasId: number): void;
    }

    /**
     *
     */
    interface IFacet extends IAnimationTarget {
        setUniforms(visitor: IFacetVisitor, canvasId): void;
    }

    /**
     * Provides the uniform for the model to view coordinates transformation.
     */
    interface View extends IFacet {
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
    class Sphere {
        public center: Cartesian3;
        public radius: number;
        constructor(center?: Cartesian3, radius?: number);
        setFromPoints(points: Cartesian3[]);
    }
    /**
     *
     */
    interface IGeometry {
      regenerate(): void;
      toPrimitives(): DrawPrimitive[];
    }
    /**
     * A geometry holds a list of simplices.
     */
    class SimplexGeometry extends Shareable implements IGeometry {
        /**
         * The geometry as a list of simplices. These may be triangles, lines or points.
         */
        public data: Simplex[];
        /**
         * Summary information on the simplices such as dimensionality and sizes for attributes.
         * This same data structure may be used to map vertex attribute names to program names.
         */
        public meta: GeometryMeta;
        /**
         * The dimesionality of the simplices to be generated.
         */
        k: number;
        /**
         *
         */
        curvedSegments: number;
        /**
         *
         */
        flatSegments: number;
        /**
         *
         */
        orientationColors: boolean;
        /**
         *
         */
        constructor(type?: string);
        destructor(): void;
        regenerate(): void;
        isModified(): boolean;
        setModified(modified): SimplexGeometry;
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
        public boundary(times?: number): SimplexGeometry;
        /**
         * Updates the `meta` property by scanning the vertices.
         */
        public check(): SimplexGeometry;
        /**
         * Subdivides the simplices of the geometry to produce finer detail.
         * times: The number of times to subdivide. Default is one (1).
         */
        public subdivide(times?: number): SimplexGeometry;
        /**
         * Computes and returns the primitives used to draw in WebGL.
         */
        public toPrimitives(): DrawPrimitive[];
    }

    /**
     *
     */
    interface ColorRGB {
        red: number;
        green: number;
        blue: number;
    }

    /**
     *
     */
    class Color implements ColorRGB {
        public static black: Color;
        public static blue: Color;
        public static green: Color;
        public static cyan: Color;
        public static red: Color;
        public static magenta: Color;
        public static yellow: Color;
        public static white: Color;
        public red: number;
        public green: number;
        public blue: number;
        public luminance: number;
        public data: number[];
        public modified: boolean;
        constructor(data?: number[]);
        clone(): Color;
        public interpolate(target: ColorRGB, alpha: number): Color;
        public static fromHSL(H: number, S: number, L: number): Color;
        public static fromRGB(red: number, green: number, blue: number): Color;
        public static copy(color: ColorRGB): Color;
        public static interpolate(a: ColorRGB, b: ColorRGB, alpha: number): Color;
    }

    /**
     * A collection of WebGLProgram(s), one for each canvas in which the program is used.
     */
    interface IMaterial extends IResource, IFacetVisitor {
        programId: string;
        vertexShader: string;
        fragmentShader: string;
        use(canvasId: number): void;
        attributes(canvasId: number): { [name: string]: AttribLocation };
        uniforms(canvasId: number): { [name: string]: UniformLocation };
        enableAttrib(name: string, canvasId: number): void;
        disableAttrib(name: string, canvasId: number): void;
    }

    /**
     *
     */
    interface WindowAnimationRunner {
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
    function createPerspective(options?: { fov?: number; aspect?: number; near?: number; far?: number; projectionMatrixName?: string; viewMatrixName?: string }): Perspective;

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
    function createMaterial(contexts: IContextMonitor[], vertexShader: string, fragmentShader: string, bindings?: string[]): IMaterial;

    /**
     *
     */
    interface AttribMetaInfo {
        /**
         * The type keyword as it appears in the GLSL shader program.
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
    function smartProgram(monitors: IContextMonitor[], attributes: { [name: string]: AttribMetaInfo }, uniforms: { [name: string]: UniformMetaInfo }, bindings?: string[]): IMaterial;

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
        animate: { (time: number): void; },
        options?: {
            setUp?: () => void;
            tearDown?: { (animateException): void; };
            terminate?: (time: number) => boolean;
            window?: Window
        }): WindowAnimationRunner;

    /**
     *
     */
    interface IContextMonitor {
        /**
         *
         */
        addContextListener(user: IContextConsumer): void;
        /**
         *
         */
        removeContextListener(user: IContextConsumer): void;
        /**
         *
         */
        synchronize(user: IContextConsumer): void;
    }

    /**
     *
     */
    interface IContextProvider extends ContextUnique, IUnknown {
        createArrayBuffer(): IBuffer;
        createElementArrayBuffer(): IBuffer;
        createBufferGeometry(primitive: DrawPrimitive, usage?: number): IBufferGeometry;
        createTexture2D(): ITexture2D;
        createTextureCubeMap(): ITextureCubeMap;
        gl: WebGLRenderingContext;
        canvas: HTMLCanvasElement;
    }

    /**
     * Constructs and returns a IContextProvider.
     * canvas: The HTML5 Canvas to be used for WebGL rendering.
     * canvasId: The optional user-defined integer identifier for the canvas. Default is zero (0).
     * attributes: Optional attributes for initializing the context.
     */
    function webgl(canvas: HTMLCanvasElement, canvasId?: number, attributes?: WebGLContextAttributes): IContextProvider;

    /**
     * IFacet required for manipulating a rigid body.
     */
    class ModelFacet extends Shareable implements IFacet, IAnimationTarget, IUnknownExt<ModelFacet> {
        public position: Vector3;
        public attitude: Spinor3;
        public scaleXYZ: Vector3;
        /**
         * Model implements IFacet required for manipulating a body.
        */
        constructor();
        incRef(): ModelFacet;
        decRef(): ModelFacet;
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): void;
        setUniforms(visitor: IFacetVisitor, canvasId: number): void;
    }

    /**
     * The publish date of the latest version of the library.
     */
    var LAST_MODIFIED: string

    /**
     * Deterimies whether the library strictly inforces invariants.
     * This may have a performance penalty.
     */
    var strict: boolean;

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
        static ATTRIBUTE_TEXTURE_COORDS: string;

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
    interface ContextKahuna extends ContextController, IContextProvider, IContextMonitor, ContextUnique {

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
         * User assigned name of the drawable object. Allows an object to be found in a scene.
         * @property name
         * @type [string]
         */
        name: string;
        /**
         * canvasId: Identifies the canvas on which to draw.
         */
        draw(canvasId: number): void;
        getFacet(name: string): IFacet;
        setFacet<T extends IFacet>(name: string, value: T): T;
    }

    /**
     *
     */
    interface IDrawList extends IContextConsumer, IUnknown {
        add(drawable: IDrawable): void;
        draw(ambients: IFacet[], canvasId: number): void;
        /**
         * Gets a collection of drawable elements by name.
         * @method getDrawablesByName
         * @param name {string}
         */
        getDrawablesByName(name: string): IUnknownArray<IDrawable>;

        remove(drawable: IDrawable): void;
        traverse(callback: (drawable: IDrawable) => void, canvasId: number): void;
    }
    /**
     *
     */
    class Scene implements IDrawList {
        constructor(monitors?: IContextMonitor[])
        add(drawable: IDrawable): void
        addRef(): number
        contextFree(canvasId: number): void
        contextGain(manager: IContextProvider): void
        contextLost(canvasId: number): void
        draw(ambients: IFacet[], canvasId: number): void
        getDrawablesByName(name: string): IUnknownArray<IDrawable>
        release(): number
        remove(drawable: IDrawable): void
        traverse(callback: (drawable: IDrawable) => void, canvasId: number): void
    }

    /**
     *
     */
    class PerspectiveCamera extends AbstractFacet implements Perspective {
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
         * Optional name used for finding this instance.
         */
        name: string;
        /**
         * The "guess" direction that is used to generate the upwards direction for the camera. 
         */
        up: Vector3;
        /**
         * fov...: The `fov` property.
         * aspect: The `aspect` property.
         * near..: The `near` property.
         * far...: The `far` property.
         */
        constructor(fov?: number, aspect?: number, near?: number, far?: number);
        addRef(): number;
        contextFree(canvasId: number): void;
        contextGain(manager: IContextProvider): void;
        contextLost(canvasId: number): void;
        draw(canvasId: number): void;
        /**
         *
         */
        set(data: { [key: string]: any }, ignore?: boolean): void;
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
        setUniforms(visitor: IFacetVisitor, canvasId: number): void
        release(): number
    }

    /**
     *
     */
    interface IContextRenderer extends IContextConsumer, IUnknown {
        /**
         * The (readonly) cached WebGL rendering context. The context may sometimes be undefined.
         */
        gl: WebGLRenderingContext;
        /**
         * @property canvas
         * @type {HTMLCanvasElement}
         * @readOnly
         */
        canvas: HTMLCanvasElement;
        /**
         * Commands that are executed for context free, gain and loss events.
         * These commands are reference counted but don't hold references to this instance.
         */
        commands: IUnknownArray<IContextCommand>;
    }

    /**
     *
     */
    class Canvas3D implements ContextController, IContextMonitor, IContextRenderer {
        /**
         *
         */
        canvasId: number;
        /**
         *
         */
        gl: WebGLRenderingContext;
        /**
         * If the canvas property has not been initialized by calling `start()`,
         * then any attempt to access this property will trigger the construction of
         * a new HTML canvas element which will remain in effect for this Canvas3D
         * until `stop()` is called.
         */
        canvas: HTMLCanvasElement;
        /**
         *
         */
        commands: IUnknownArray<IContextCommand>;
        constructor(attributes?: WebGLContextAttributes);
        addContextListener(user: IContextConsumer): void;
        addRef(): number;
        contextFree(canvasId: number): void;
        contextGain(manager: IContextProvider): void;
        contextLost(canvasId: number): void;
        createArrayBuffer(): IBuffer;
        createBufferGeometry(primitive: DrawPrimitive, usage?: number): IBufferGeometry;
        createElementArrayBuffer(): IBuffer;
        createTexture2D(): ITexture2D;
        createTextureCubeMap(): ITextureCubeMap;
        release(): number;
        removeContextListener(user: IContextConsumer): void;
        /**
         *
         */
        synchronize(user: IContextConsumer): void;
        setSize(width: number, height: number): void;
        start(canvas: HTMLCanvasElement, canvasId: number): void;
        stop(): void;
    }

    class AxialSimplexGeometry extends SimplexGeometry {
        axis: Vector3;
        constructor(axis: Cartesian3, type: string)
    }

    class SliceSimplexGeometry extends AxialSimplexGeometry {
        constructor(axis: Cartesian3, type: string)
    }

    class ArrowSimplexGeometry extends SimplexGeometry {
        vector: Vector3;
        constructor(type?: string)
    }

    class VortexSimplexGeometry extends SimplexGeometry {
        generator: Spinor3;
        constructor(type?: string)
    }

    /**
     *
     */
    class RingSimplexGeometry extends SliceSimplexGeometry {
        innerRadius: number;
        outerRadius: number;
        axis: Vector3;
        start: Vector3;
        radialSegments: number;
        thetaSegments: number;
        constructor(innerRadius?: number, outerRadius?: number, axis?: Cartesian3, start?: Cartesian3);
    }

    /**
     *
     */
    class BarnSimplexGeometry extends SimplexGeometry {
        a: Vector3;
        b: Vector3;
        c: Vector3;
        k: number;
        constructor(type?: string);
    }

    /**
     *
     */
    class ConeGeometry implements IGeometry {
        public radius: number;
        public height: number;
        public axis: Vector3;
        constructor(radius: number, height: number, axis: Cartesian3);
        regenerate(): void
        toPrimitives(): DrawPrimitive[]
    }

    /**
     *
     */
    class ConeSimplexGeometry extends SliceSimplexGeometry {
        public radiusTop: number;
        public radius: number;
        public height: number;
        public openTop: boolean;
        public openBottom: boolean;
        public thetaStart: number;
        public thetaLength: number;
        constructor(
            radius: number,
            height: number,
            axis: Cartesian3,
            radiusTop?: number,
            openTop?: boolean,
            openBottom?: boolean,
            thetaStart?: number,
            thetaLength?: number);
    }
    /**
     *
     */
    class CuboidGeometry implements IGeometry {
        constructor();
        regenerate(): void;
        toPrimitives(): DrawPrimitive[];
    }
    /**
     *
     */
    class CuboidSimplexGeometry extends SimplexGeometry {
        a: Vector3;
        b: Vector3;
        c: Vector3;
        k: number;
        constructor(a?: Cartesian3, b?: Cartesian3, c?: Cartesian3, k?: number, subdivide?: number, boundary?: number);
    }

    class CylinderSimplexGeometry extends SliceSimplexGeometry {
        radius: number;
        height: number;
        start: Vector3;
        openTop: boolean;
        openBottom: boolean;
        constructor(
            radius?: number,
            height?: number,
            axis?: Cartesian3,
            start?: Cartesian3,
            openTop?: boolean,
            openBottom?: boolean
        )
    }

    class DodecahedronSimplexGeometry extends PolyhedronSimplexGeometry {
        constructor(radius?: number, detail?: number);
    }

    class OctahedronSimplexGeometry extends PolyhedronSimplexGeometry {
        constructor(radius?: number, detail?: number);
    }

    class IcosahedronSimplexGeometry extends PolyhedronSimplexGeometry {
        constructor(radius?: number, detail?: number);
    }

    class PolyhedronSimplexGeometry extends SimplexGeometry {
        constructor(vertices: number[], indices: number[], radius?: number, detail?: number);
    }

    class RevolutionSimplexGeometry extends SimplexGeometry {
        constructor(points: Vector3[], generator: Spinor3, segments: number, phiStart: number, phiLength: number, attitude: Spinor3)
    }

    class Simplex1Geometry extends SimplexGeometry {
        head: Vector3;
        tail: Vector3;
        constructor();
        calculate(): void;
    }

    /**
     *
     */
    class SphericalPolarSimplexGeometry extends SliceSimplexGeometry {
        radius: number;
        phiLength: number;
        phiStart: Vector3;
        thetaLength: number;
        thetaStart: number;
        constructor(
            radius?: number,
            axis?: Cartesian3,
            phiStart?: Cartesian3,
            phiLength?: number,
            thetaStart?: number,
            thetaLength?: number);
    }

    /**
     *
     */
    class GridSimplexGeometry extends SimplexGeometry {
        constructor(parametricFunction: (u: number, v: number) => Cartesian3, uSegments: number, vSegments: number)
    }

    class TetrahedronSimplexGeometry extends PolyhedronSimplexGeometry {
        constructor(radius?: number, detail?: number)
    }

    class KleinBottleSimplexGeometry extends GridSimplexGeometry {
        constructor(uSegments: number, vSegments: number)
    }

    class MobiusStripSimplexGeometry extends GridSimplexGeometry {
        constructor(uSegments: number, vSegments: number)
    }

    /**
     *
     */
    class Material implements IMaterial {
        program: WebGLProgram;
        programId: string;
        vertexShader: string;
        fragmentShader: string;
        attributes(canvasId: number): { [name: string]: AttribLocation };
        uniforms(canvasId: number): { [name: string]: UniformLocation };
        constructor(monitors: IContextMonitor[], name: string);
        addRef(): number;
        release(): number;
        use(canvasId: number): void;
        enableAttrib(name: string, canvasId: number): void;
        disableAttrib(name: string, canvasId: number): void;
        contextFree(canvasId: number): void;
        contextGain(manager: IContextProvider): void;
        contextLost(canvasId: number): void;
        uniform1f(name: string, x: number, canvasId: number): void;
        uniform2f(name: string, x: number, y: number, canvasId: number): void;
        uniform3f(name: string, x: number, y: number, z: number, canvasId: number): void;
        uniform4f(name: string, x: number, y: number, z: number, w: number, canvasId: number): void;
        uniformMatrix2(name: string, transpose: boolean, matrix: Matrix2, canvasId: number): void;
        uniformMatrix3(name: string, transpose: boolean, matrix: Matrix3, canvasId: number): void;
        uniformMatrix4(name: string, transpose: boolean, matrix: Matrix4, canvasId: number): void;
        uniformCartesian2(name: string, vector: Vector2, canvasId: number): void;
        uniformCartesian3(name: string, vector: Vector3, canvasId: number): void;
        uniformCartesian4(name: string, vector: Vector4, canvasId: number): void;
        vector2(name: string, data: number[], canvasId: number): void;
        vector3(name: string, data: number[], canvasId: number): void;
        vector4(name: string, data: number[], canvasId: number): void;
    }

    /**
     *
     */
    class Drawable<M extends IMaterial> implements IDrawable {
        primitives: DrawPrimitive[];
        material: M;
        name: string;
        constructor(primitives: DrawPrimitive[], material: M);
        addRef(): number;
        release(): number;
        draw(canvasId: number): void;
        contextFree(): void;
        contextGain(manager: IContextProvider): void;
        contextLost(): void;
        getFacet(name: string): IFacet
        setFacet<T extends IFacet>(name: string, value: T): T
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
        constructor(contexts: IContextMonitor[], scriptIds?: string[], dom?: Document);
    }

    /**
     *
     */
    interface PointMaterialParameters {

    }

    /**
     *
     */
    class PointMaterial extends Material {
        constructor(contexts?: IContextMonitor[], parameters?: PointMaterialParameters);
    }

    /**
     *
     */
    interface LineMaterialParameters {

    }

    /**
     *
     */
    class LineMaterial extends Material {
        constructor(contexts?: IContextMonitor[], parameters?: LineMaterialParameters);
    }

    /**
     *
     */
    interface MeshMaterialParameters {

    }

    /**
     *
     */
    class MeshMaterial extends Material {
        constructor(contexts?: IContextMonitor[], parameters?: MeshMaterialParameters);
    }

    /**
     *
     */
    class MeshLambertMaterial extends Material {
        constructor(contexts?: IContextMonitor[]);
    }

    class SmartMaterialBuilder {
        constructor(elements?: DrawPrimitive);
        public attribute(key: string, size: number, name?: string): SmartMaterialBuilder;
        public uniform(key: string, type: string, name?: string): SmartMaterialBuilder;
        public build(contexts: IContextMonitor[]): Material;
    }

    class AbstractFacet extends Shareable implements IFacet {
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): void;
        setUniforms(visitor: IFacetVisitor, canvasId: number): void;
    }

    class AmbientLight extends AbstractFacet {
        public color: Color;
        constructor();
        destructor(): void;
    }

    /**
     *
     */
    class ColorFacet extends AbstractFacet implements IUnknownExt<ColorFacet> {
        red: number;
        green: number;
        blue: number;
        constructor(name?: string)
        incRef(): ColorFacet;
        decRef(): ColorFacet;
        scale(s: number): ColorFacet;
        setColor(color: ColorRGB): ColorFacet;
        setRGB(red: number, green: number, blue: number): ColorFacet;
    }

    class DirectionalLight extends AbstractFacet {
        public direction: Vector3;
        public color: Color;
        constructor();
    }


    class PointSize extends AbstractFacet {
        pointSize: number
        constructor(pointSize?: number);
    }

    class EulerFacet extends AbstractFacet {
        rotation: Vector3;
        constructor()
    }

    /**
     * A (name: string, vector: Vector3) pair that can be used to set a uniform variable.
     */
    class Vector3Uniform extends AbstractFacet {
        constructor(name: string, vector: Vector3);
    }

    // commands
    interface IContextCommand extends IContextConsumer {
    }

    /**
     * `blendFunc(sfactor: number, dfactor: number): void`
     */
    class WebGLBlendFunc extends Shareable implements IContextCommand {
        sfactor: string;
        dfactor: string;
        constructor(sfactor?: string, dfactor?: string);
        /**
         * canvasId
         */
        contextFree(canvasId: number): void;
        /**
         * manager
         */
        contextGain(manager: IContextProvider): void;
        /**
         * canvasId
         */
        contextLost(canvasId: number): void;
    }

    /**
     * `clearColor(red: number, green: number, blue: number, alpha: number): void`
     */
    class WebGLClearColor extends Shareable implements IContextCommand {
        red: number;
        green: number;
        blue: number;
        alpha: number;
        constructor(red?: number, green?: number, blue?: number, alpha?: number);
        /**
         * canvasId
         */
        contextFree(canvasId: number): void;
        /**
         * manager
         */
        contextGain(manager: IContextProvider): void;
        /**
         * canvasId
         */
        contextLost(canvasId: number): void;
    }


    /**
     * `disable(capability: number): void`
     */
    class WebGLDisable extends Shareable implements IContextCommand {
        /**
         * capability e.g. 'DEPTH_TEST', 'BLEND'
         */
        constructor(capability: string);
        /**
         *
         */
        contextFree(canvasId: number): void;
        /**
         *
         */
        contextGain(manager: IContextProvider): void;
        /**
         *
         */
        contextLost(canvasId: number): void;
    }

    /**
     * `enable(capability: number): void`
     */
    class WebGLEnable extends Shareable implements IContextCommand {
        /**
         * capability e.g. 'DEPTH_TEST', 'BLEND'
         */
        constructor(capability: string);
        /**
         *
         */
        contextFree(canvasId: number): void;
        /**
         *
         */
        contextGain(manager: IContextProvider): void;
        /**
         *
         */
        contextLost(canvasId: number): void;
    }

    ///////////////////////////////////////////////////////////////////////////////

    interface IAnimationTarget extends IUnknown {
        uuid: string;
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): void;
    }

    interface IAnimation extends IUnknown {
        apply(target: IAnimationTarget, propName: string, now: number, offset?: number): void;
        skip(target: IAnimationTarget, propName: string): void;
        hurry(factor: number): void;
        extra(now: number): number;
        done(target: IAnimationTarget, propName: string): boolean;
        undo(target: IAnimationTarget, propName: string): void;
    }

    interface IDirector {
        addCanvas3D(context: Canvas3D): void;
        getCanvas3D(canvasId: number): Canvas3D;
        removeCanvas3D(canvasId: number): void;

        addDrawable(drawable: IDrawable, drawableName): void;
        getDrawable(drawableName: string): IDrawable;
        removeDrawable(drawableName: string): void;

        addFacet(facet: IFacet, facetName: string): void;
        getFacet(facetName: string): IFacet;
        removeFacet(facetName: string): void;

        addGeometry(name: string, geometry: SimplexGeometry): void;
        getGeometry(name: string): SimplexGeometry;
        removeGeometry(name: string): void;

        addScene(scene: IDrawList, sceneName: string): void;
        getScene(sceneName: string): IDrawList;
        removeScene(sceneName: string): void;

        useDrawableInScene(drawableName: string, sceneName: string, confirm: boolean): void
        useSceneOnCanvas(sceneName: string, canvasId: number, confirm: boolean): void
        useFacetOnCanvas(facetName: string, canvasId: number, confirm: boolean): void
    }

    interface ISlide {
        pushAnimation(target: IAnimationTarget, propName: string, animation: IAnimation): void;
        popAnimation(target: IAnimationTarget, propName: string): IAnimation;
    }

    interface ISlideCommand extends IUnknown {
        redo(slide: ISlide, director: IDirector): void;
        undo(slide: ISlide, director: IDirector): void;
    }

    class AbstractSlideCommand extends Shareable implements ISlideCommand {
        redo(slide: ISlide, director: IDirector): void;
        undo(slide: ISlide, director: IDirector): void;
    }

    class SlideCommands extends AbstractSlideCommand {
        constructor(userName: string);
        pushWeakRef(command: ISlideCommand): number;
        animateDrawable(drawableName: string, facetName: string, propName: string, animation: IAnimation): number;
        attitude(drawableName: string, attitude: Spinor3Coords, duration?: number, callback?: () => any): number;
        color(drawableName: string, color: ColorRGB, duration?: number, callback?: () => any): number;
        createDrawable(drawableName: string, geometry: SimplexGeometry): number;
        cuboid(drawableName: string, a?: Cartesian3, b?: Cartesian3, c?: Cartesian3, k?: number, subdivide?: number, boundary?: number): number;
        destroyDrawable(drawableName: string): number;
        position(drawableName: string, position: Cartesian3, duration?: number, callback?: () => any): number;
        useDrawableInScene(drawableName: string, sceneName: string, confirm: boolean): number;
    }

    class Slide extends Shareable implements ISlide {
        prolog: SlideCommands;
        epilog: SlideCommands;
        constructor();
        pushAnimation(target: IAnimationTarget, propName: string, animation: IAnimation): void
        popAnimation(target: IAnimationTarget, propName: string): IAnimation
    }

    class Director extends Shareable implements IDirector {
        slides: IUnknownArray<Slide>;

        constructor();

        addCanvas3D(context: Canvas3D): void;
        getCanvas3D(canvasId: number): Canvas3D;
        removeCanvas3D(canvasId: number): void;

        addDrawable(drawable: IDrawable, drawableName: string): void;
        getDrawable(drawableName: string): IDrawable;
        removeDrawable(drawableName: string): void;

        addFacet(facet: IFacet, facetName: string): void;
        getFacet(facetName: string): IFacet
        removeFacet(facetName: string): void;

        addGeometry(name: string, geometry: SimplexGeometry): void;
        getGeometry(name: string): SimplexGeometry;
        removeGeometry(name: string): void;

        addScene(scene: IDrawList, sceneName: string): void;
        getScene(sceneName: string): IDrawList;
        removeScene(sceneName: string): void;

        useDrawableInScene(drawableName: string, sceneName: string, confirm: boolean): void
        useSceneOnCanvas(sceneName: string, canvasId: number, confirm: boolean): void
        useFacetOnCanvas(facetName: string, canvasId: number, confirm: boolean): void

        createSlide(): Slide;

        canForward(): boolean;
        forward(instant?: boolean, delay?: number): void;
        canBackward(): boolean;
        backward(instant?: boolean, delay?: number): void;
        advance(interval: number): void;
        render(): void;
    }

    class DirectorKeyboardHandler extends Shareable implements IKeyboardHandler {
        constructor(director: Director);
        keyDown(event: KeyboardEvent): void;
        keyUp(event: KeyboardEvent): void;
    }

    class ColorAnimation extends Shareable implements IAnimation {
        constructor(value: ColorRGB, duration?: number, callback?: () => void, ease?: string);
        apply(target: IAnimationTarget, propName: string, now: number, offset?: number);
        hurry(factor: number): void;
        skip(target: IAnimationTarget, propName: string): void;
        extra(now: number): number;
        done(target: IAnimationTarget, propName: string): boolean;
        undo(target: IAnimationTarget, propName: string): void;
    }

    class WaitAnimation extends Shareable implements IAnimation {
        public start: number;
        public duration: number;
        public fraction: number;
        constructor(duration: number);
        apply(target: IAnimationTarget, propName: string, now: number, offset: number): void;
        skip(): void;
        hurry(factor: number): void;
        extra(now: number): number;
        done(target: IAnimationTarget, propName: string): boolean;
        undo(target: IAnimationTarget, propName: string): void;
    }


    class Vector3Animation extends Shareable implements IAnimation {
        constructor(value: Cartesian3, duration?: number, callback?: () => void, ease?: string);
        apply(target: IAnimationTarget, propName: string, now: number, offset?: number);
        hurry(factor: number): void;
        skip(target: IAnimationTarget, propName: string): void;
        extra(now: number): number;
        done(target: IAnimationTarget, propName: string): boolean;
        undo(target: IAnimationTarget, propName: string): void;
    }

    class Spinor3Animation extends Shareable implements IAnimation {
        constructor(value: Spinor3Coords, duration?: number, callback?: () => void, ease?: string);
        apply(target: IAnimationTarget, propName: string, now: number, offset?: number);
        hurry(factor: number): void;
        skip(target: IAnimationTarget, propName: string): void;
        extra(now: number): number;
        done(target: IAnimationTarget, propName: string): boolean;
        undo(target: IAnimationTarget, propName: string): void;
    }

    class AnimateDrawableCommand extends AbstractSlideCommand {
        constructor(drawableName: string, facetName: string, propName: string, animation: IAnimation);
    }


    class CreateCuboidDrawable extends AbstractSlideCommand {
        constructor(name: string, a?: Cartesian3, b?: Cartesian3, c?: Cartesian3);
    }

    class DestroyDrawableCommand extends AbstractSlideCommand {
        constructor(name: string);
    }

    class GeometryCommand extends AbstractSlideCommand {
        constructor(name: string, geometry: SimplexGeometry);
    }

    class TestCommand extends AbstractSlideCommand {
        constructor(name: string);
    }

    class UseDrawableInSceneCommand extends AbstractSlideCommand {
        constructor(drawableName: string, sceneName: string, confirm: boolean);
    }
    ///////////////////////////////////////////////////////////////////////////////
    class Topology {
        constructor(numVertices: number);
        toDrawPrimitive(): DrawPrimitive;
    }

    class PointTopology extends Topology {
        constructor(numVertices: number);
    }

    class LineTopology extends Topology {
        constructor(numVertices: number);
    }

    class MeshTopology extends Topology {
        constructor(numVertices: number);
    }

    class GridTopology extends MeshTopology {
        uLength: number;
        uSegments: number;
        vLength: number;
        vSegments: number;
        constructor(uSegments: number, vSegments: number);
        vertex(uIndex: number, vIndex: number): Vertex;
    }

    ///////////////////////////////////////////////////////////////////////////////
    interface IKeyboardHandler extends IUnknown {
        keyDown(event: KeyboardEvent): void;
        keyUp(event: KeyboardEvent): void;
    }

    class Keyboard extends Shareable {
        constructor(handler: IKeyboardHandler, document?: Document);
        attach(handler: IKeyboardHandler, document?: Document, useCapture?: boolean): void;
        detach(): void;
    }
    ///////////////////////////////////////////////////////////////////////////////
}

declare module 'eight'
{
    export = EIGHT;
}
