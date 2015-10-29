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
    enum DrawMode {
        /**
         * @property POINTS
         * @type {DrawMode}
         */
        POINTS,
        LINES,
        LINE_STRIP,
        LINE_LOOP,
        TRIANGLES,
        TRIANGLE_STRIP,
        /**
         * @property TRIANGLE_FAN
         * @type {DrawMode}
         */
        TRIANGLE_FAN
    }
    /**
     *
     */
    class DrawPrimitive {
        public mode: DrawMode;
        public indices: number[];
        public attributes: { [name: string]: DrawAttribute };
        constructor(mode: DrawMode, indices: number[], attributes: { [name: string]: DrawAttribute });
    }

    /**
     *
     */
    class DrawAttribute {
        public values: number[];
        public size: number;
        constructor(values: number[], size: number);
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
        matrix1(transpose: boolean, matrix: R1): void;
        matrix2(transpose: boolean, matrix: Matrix2): void;
        matrix3(transpose: boolean, matrix: Matrix3): void;
        matrix4(transpose: boolean, matrix: Matrix4): void;
        vector2(vector: R2): void;
        vector3(vector: R3): void;
        vector4(vector: R4): void;
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
     * A rational number.
     */
    class QQ {

        /**
         * The numerator.
         * @property numer
         * @type {number}
         */
        numer: number;

        /**
         * The denominator.
         * @property denom
         * @type {number}
         */
        denom: number;

        /**
         * Constructs a rational number from an ordered pair of integers.
         * @param numer {number} The numerator.
         * @param denom {number} The denominator.
         */
        constructor(numer: number, denom: number);

        /**
         * Computes the multiplicative inverse of this rational number.
         * @method inv
         * @return {QQ}
         */
        inv(): QQ;

        /**
         * Determines whether this rational number is the multiplicative identity (1).
         */
        isOne(): boolean;

        /**
         * Determines whether this rational number is the additive identity (0).
         */
        isZero(): boolean;

        /**
         * Computes the additive inverse of this rational number.
         * @method neg
         * @return {QQ}
         */
        neg(): QQ;

        static MINUS_ONE: QQ;

        /**
         * The multiplicative identity (1) for rational numbers.
         * @property ONE
         * @type {QQ}
         * @static
         */
        static ONE: QQ;
        static TWO: QQ;

        /**
         * The additive identity (0) for rational numbers.
         * @property ZERO
         * @type {QQ}
         * @static
         */
        static ZERO: QQ;
    }

    /**
     * The dimensions of a physical quantity.
     */
    class Dimensions {
        M: QQ;
        L: QQ;
        T: QQ;
        Q: QQ;
        temperature: QQ;
        amount: QQ;
        intensity: QQ;
        constructor(M: QQ, L: QQ, T: QQ, Q: QQ, temperature: QQ, amount: QQ, intensity);
        isOne(): boolean;
        isZero(): boolean;
        inv(): Dimensions;
        neg(): Dimensions;

        /**
         * @property ONE
         * @type {Dimensions}
         * @static
         */
        public static ONE: Dimensions;

        /**
         * @property MASS
         * @type {Dimensions}
         * @static
         */
        public static MASS: Dimensions;

        /**
         * @property LENGTH
         * @type {Dimensions}
         * @static
         */
        public static LENGTH: Dimensions;

        /**
         * @property TIME
         * @type {Dimensions}
         * @static
         */
        public static TIME: Dimensions;

        /**
         * @property CHARGE
         * @type {Dimensions}
         * @static
         */
        public static CHARGE: Dimensions;

        /**
         * @property CURRENT
         * @type {Dimensions}
         * @static
         */
        public static CURRENT: Dimensions;

        /**
         * @property TEMPERATURE
         * @type {Dimensions}
         * @static
         */
        public static TEMPERATURE: Dimensions;

        /**
         * @property AMOUNT
         * @type {Dimensions}
         * @static
         */
        public static AMOUNT: Dimensions;

        /**
         * @property INTENSITY
         * @type {Dimensions}
         * @static
         */
        public static INTENSITY: Dimensions;
    }

    /**
     * The uinit of measure for a physical quantity.
     */
    class Unit {
        multiplier: number;
        dimensions: Dimensions;
        labels: string[];
        constructor(multiplier: number, dimensions: Dimensions, labels: string[]);
        inv(): Unit;
        isOne(): boolean;
        isZero(): boolean;
        neg(): Unit;

        /**
         * Tme multiplicative identity (1).
         */
        static ONE: Unit;

        /**
         * The kilogram.
         */
        static KILOGRAM: Unit;

        /**
         * The meter.
         */
        static METER: Unit;

        /**
         * The second.
         */
        static SECOND: Unit;

        /**
         * The coulomb.
         */
        static COULOMB: Unit;

        /**
         * The ampere.
         */
        static AMPERE: Unit;

        /**
         * The kelvin.
         */
        static KELVIN: Unit;

        /**
         * The mole.
         */
        static MOLE: Unit;

        /**
         * The candela.
         */
        static CANDELA: Unit;
    }

    /**
     * A measure with an optional unit of measure.
     */
    class Euclidean3 implements VectorE3, SpinorE3 {
        static fromSpinorE3(spinor: SpinorE3): Euclidean3;
        α: number;
        x: number;
        y: number;
        z: number;
        yz: number;
        zx: number;
        xy: number;
        β: number;
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
        toFixed(digits?: number): string;
        toString(): string;
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
        static scaling(scale: VectorE3): Matrix4;
        /**
         * Generates a new translation matrix.
         */
        static translation(vector: VectorE3): Matrix4;
        /**
         * Generates a new rotation matrix.
         */
        static rotation(spinor: SpinorE3): Matrix4;
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
        mul(matrix: Matrix4): Matrix4;
        mul2(a: Matrix4, b: Matrix4): Matrix4;
        rotate(spinor: SpinorE3): Matrix4;
        rotation(spinor: SpinorE3): Matrix4;
        scale(scale: VectorE3): Matrix4;
        scaling(scale: VectorE3): Matrix4;
        translate(displacement: VectorE3): Matrix4;
        translation(displacement: VectorE3): Matrix4;
        transpose(): Matrix4;
        frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
        toString(): string;
        toFixed(digits?: number): string;
    }

    /**
     *
     */
    interface VectorE1 {
        x: number;
    }

    /**
     *
     */
    interface VectorE2 {
        x: number;
        y: number;
    }

    /**
     *
     */
    interface SpinorE2 {
        α: number;
        β: number;
        /**
         * The principal value of the spinor argument, in radians.
         */
        arg(): number;
        /**
         * The squared norm
         */
        squaredNorm(): number;
    }

    /**
     *
     */
    interface GeometricE2 extends SpinorE2, VectorE2 {
    }

    /**
     * @class G2
     * @extends GeometricE2
     * @beta
     */
    class G2 extends VectorN<number> implements GeometricE2 {
        /**
         * Constructs a <code>G2</code>.
         * The multivector is initialized to zero.
         * @class G2
         * @beta
         * @constructor
         */
        constructor();
        /**
         * The coordinate corresponding to the unit standard basis scalar.
         * @property α
         * @type {number}
         */
        α: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
         * @property x
         * @type {number}
         */
        x: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
         * @property y
         * @type {number}
         */
        y: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
         * @property β
         * @type {number}
         */
        β: number;
        /**
         * <p>
         * <code>this ⟼ this + M * α</code>
         * </p>
         * @method add
         * @param M {GeometricE2}
         * @param α [number = 1]
         * @return {G2} <code>this</code>
         * @chainable
         */
        add(M: GeometricE2, α?: number): G2;
        /**
         * <p>
         * <code>this ⟼ this + v * α</code>
         * </p>
         * @method addVector
         * @param v {VectorE2}
         * @param α [number = 1]
         * @return {G2} <code>this</code>
         * @chainable
         */
        addVector(v: VectorE2, α?: number): G2;
        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        add2(a: GeometricE2, b: GeometricE2): G2;

        /**
         * Assuming <code>this = A * e<sup>B θ</sup></code>, where <code>B<sup>2</sup> = -1</code>, returns the <em>principal value</em> of θ.
         * @method arg
         * @return {number} The principal value of θ, in <em>radians</em>.
         */
        arg(): number;

        /**
         * @method clone
         * @return {G2} <code>copy(this)</code>
         */
        clone(): G2;
        /**
         * <p>
         * <code>this ⟼ conjugate(this)</code>
         * </p>
         * @method conj
         * @return {G2} <code>this</code>
         * @chainable
         */
        conj(): G2;
        /**
         * <p>
         * <code>this ⟼ this << m</code>
         * </p>
         * @method lco
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        lco(m: GeometricE2): G2;
        /**
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @method lco2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        lco2(a: GeometricE2, b: GeometricE2): G2;
        /**
         * <p>
         * <code>this ⟼ this >> m</code>
         * </p>
         * @method rco
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        rco(m: GeometricE2): G2;
        /**
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @method rco2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        rco2(a: GeometricE2, b: GeometricE2): G2;
        /**
         * <p>
         * <code>this ⟼ copy(M)</code>
         * </p>
         * @method copy
         * @param M {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        copy(M: GeometricE2): G2;
        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copySpinor
         * @param spinor {SpinorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        copySpinor(spinor: SpinorE2): G2;
        /**
         * <p>
         * <code>this ⟼ copyVector(vector)</code>
         * </p>
         * @method copyVector
         * @param vector {VectorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        copyVector(vector: VectorE2): G2;
        /**
         * <p>
         * <code>this ⟼ this / m</code>
         * </p>
         * @method div
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        div(m: GeometricE2): G2;
        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        divByScalar(α: number): G2;
        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @method div2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        div2(a: SpinorE2, b: SpinorE2): G2;
        /**
         * <p>
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * Notice that the dual of a vector is related to the spinor by the right-hand rule.
         * @method dual
         * @param m {GeometricE2} The vector whose dual will be used to set this spinor.
         * @return {G2} <code>this</code>
         * @chainable
         */
        dual(m: VectorE2): G2;
        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {G2} <code>this</code>
         * @chainable
         */
        exp(): G2;
        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         * @method inv
         * @return {G2} <code>this</code>
         * @chainable
         */
        inv(): G2;
        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {GeometricE2}
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        lerp(target: GeometricE2, α: number): G2;
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @param α {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        lerp2(a: GeometricE2, b: GeometricE2, α: number): G2;
        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         * @method log
         * @return {G2} <code>this</code>
         * @chainable
         */
        log(): G2;

        /**
         * @method magnitude
         * @return {number} <code>|this|</code>
         */
        magnitude(): number;

        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        mul(m: GeometricE2): G2;

        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @method mul2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        mul2(a: GeometricE2, b: GeometricE2): G2;
        /**
         * <p>
         * <code>this ⟼ -1 * this</code>
         * </p>
         * @method neg
         * @return {G2} <code>this</code>
         * @chainable
         */
        neg(): G2;

        /**
         * <p>
         * <code>this ⟼ sqrt(this * conj(this))</code>
         * </p>
         * @method norm
         * @return {G2} <code>this</code>
         * @chainable
         */
        norm(): G2;

        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         * @method normalize
         * @return {G2} <code>this</code>
         * @chainable
         */
        normalize(): G2;

        /**
         * <p>
         * <code>this ⟼ this | ~this = scp(this, rev(this))</code>
         * </p>
         * @method quad
         * @return {G2} <code>this</code>
         * @chainable
         */
        quad(): G2;

        /**
         * @method squaredNorm
         * @return {number} <code>this * conj(this)</code>
         */
        squaredNorm(): number;
        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @method reflect
         * @param n {VectorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        reflect(n: VectorE2): G2;
        /**
         * <p>
         * <code>this ⟼ rev(this)</code>
         * </p>
         * @method reverse
         * @return {G2} <code>this</code>
         * @chainable
         */
        rev(): G2;
        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @method rotate
         * @param R {SpinorE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        rotate(R: SpinorE2): G2;

        /**
         * <p>
         * Sets this multivector to a rotor representing a rotation from a to b.
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         * </p>
         * @param a {VectorE2} The <em>from</em> vector.
         * @param b {VectorE2} The <em>to</em> vector.
         */
        rotorFromDirections(a: VectorE2, b: VectorE2): G2;

        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @method rotorFromGeneratorAngle
         * @param B {SpinorE2}
         * @param θ {number}
         * @return {G2} <code>this</code>
         * @chainable
         */
        rotorFromGeneratorAngle(B: SpinorE2, θ: number): G2;
        /**
         * <p>
         * <code>this ⟼ scp(this, m)</code>
         * </p>
         * @method align
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        scp(m: GeometricE2): G2;
        /**
         * <p>
         * <code>this ⟼ scp(a, b)</code>
         * </p>
         * @method scp2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        scp2(a: GeometricE2, b: GeometricE2): G2;
        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number}
         */
        scale(α: number): G2;
        /**
         * <p>
         * <code>this ⟼ a * b = a · b + a ^ b</code>
         * </p>
         * Sets this G2 to the geometric product a * b of the vector arguments.
         * @method spinor
         * @param a {VectorE2}
         * @param b {VectorE2}
         * @return {G2} <code>this</code>
         */
        spinor(a: VectorE2, b: VectorE2): G2;
        /**
         * <p>
         * <code>this ⟼ this - M * α</code>
         * </p>
         * @method sub
         * @param M {GeometricE2}
         * @param α [number = 1]
         * @return {G2} <code>this</code>
         * @chainable
         */
        sub(M: GeometricE2, α?: number): G2;
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         */
        sub2(a: GeometricE2, b: GeometricE2): G2;

        /**
         * Returns a string representing the number in exponential notation.
         * @param fractionDigits [number]
         */
        toExponential(): string;

        /**
         * Returns a string representing the number in fixed-point notation.
         * @method toFixed
         * @param fractionDigits [number]
         * @return {string}
         */
        toFixed(fractionDigits?: number): string;
        /**
         * Returns a string representation of the number.
         * @method toString
         * @return {string} 
         */
        toString(): string;
        /**
         * <p>
         * <code>this ⟼ this ^ m</code>
         * </p>
         * @method wedge
         * @param m {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        ext(m: GeometricE2): G2;
        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @method ext2
         * @param a {GeometricE2}
         * @param b {GeometricE2}
         * @return {G2} <code>this</code>
         * @chainable
         */
        ext2(a: GeometricE2, b: GeometricE2): G2;
    
        /**
         * The identity element for addition.
         * @property zero
         * @type {G2}
         * @readOnly
         * @static
         */
        static zero: G2;
    
        /**
         * The identity element for multiplication.
         * @property one
         * @type {G2}
         * @readOnly
         * @static
         */
        static one: G2;
    
        /**
         * Basis vector corresponding to the <code>x</code> coordinate.
         * @property e1
         * @type {G2}
         * @readOnly
         * @static
         */
        static e1: G2;

        /**
         * Basis vector corresponding to the <code>y</code> coordinate.
         * @property e2
         * @type {G2}
         * @readOnly
         * @static
         */
        static e2: G2;
    
        /**
         * Basis vector corresponding to the <code>β</code> coordinate.
         * @property I
         * @type {G2}
         * @readOnly
         * @static
         */
        static I: G2;
    
        /**
         * @method copy
         * @param M {GeometricE2}
         * @return {G2}
         * @static
         */
        static copy(M: GeometricE2): G2;

        /**
         * @method fromScalar
         * @param α {number}
         * @return {G2}
         * @static
         * @chainable
         */
        static fromScalar(α: number): G2;

        /**
         * @method fromSpinor
         * @param spinor {SpinorE2}
         * @return {G2}
         * @static
         * @chainable
         */
        static fromSpinor(spinor: SpinorE2): G2;

        /**
         * @method fromVector
         * @param vector {VectorE2}
         * @return {G2}
         * @static
         * @chainable
         */
        static fromVector(vector: VectorE2): G2;

        /**
        * @method lerp
        * @param A {GeometricE2}
        * @param B {GeometricE2}
        * @param α {number}
        * @return {G2} <code>A + α * (B - A)</code>
        * @static
        * @chainable
        */
        static lerp(A: GeometricE2, B: GeometricE2, α: number): G2;

        /**
         * Computes the rotor corresponding to a rotation from <code>a</code> to <code>b</code>.
         */
        static rotorFromDirections(a: VectorE2, b: VectorE2): G2;
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
    class R1 extends VectorN<number> implements VectorE1 {
        public x: number;
        constructor(data?: number[], modified?: boolean);
    }

    /**
     *
     */
    class R2 extends VectorN<number> implements VectorE2 {
        public x: number;
        public y: number;
        constructor(data?: number[], modified?: boolean);
        add(v: VectorE2): R2;
        sum(a: VectorE2, b: VectorE2): R2;
        copy(v: VectorE2): R2;
        magnitude(): number;
        scale(s: number): R2;
        squaredNorm(): number;
        set(x: number, y: number): R2;
        sub(v: VectorE2): R2;
        diff(a: VectorE2, b: VectorE2): R2;
    }
    /**
     *
     */
    interface PseudoE3 {
        /**
         * The coordinate corresponding to the I<sub>3</sub> <code>=</code> <b>e</b><sub>1</sub><b>e</b><sub>2</sub><b>e</b><sub>2</sub> standard basis pseudoscalar.
         * @property β
         * @type {number}
         */
        β: number;
    }

    /**
     *
     */
    interface SpinorE3 {
        yz: number;
        zx: number;
        xy: number;
        α: number;
    }

    /**
     * The coordinates for a multivector in 3D in geometric Cartesian basis.
     */
    interface GeometricE3 extends PseudoE3, SpinorE3, VectorE3 {

    }
    /**
     * A mutable multivector in 3D with a Euclidean metric.
     */
    class G3 extends VectorN<number> {
        /**
         * The coordinate corresponding to the unit standard basis scalar.
         * @property α
         * @type {number}
         */
        α: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
         */
        x: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
         */
        y: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
         */
        z: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
         */
        yz: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
         */
        zx: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
         */
        xy: number;
        /**
         * The pseudoscalar coordinate of the multivector.
         * @property β
         * @type {number}
         */
        β: number;
        /**
         * Constructs a <code>G3</code>.
         * The multivector is initialized to zero.
         * @class G3
         * @beta
         * @constructor
         */
        constructor(data?: number[]);

        /**
         * <p>
         * <code>this ⟼ this + M * α</code>
         * </p>
         * @method add
         * @param M {GeometricE3}
         * @param α [number = 1]
         * @return {G3} <code>this</code>
         * @chainable
         */
        add(M: GeometricE3, α?: number): G3;

        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @method add2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        add2(a: GeometricE3, b: GeometricE3): G3;

        /**
         * @method clone
         * @return {G3} <code>copy(this)</code>
         */
        clone(): G3;

        /**
         * <p>
         * <code>this ⟼ copy(v)</code>
         * </p>
         * @method copy
         * @param M {VectorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        copy(M: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @method copySpinor
         * @param spinor {SpinorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        copySpinor(spinor: SpinorE3): G3;

        /**
         * <p>
         * <code>this ⟼ copyVector(vector)</code>
         * </p>
         * @method copyVector
         * @param vector {VectorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        copyVector(vector: VectorE3): G3;

        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @method divByScalar
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        divByScalar(α: number): G3;

        /**
         * <p>
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * Notice that the dual of a vector is related to the spinor by the right-hand rule.
         * @method dual
         * @param m {GeometricE3} The vector whose dual will be used to set this spinor.
         * @return {G3} <code>this</code>
         * @chainable
         */
        dual(m: VectorE3): G3;

        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         * @method exp
         * @return {G3} <code>this</code>
         * @chainable
         */
        exp(): G3;

        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @method lerp
         * @param target {GeometricE3}
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        lerp(target: GeometricE3, α: number): G3;
        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @method lerp2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @param α {number}
         * @return {G3} <code>this</code>
         * @chainable
         */
        lerp2(a: GeometricE3, b: GeometricE3, α: number): G3;

        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @method mul
         * @param m {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        mul(m: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         * @method normalize
         * @return {G3} <code>this</code>
         * @chainable
         */
        normalize(): G3

        /**
         * <p>
         * <code>this ⟼ rev(this)</code>
         * </p>
         * @method reverse
         * @return {G3} <code>this</code>
         * @chainable
         */
        rev(): G3;

        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number} 
         */
        scale(α: number): G3;
        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @method reflect
         * @param n {VectorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        reflect(n: VectorE3): G3;
        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @method rotate
         * @param R {SpinorE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        rotate(R: SpinorE3): G3;

        /**
         * <p>
         * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
         * </p>
         * @method rotorFromAxisAngle
         * @param axis {VectorE3}
         * @param θ {number}
         * @return {G3} <code>this</code>
         */
        rotorFromAxisAngle(axis: VectorE3, θ: number): G3;

        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @method scale
         * @param α {number} 
         */
        scale(α: number): G3;

        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this G3 to the geometric product a * b of the vector arguments. 
         * @method spinor
         * @param a {VectorE3}
         * @param b {VectorE3}
         * @return {G3} <code>this</code>
         */
        spinor(a: VectorE3, b: VectorE3): G3;

        /**
         * <p>
         * <code>this ⟼ this - M * α</code>
         * </p>
         * @method sub
         * @param M {GeometricE3}
         * @param α [number = 1]
         * @return {G3} <code>this</code>
         * @chainable
         */
        sub(M: GeometricE3, α?: number): G3;
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @method sub2
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @return {G3} <code>this</code>
         * @chainable
         */
        sub2(a: GeometricE3, b: GeometricE3): G3;

        /**
         * Returns a string representing the number in fixed-point notation.
         * @method toFixed
         * @param fractionDigits [number]
         * @return {string}
         */
        toFixed(fractionDigits?: number): string;
        /**
         * Returns a string representation of the number.
         * @method toString
         * @return {string} 
         */
        toString(): string;

        /**
         * @method fromSpinor
         * @param spinor {SpinorE3}
         * @return {G3}
         * @static
         */
        static fromSpinor(spinor: SpinorE3): G3;

        /**
         * @method fromVector
         * @param vector {VectorE3}
         * @return {G3}
         * @static
         */
        static fromVector(vector: VectorE3): G3;

    }

    /**
     *
     */
    class SpinG3 extends VectorN<number> {
        public yz: number;
        public zx: number;
        public xy: number;
        public α: number;
        /**
         *
         */
        constructor(data?: number[], modified?: boolean);
        /**
         * this ⟼ this + spinor * α
         */
        add(spinor: SpinorE3, α?: number): SpinG3;
        clone(): SpinG3;
        /**
         * this ⟼ copy(spinor)
         */
        copy(spinor: SpinorE3): SpinG3;
        diff(a: SpinorE3, b: SpinorE3): SpinG3;
        divByScalar(scalar: number): SpinG3;
        /**
         * this ⟼ dual(v) = I * v
         */
        dual(v: VectorE3): SpinG3;
        /**
         * this ⟼ exp(this)
         */
        exp(): SpinG3;
        inverse(): SpinG3;
        lerp(target: SpinorE3, α: number): SpinG3;
        log(): SpinG3;
        magnitude(): number;
        mul(rhs: SpinorE3): SpinG3;
        /**
         * this ⟼ this / magnitude(this)
         * <em>s.normalize()</em> scales the target spinor, <em>s</em>, so that it has unit magnitude.
         */
        normalize(): SpinG3;
        /**
         * this ⟼ this * α
         */
        scale(α: number): SpinG3;
        /**
         * Sets this SpinG3 to the geometric product of the vectors a and b, a * b.
         */
        mul2(a: SpinorE3, b: SpinorE3): SpinG3;
        squaredNorm(): number;
        rev(): SpinG3;
        reflect(n: VectorE3): SpinG3;
        /**
         * this ⟼ R * this * rev(R)
         */
        rotate(R: SpinorE3): SpinG3;
        /**
         * this ⟼ exp(- dual(axis) * θ / 2)
         * <code>axis</code> The direction (unit vector) of the rotation.
         * <code>θ</code> The angle of the rotation, measured in radians.
         */
        rotorFromAxisAngle(axis: VectorE3, θ: number): SpinG3;

        /**
         * <p>
         * Sets this multivector to a rotor representing a rotation from a to b.
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         * </p>
         * @param a {VectorE3} The <em>from</em> vector.
         * @param b {VectorE3} The <em>to</em> vector.
         */
        rotorFromDirections(a: VectorE3, b: VectorE3): G2;

        /**
         * this ⟼ this - spinor * α
         */
        sub(spinor: SpinorE3, α?: number): SpinG3;
        sum(a: SpinorE3, b: SpinorE3): SpinG3;
        toString(): string;
        /**
         * this ⟼ a * b
         */
        spinor(a: VectorE3, b: VectorE3): SpinG3;
    }

    /**
     * `Components` of a vector in a 3-dimensional Cartesian coordinate system.
     */
    interface VectorE3 {
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
    class R3 extends VectorN<number> implements VectorE3 {
        x: number;
        y: number;
        z: number;
        static e1: R3;
        static e2: R3;
        static e3: R3;
        static copy(vector: VectorE3): R3;
        constructor(data?: number[], modified?: boolean);
        /**
         * this += alpha * vector
         */
        add(vector: VectorE3, alpha?: number): R3;
        clone(): R3;
        copy(v: VectorE3): R3;
        cross(v: VectorE3): R3;
        cross2(a: VectorE3, b: VectorE3): R3;
        diff(a: VectorE3, b: VectorE3): R3;
        distanceTo(position: VectorE3): number;
        divByScalar(rhs: number): R3;
        magnitude(): number;
        lerp(target: VectorE3, alpha: number): R3;
        scale(rhs: number): R3;
        normalize(): R3;
        squaredNorm(): number;
        quadranceTo(position: VectorE3): number;
        reflect(n: VectorE3): R3;
        rotate(rotor: SpinorE3): R3;
        set(x: number, y: number, z: number): R3;
        setMagnitude(magnitude: number): R3;
        sub(rhs: VectorE3): R3;
        sum(a: VectorE3, b: VectorE3): R3;
        static copy(vector: VectorE3): R3;
        static lerp(a: VectorE3, b: VectorE3, alpha: number): R3;
        static random(): R3;
    }

    /**
     *
     */
    interface VectorE4 {
        x: number;
        y: number;
        z: number;
        w: number;
    }

    /**
     *
     */
    class R4 extends VectorN<number> implements VectorE4 {
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
        uniformVectorE2(name: string, vector: VectorE2, canvasId: number): void;
        uniformVectorE3(name: string, vector: VectorE3, canvasId: number): void;
        uniformVectorE4(name: string, vector: VectorE4, canvasId: number): void;
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
        eye: R3;
        /**
         * A special point in the world coordinates that defines the viewplane normal, VPN or n.
         * n = eye - look, normalized to unity.
         */
        look: VectorE3;
        /**
         * A unit vector used to determine the view horizontal direction, u.
         * u = cross(up, n), and
         * v = cross(n, u).
         */
        up: R3;
        /**
         * Convenience method for setting the eye property allowing chainable method calls.
         */
        setEye(eye: VectorE3): View;
        /**
         * Convenience method for setting the look property allowing chainable method calls.
         */
        setLook(look: VectorE3): View;
        /**
         * Convenience method for setting the up property allowing chainable method calls.
         */
        setUp(up: VectorE3): View;
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
        setEye(eye: VectorE3): Frustum;
        /**
         * Convenience method for setting the look property allowing chainable method calls.
         */
        setLook(look: VectorE3): Frustum;
        /**
         * Convenience method for setting the up property allowing chainable method calls.
         */
        setUp(up: VectorE3): Frustum;
    }

    /**
     * A transformation from the 3D world coordinates or view volume to the canonical view volume.
     * The canonical view volume is the cube that extends from -1 to +1
     * in all Cartesian directions. 
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
        setEye(eye: VectorE3): Perspective;
        /**
         * Convenience method for setting the look property allowing chainable method calls.
         */
        setLook(look: VectorE3): Perspective;
        /**
         * Convenience method for setting the up property allowing chainable method calls.
         */
        setUp(up: VectorE3): Perspective;
    }

    /**
     *
     */
    class Sphere {
        public center: VectorE3;
        public radius: number;
        constructor(center?: VectorE3, radius?: number);
        setFromPoints(points: VectorE3[]);
    }
    /**
     *
     */
    interface IGeometry<T> {
        setPosition(position: VectorE3): T
        toPrimitives(): DrawPrimitive[];
    }
    /**
     *
     */
    interface IAxialGeometry<T> extends IGeometry<T> {
        setAxis(axis: VectorE3): T
    }
    /**
     * A geometry holds a list of simplices.
     */
    class SimplexGeometry extends Shareable implements IGeometry<SimplexGeometry> {
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
        setModified(modified: boolean): SimplexGeometry;
        setPosition(position: VectorE3): SimplexGeometry;
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
    function viewMatrix(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Matrix4): Matrix4;

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

    class ModelE2 extends Shareable implements IAnimationTarget {
        /**
         * The position, a vector.
         */
        public X: G2;
        /**
         * The attitude, a unitary spinor.
         */
        public R: G2;
        /**
         * Constructs a ModelE2 at the origin and with unity attitude.
         */
        constructor();
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): void;
    }

    /**
     * A collection of properties governing GLSL uniforms for Computer Graphics Modeling.
     */
    class ModelFacetE3 extends Shareable implements IFacet, IAnimationTarget, IUnknownExt<ModelFacetE3> {
        /**
         * The position, a vector.
         */
        public X: G3;
        /**
         * The attitude, a unitary spinor.
         */
        public R: G3;
        /**
         * The overall scale.
         */
        public scaleXYZ: R3;
        /**
         * Constructs a ModelFacetE3 at the origin and with unity attitude.
         */
        constructor();
        incRef(): ModelFacetE3;
        decRef(): ModelFacetE3;
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): void;
        setUniforms(visitor: IFacetVisitor, canvasId: number): void;
    }
    /**
     * A collection of properties governing GLSL uniforms for Rigid Body Modeling.
     */
    class KinematicRigidBodyFacetE3 extends ModelFacetE3 {
        /**
         * The linear velocity, a vector.
         */
        V: G3;
        /**
         * The rotational velocity, a spinor.
         */
        Ω: G3;
        /**
         * Constructs a KinematicRigidBodyFacetE3.
         */
        constructor(type?: string);
        destructor(): void;
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
        eye: R3;
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
        look: R3;
        /**
         *The distance to the near plane of the viewport.
         */
        near: number;
        /**
         *
         */
        position: R3;
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
        up: R3;
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
        setEye(eye: VectorE3): PerspectiveCamera
        setFar(far: number): PerspectiveCamera
        setFov(fov: number): PerspectiveCamera
        setLook(look: VectorE3): PerspectiveCamera
        setNear(near: number): PerspectiveCamera
        setUp(up: VectorE3): PerspectiveCamera
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

    class Geometry {
        position: VectorE3;
        useTextureCoords: boolean;
        constructor();
    }

    class AxialGeometry extends Geometry {
        axis: VectorE3;
        sliceAngle: number;
        sliceStart: VectorE3;
        constructor();
    }

    class AxialSimplexGeometry extends SimplexGeometry {
        axis: R3;
        constructor(axis: VectorE3, type: string)
    }

    class SliceSimplexGeometry extends AxialSimplexGeometry {
        constructor(axis: VectorE3, type: string)
    }

    class ArrowGeometry extends AxialGeometry implements IGeometry<ArrowGeometry> {
        /**
         *
         */
        public heightCone: number;
        /**
         *
         */
        public radiusCone: number;
        /**
         *
         */
        public radiusShaft: number;
        /**
         *
         */
        public thetaSegments: number;
        /**
         *
         */
        constructor();
        setPosition(position: VectorE3): ArrowGeometry;
        toPrimitives(): DrawPrimitive[];
    }

    class ArrowSimplexGeometry extends SimplexGeometry {
        vector: R3;
        constructor(type?: string)
    }

    class VortexSimplexGeometry extends SimplexGeometry {
        generator: SpinG3;
        constructor(type?: string)
    }
    /**
     *
     */
    class RingGeometry extends AxialGeometry implements IAxialGeometry<RingGeometry> {
        innerRadius: number;
        outerRadius: number;
        constructor();
        setAxis(axis: VectorE3): RingGeometry
        setPosition(position: VectorE3): RingGeometry
        toPrimitives(): DrawPrimitive[];
    }
    /**
     *
     */
    class RingSimplexGeometry extends SliceSimplexGeometry {
        innerRadius: number;
        outerRadius: number;
        axis: R3;
        start: R3;
        radialSegments: number;
        thetaSegments: number;
        constructor(innerRadius?: number, outerRadius?: number, axis?: VectorE3, start?: VectorE3);
    }

    /**
     *
     */
    class BarnSimplexGeometry extends SimplexGeometry {
        a: R3;
        b: R3;
        c: R3;
        k: number;
        constructor(type?: string);
    }

    /**
     *
     */
    class ConeGeometry extends AxialGeometry implements IGeometry<ConeGeometry> {
        public radius: number;
        public height: number;
        constructor();
        setPosition(position: VectorE3): ConeGeometry;
        toPrimitives(): DrawPrimitive[];
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
            axis: VectorE3,
            radiusTop?: number,
            openTop?: boolean,
            openBottom?: boolean,
            thetaStart?: number,
            thetaLength?: number);
    }
    /**
     *
     */
    class CuboidGeometry extends Geometry implements IGeometry<CuboidGeometry> {
        /**
         * `width` sets the magnitude of the `a` vector parameter.
         */
        width: number;
        /**
         * `height` sets the magnitude of the `b` vector parameter.
         */
        height: number;
        /**
         * `depth` sets the magnitude of the `a` vector parameter.
         */
        depth: number;
        constructor();
        setPosition(position: VectorE3): CuboidGeometry;
        toPrimitives(): DrawPrimitive[];
    }
    /**
     *
     */
    class CuboidSimplexGeometry extends SimplexGeometry {
        a: R3;
        b: R3;
        c: R3;
        k: number;
        constructor(a?: VectorE3, b?: VectorE3, c?: VectorE3, k?: number, subdivide?: number, boundary?: number);
    }

    class CylinderSimplexGeometry extends SliceSimplexGeometry {
        radius: number;
        height: number;
        start: R3;
        openTop: boolean;
        openBottom: boolean;
        constructor(
            radius?: number,
            height?: number,
            axis?: VectorE3,
            start?: VectorE3,
            openTop?: boolean,
            openBottom?: boolean
        )
    }

    class CylinderGeometry extends AxialGeometry implements IGeometry<CylinderGeometry> {
        public radius: number;
        public height: number;
        constructor();
        setPosition(position: VectorE3): CylinderGeometry
        toPrimitives(): DrawPrimitive[];
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
        constructor(points: R3[], generator: SpinG3, segments: number, phiStart: number, phiLength: number, attitude: SpinG3)
    }

    class Simplex1Geometry extends SimplexGeometry {
        head: R3;
        tail: R3;
        constructor();
        calculate(): void;
    }

    /**
     *
     */
    class SphericalPolarSimplexGeometry extends SliceSimplexGeometry implements IAxialGeometry<SphericalPolarSimplexGeometry> {
        radius: number;
        phiLength: number;
        phiStart: R3;
        thetaLength: number;
        thetaStart: number;
        constructor(
            radius?: number,
            axis?: VectorE3,
            phiStart?: VectorE3,
            phiLength?: number,
            thetaStart?: number,
            thetaLength?: number);
        setAxis(axis: VectorE3): SphericalPolarSimplexGeometry;
        setPosition(position: VectorE3): SphericalPolarSimplexGeometry;
    }

    /**
     *
     */
    class GridSimplexGeometry extends SimplexGeometry {
        constructor(parametricFunction: (u: number, v: number) => VectorE3, uSegments: number, vSegments: number)
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
        uniformVectorE2(name: string, vector: VectorE2, canvasId: number): void;
        uniformVectorE3(name: string, vector: VectorE3, canvasId: number): void;
        uniformVectorE4(name: string, vector: VectorE4, canvasId: number): void;
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
        public direction: R3;
        public color: Color;
        constructor();
    }


    class PointSize extends AbstractFacet {
        pointSize: number
        constructor(pointSize?: number);
    }

    class EulerFacet extends AbstractFacet {
        rotation: R3;
        constructor()
    }

    /**
     * A (name: string, vector: R3) pair that can be used to set a uniform variable.
     */
    class Vector3Uniform extends AbstractFacet {
        constructor(name: string, vector: R3);
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

        addFacet(facet: IAnimationTarget, facetName: string): void;
        getFacet(facetName: string): IAnimationTarget;
        removeFacet(facetName: string): void;
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

        addFacet(facet: IAnimationTarget, facetName: string): void;
        getFacet(facetName: string): IAnimationTarget
        removeFacet(facetName: string): void;

        createSlide(): Slide;
        pushSlide(slide: Slide): number;
        popSlide(): Slide;

        canForward(): boolean;
        forward(instant?: boolean, delay?: number): void;
        canBackward(): boolean;
        backward(instant?: boolean, delay?: number): void;
        advance(interval: number): void;
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

    class Vector2Animation extends Shareable implements IAnimation {
        constructor(value: VectorE2, duration?: number, callback?: () => void, ease?: string);
        apply(target: IAnimationTarget, propName: string, now: number, offset?: number);
        hurry(factor: number): void;
        skip(target: IAnimationTarget, propName: string): void;
        extra(now: number): number;
        done(target: IAnimationTarget, propName: string): boolean;
        undo(target: IAnimationTarget, propName: string): void;
    }

    class Vector3Animation extends Shareable implements IAnimation {
        constructor(value: VectorE3, duration?: number, callback?: () => void, ease?: string);
        apply(target: IAnimationTarget, propName: string, now: number, offset?: number);
        hurry(factor: number): void;
        skip(target: IAnimationTarget, propName: string): void;
        extra(now: number): number;
        done(target: IAnimationTarget, propName: string): boolean;
        undo(target: IAnimationTarget, propName: string): void;
    }

    class Spinor2Animation extends Shareable implements IAnimation {
        constructor(value: SpinorE2, duration?: number, callback?: () => void, ease?: string);
        apply(target: IAnimationTarget, propName: string, now: number, offset?: number);
        hurry(factor: number): void;
        skip(target: IAnimationTarget, propName: string): void;
        extra(now: number): number;
        done(target: IAnimationTarget, propName: string): boolean;
        undo(target: IAnimationTarget, propName: string): void;
    }

    class Spinor3Animation extends Shareable implements IAnimation {
        constructor(value: SpinorE3, duration?: number, callback?: () => void, ease?: string);
        apply(target: IAnimationTarget, propName: string, now: number, offset?: number);
        hurry(factor: number): void;
        skip(target: IAnimationTarget, propName: string): void;
        extra(now: number): number;
        done(target: IAnimationTarget, propName: string): boolean;
        undo(target: IAnimationTarget, propName: string): void;
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
    function cos<T>(x: T): T;
    function cosh<T>(x: T): T;
    function exp<T>(x: T): T;
    function norm<T>(x: T): T;
    function quad<T>(x: T): T;
    function sin<T>(x: T): T;
    function sinh<T>(x: T): T;
    function sqrt<T>(x: T): T;
    ///////////////////////////////////////////////////////////////////////////////
}

declare module 'eight'
{
    export = EIGHT;
}
