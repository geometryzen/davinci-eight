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

    class IUnknownArray<T extends IUnknown> extends Shareable {
        length: number;
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
        forEach(callback: (key: string, value: V) => void)
        get(key: string): V
        getWeakref(key: string): V
        put(key: string, value: V): void
        putWeakRef(key: string, value: V): void
        remove(key: string): void
    }

    /**
     * Convenience base class for classes requiring reference counting.
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
         */
        contextFree(manager: IContextProvider): void;
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
         */
        contextLost(): void;
    }

    /**
     *
     */
    interface IContextListender extends IUnknown, IContextConsumer {

    }

    /**
     *
     */
    interface IBufferGeometry extends IUnknown {
        uuid: string;
        bind(program: Material, aNameToKeyName?: { [name: string]: string }): void;
        draw(): void;
        unbind(): void;
    }

    /**
     * The draw mode determines how the WebGL pipeline consumes and processes the vertices.
     */
    enum DrawMode {
        /**
         * Each vertex is drawn as an isolated pixel or group of pixes based upon gl_PointSize.
         */
        POINTS,
        /**
         * Vertices are consumed in pairs creating connected line segments.
         */
        LINES,
        /**
         * Connects each vertex to the next by a line segment.
         */
        LINE_STRIP,
        /**
         * Similar to LINE_STRIP except that the last vertex is connected back to the first.
         */
        LINE_LOOP,
        /**
         * Vertices are consumed in groups of three to form triangles.
         */
        TRIANGLES,
        /**
         * After the first triangle, each subsequent point make a new triangle
         * using the previous two points.
         */
        TRIANGLE_STRIP,
        /**
         * After the first triangle, each subsequent point makes a new triangle
         * that incorporates the previous point and the very first point.
         */
        TRIANGLE_FAN
    }

    /**
     * An array of attribute values associated with meta data describing how to interpret the values.
     * {values: number[]; size: number;}
     */
    interface Attribute {
        /**
         * The attribute values.
         */
        values: number[];
        /**
         * The number of values that are associated with a given vertex.
         */
        size: number;
        normalized?: boolean;
        stride?: number;
        offset?: number;
    }

    /**
     * A convenience class for constructing and validating attribute values used for drawing.
     */
    class DrawAttribute implements Attribute {
        /**
         * The attribute values.
         */
        values: number[];
        /**
         * The number of values that constitute one vertex.
         */
        size: number;
        /**
         * Constructs the attribute and validates the arguments.
         */
        constructor(values: number[], size: number);
    }

    /**
     * {mode: DrawMode; indices: number[]; attributes: {[name: string]: Attribute};}
     */
    interface Primitive {
        /**
         *
         */
        mode: DrawMode;

        /**
         *
         */
        indices: number[];

        /**
         *
         */
        attributes: { [name: string]: Attribute };
    }

    /**
     *
     */
    class DrawPrimitive implements Primitive {
        mode: DrawMode;
        indices: number[];
        attributes: { [name: string]: Attribute };
        constructor(mode: DrawMode, indices: number[], attributes: { [name: string]: Attribute });
    }

    /**
     * A simplex is the generalization of a triangle or tetrahedron to arbitrary dimensions.
     * A k-simplex is the convex hull of its k + 1 vertices.
     */
    class Simplex {
        vertices: Vertex[];
        /**
         * k: The initial number of vertices in the simplex is k + 1.
         */
        constructor(k: number);
        /**
         * An empty set can be consired to be a -1 simplex (algebraic topology).
         */
        static EMPTY: number;
        /**
         * A single point may be considered a 0-simplex.
         */
        static POINT: number;
        /**
         * A line segment may be considered a 1-simplex.
         */
        static LINE: number;
        /**
         * A 2-simplex is a triangle.
         */
        static TRIANGLE: number;
        /**
         * A 3-simplex is a tetrahedron.
         */
        static TETRAHEDRON: number;
        /**
         * A 4-simplex is a 5-cell.
         */
        static FIVE_CELL: number;
        static computeFaceNormals(simplex: Simplex, name: string);
        static indices(simplex: Simplex): number[];
        /**
         * Applies the boundary operation the specified number of times.
         * times: The number of times to apply the boundary operation.
         * triangles are converted into three lines.
         * lines are converted into two points.
         * points are converted into the empty geometry.
         */
        static boundary(geometry: Simplex[], n?: number): Simplex[];
        /**
         * Applies the subdivide operation the specified number of times.
         * times: The number of times to apply the subdivide operation.
         * The subdivide operation computes the midpoint of all pairs of vertices
         * and then uses the original points and midpoints to create new simplices
         * that span the original simplex. 
         */
        static subdivide(simplices: Simplex[], times?: number): Simplex[];
    }

    /**
     *
     */
    class Vertex {
        attributes: { [name: string]: VectorN<number> };
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
     *
     */
    function triangle(a: VectorN<number>, b: VectorN<number>, c: VectorN<number>, attributes?: { [name: string]: VectorN<number>[] }, triangles?: Simplex[]): Simplex[];

    /**
     * geometry to Primitive conversion.
     */
    function simplicesToDrawPrimitive(simplices: Simplex[], geometryMeta?: GeometryMeta): Primitive;

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
     * Utility class for managing a shader uniform variable.
     */
    class UniformLocation implements IContextProgramConsumer {
        /**
         *
         */
        constructor(manager: IContextProvider, name: string);
        contextFree(): void;
        contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
        contextLost(): void;
        uniform1f(x: number): void;
        uniform2f(x: number, y: number): void;
        uniform3f(x: number, y: number, z: number): void;
        uniform4f(x: number, y: number, z: number, w: number): void;
        /**
         * Sets the uniform location to the value of the specified vector.
         */
        vec1(coords: VectorE1): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified vector.
         */
        vec2(coords: VectorE2): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified vector.
         */
        vec3(coords: VectorE3): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified vector.
         */
        vec4(coords: VectorE4): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified matrix.
         */
        mat2(matrix: Mat2R, transpose?: boolean): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified matrix.
         */
        mat3(matrix: Mat3R, transpose?: boolean): UniformLocation;
        /**
         * Sets the uniform location to the value of the specified matrix.
         */
        mat4(matrix: Mat4R, transpose?: boolean): UniformLocation;

        vector2(coords: number[]): void;
        vector3(coords: number[]): void;
        vector4(coords: number[]): void;
        toString(): string;
    }

    /**
     *
     */
    interface ITexture extends IContextConsumer {
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
        coords: T;
        callback: () => T;
    }

    /**
     * A rational number.
     */
    class QQ {

        /**
         * The numerator.
         */
        numer: number;

        /**
         * The denominator.
         */
        denom: number;

        /**
         * Constructs a rational number from an ordered pair of integers.
         * @param numer The numerator.
         * @param denom The denominator.
         */
        constructor(numer: number, denom: number);

        /**
         * Computes the multiplicative inverse of this rational number.
         */
        inv(): QQ;

        /**
         * Determines whether this rational number is the multiplicative identity, <b>1</b>.
         */
        isOne(): boolean;

        /**
         * Determines whether this rational number is the additive identity, <b>0</b>.
         */
        isZero(): boolean;

        /**
         * Computes the additive inverse of this rational number.
         */
        neg(): QQ;

        static MINUS_ONE: QQ;

        /**
         * The multiplicative identity <b>1</b> for rational numbers.
         */
        static ONE: QQ;
        static TWO: QQ;

        /**
         * The additive identity <b>0</b> for rational numbers.
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
         *
         */
        static ONE: Dimensions;

        /**
         *
         */
        static MASS: Dimensions;

        /**
         *
         */
        static LENGTH: Dimensions;

        /**
         *
         */
        static TIME: Dimensions;

        /**
         *
         */
        static CHARGE: Dimensions;

        /**
         *
         */
        static CURRENT: Dimensions;

        /**
         *
         */
        static TEMPERATURE: Dimensions;

        /**
         *
         */
        static AMOUNT: Dimensions;

        /**
         *
         */
        static INTENSITY: Dimensions;
    }

    /**
     * The unit of measure for a physical quantity.
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
        /**
         * The labels to use for the basis vectors.
         * For G3 there must be eight (8) labels.
         * e.g.
         * [['1'], ['e1'], ['e2'], ['e3'],['e12'], ['e23'], ['e32'], ['e123']]
         * or
         * [["1"], ["i"], ["j"], ["k"], ["ij"], ["jk"], ["ki"], ["I"]]
         */
        static BASIS_LABELS: string[][];
        // FIXME: When TypeScript has been upgraded we can do this...
        // static BASIS_LABELS: (string | string[])[];
        static BASIS_LABELS_GEOMETRIC: string[][];
        static BASIS_LABELS_HAMILTON: string[][];
        static BASIS_LABELS_STANDARD: string[][];
        static BASIS_LABELS_STANDARD_HTML: string[][];

        static ampere: Euclidean3;
        static candela: Euclidean3;
        static coulomb: Euclidean3;
        static e1: Euclidean3;
        static e2: Euclidean3;
        static e3: Euclidean3;
        static kelvin: Euclidean3;
        static kilogram: Euclidean3;
        static meter: Euclidean3;
        static mole: Euclidean3;
        static one: Euclidean3;
        static second: Euclidean3;
        static zero: Euclidean3;
        /**
         * The scalar component.
         */
        α: number;
        x: number;
        y: number;
        z: number;
        /**
         * The bivector component in the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> plane.
         */
        yz: number;
        /**
         * The bivector component in the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> plane.
         */
        zx: number;
        /**
         * The bivector component in the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> plane.
         */
        xy: number;
        /**
         * The pseudoscalar component.
         */
        β: number;
        /**
         * The (optional) unit of measure.
         */
        uom: Unit;
        add(rhs: Euclidean3): Euclidean3;
        addPseudo(β: number): Euclidean3;
        addScalar(α: number): Euclidean3;
        adj(): Euclidean3;
        angle(); Euclidean3;
        conj(): Euclidean3;
        coordinate(index: number): number;
        cos(): Euclidean3;
        cosh(): Euclidean3;
        cross(vector: Euclidean3): Euclidean3;
        cubicBezier(t: number, controlBegin: GeometricE3, controlEnd: GeometricE3, endPoint: GeometricE3): Euclidean3;
        distanceTo(point: Euclidean3): number;
        div(rhs: Euclidean3): Euclidean3;
        divByScalar(α: number): Euclidean3;
        dual(): Euclidean3;
        equals(other: Euclidean3): Euclidean3;
        exp(): Euclidean3;
        ext(rhs: Euclidean3): Euclidean3;
        grade(index: number): Euclidean3;
        inv(): Euclidean3;
        isOne(): boolean;
        isZero(): boolean;
        lco(rhs: Euclidean3): Euclidean3;
        lerp(target: Euclidean3, α: number): Euclidean3;
        log(): Euclidean3;
        magnitude(): Euclidean3;
        mul(rhs: Euclidean3): Euclidean3;
        neg(): Euclidean3;
        norm(): Euclidean3;
        pow(exponent: Euclidean3): Euclidean3;
        quad(): Euclidean3;
        quadraticBezier(t: number, controlPoint: GeometricE3, endPoint: GeometricE3): Euclidean3;
        rco(rhs: Euclidean3): Euclidean3;
        reflect(n: VectorE3): Euclidean3;
        rev(): Euclidean3;
        rotate(s: SpinorE3): Euclidean3;
        scale(α: number): Euclidean3;
        scp(rhs: Euclidean3): Euclidean3;
        sin(): Euclidean3;
        sinh(): Euclidean3;
        slerp(target: Euclidean3, α: number): Euclidean3;
        sqrt(): Euclidean3;
        squaredNorm(): Euclidean3;
        sub(rhs: Euclidean3): Euclidean3;
        toExponential(): string;
        toFixed(digits?: number): string;
        toString(): string;
        direction(): Euclidean3;
        static fromSpinorE3(spinor: SpinorE3): Euclidean3;
        static fromVectorE3(vector: VectorE3): Euclidean3;
    }

    /**
     *
     */
    interface MutableMatrix<T> {
        /**
         * @property elements
         * @type T
         */
        elements: T;
        /**
         * @property callback
         * @type () => T
         */
        callback: () => T;
    }

    /**
     *
     */
    class AbstractMatrix implements MutableMatrix<Float32Array> {
        elements: Float32Array;
        dimensions: number;
        callback: () => Float32Array;
        modified: boolean;
        constructor(elements: Float32Array, dimensions: number);
    }

    /**
     * A 2x2 (square) matrix of <code>number</code>.
     */
    class Mat2R extends AbstractMatrix {

        /**
         * Constructs a new <code>Mat2R</code> wrapper around a <code>Float32Array</code>.
         * The elements are expected to be in column-major order.
         */
        constructor(elements: Float32Array);

        /**
         * Sets this matrix to the value of <code>this</code> + <code>rhs</code>.
         */
        add(rhs: Mat2R): Mat2R;

        /**
         * Creates a copy of this matrix.
         */
        clone(): Mat2R;

        /**
         * Computes the determinant of this matrix.
         */
        det(): number;

        /**
         * Sets this matrix to its multiplicative inverse.
         */
        inv(): Mat2R;

        /**
         * Determines whether this matrix is the multiplicative identity.
         */
        isOne(): boolean;

        /**
         * Determines whether this matrix is the additive identity.
         */
        isZero(): boolean;

        /**
         * Sets this matrix to the value of <code>this</code> * <code>rhs</code>.
         */
        mul(rhs: Mat2R): Mat2R;

        /**
         * Sets this matrix to the value of <code>a</code> * <code>b</code>.
         */
        mul2(a: Mat2R, b: Mat2R): Mat2R;

        /**
         * Sets this matrix to its additive inverse.
         */
        neg(): Mat2R;

        /**
         * Sets this matrix to the multiplicative identity, <em>1</em>. 
         */
        one(): Mat2R;

        /**
         * <p>
         * Sets this matrix to a matrix that effects a reflection in the
         * line normal to the unit vector <code>n</code>.
         * </p>
         * <p>
         * this ⟼ reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
         * </p>
         */
        reflection(n: VectorE1): Mat2R;

        /**
         * Computes the row corresponding to the zero-based index, <code>i</code>.
         */
        row(i: number): Array<number>;

        /**
         * Sets this matrix to the value of <code>this</code> * <code>α</code>.
         */
        scale(α: number): Mat2R;

        /**
         * Sets the elements of this matrix.
         * The parameters are in row-major order.
         */
        set(n11: number, n12: number, n21: number, n22: number): Mat2R;

        /**
         * Sets this matrix to the value of <code>this</code> - <code>rhs</code>.
         */
        sub(rhs: Mat2R): Mat2R;

        /**
         * Computes a string representation of this matrix in exponential notation.
         */
        toExponential(): string;

        /**
         * Computes a string representation of this matrix with a fixed number of digits.
         */
        toFixed(digits?: number): string;

        /**
         * Computes a string representation of this matrix.
         */
        toString(): string;

        /**
         * Sets this matrix to the additive identity, <em>0</em>. 
         */
        zero(): Mat2R;

        /**
         * Creates a matrix that is the multiplicative identity, <em>1</em>. 
         */
        static one(): Mat2R;

        /**
         * <P>
         * Creates a matrix that effects a reflection in the line normal
         * to the unit vector <code>n</code>.
         * </p>
         * <p>
         * reflection(<b>n</b>) = I - 2 * <b>n</b><sup>T</sup> * <b>n</b>
         * </p>
         */
        static reflection(n: VectorE1): Mat2R;

        /**
         * Creates a matrix that is the additive identity, <em>0</em>. 
         */
        static zero(): Mat2R;
    }

    /**
     * A 3x3 (square) matrix of <code>number</code>.
     */
    class Mat3R extends AbstractMatrix {

        /**
         * Constructs a new <code>Mat3R</code> wrapper around a <code>Float32Array</code>.
         * The elements are expected to be in column-major order.
         */
        constructor(elements: Float32Array);

        /**
         * Sets this matrix to the value of <code>this</code> + <code>rhs</code>.
         */
        add(rhs: Mat3R): Mat3R;

        /**
         * Creates a copy of this matrix.
         */
        clone(): Mat3R;

        /**
         *
         */
        copy(m: Mat3R): Mat3R;

        /**
         *
         */
        det(): number;

        /**
         *
         */
        inv(): Mat3R;

        /**
         *
         */
        isOne(): boolean;

        /**
         *
         */
        isZero(): boolean;

        /**
         *
         */
        mul(rhs: Mat3R): Mat3R;

        /**
         *
         */
        mul2(a: Mat3R, b: Mat3R): Mat3R;

        /**
         *
         */
        neg(): Mat3R;

        /**
         * Sets this matrix to the identity element for multiplication, <b>1</b>.
         */
        one(): Mat4R;

        reflection(n: VectorE3): Mat3R;
        row(i: number): number[];
        scale(alpha: number): Mat3R;
        set(m11: number, m12: number, m13: number, m21: number, m22: number, m23: number, m31: number, m32: number, m33: number): Mat3R;
        sub(rhs: Mat3R): Mat3R;
        toString(): string;
        transpose(): Mat3R;
        zero(): Mat3R;

        /**
         *
         */
        normalFromMat4R(matrix: Mat4R): void;

        /**
         * Generates a new identity matrix.
         */
        static one(): Mat3R;
        static reflection(n: VectorE2): Mat3R;
        static zero(): Mat3R;
    }

    /**
     *
     */
    class Mat4R extends AbstractMatrix {
        constructor(elements: Float32Array);

        /**
         * Returns a copy of this matrix instance.
         */
        clone(): Mat4R;

        /**
         *
         */
        compose(scale: VectorE3, attitude: SpinorE3, position: VectorE3): Mat4R;

        /**
         *
         */
        copy(matrix: Mat4R): Mat4R;

        /**
         * Computes the determinant of the matrix.
         */
        det(): number;

        /**
         *
         */
        frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4R;

        /**
         *
         */
        invert(m: Mat4R, throwOnSingular?: boolean): Mat4R;

        /**
         *
         */
        mul(rhs: Mat4R): Mat4R;

        /**
         *
         */
        mul2(a: Mat4R, b: Mat4R): Mat4R;

        /**
         * Generates a new identity matrix.
         */
        static one(): Mat4R;

        /**
         * Sets this matrix to the identity element for multiplication, <b>1</b>.
         */
        one(): Mat4R;

        /**
         *
         */
        reflection(n: VectorE3): Mat4R;

        /**
         *
         */
        rmul(lhs: Mat4R): Mat4R;

        /**
         *
         */
        rotate(spinor: SpinorE3): Mat4R;

        /**
         * Generates a new rotation matrix.
         */
        static rotation(spinor: SpinorE3): Mat4R;

        /**
         *
         */
        rotation(spinor: SpinorE3): Mat4R;

        /**
         *
         */
        rotationAxis(axis: VectorE3, angle: number): Mat4R;

        /**
         *
         */
        row(i): Array<number>;

        /**
         *
         */
        scale(scale: VectorE3): Mat4R;

        /**
         *
         */
        scaleXYZ(scale: VectorE3): Mat4R;

        /**
         * Generates a new scaling matrix.
         */
        static scaling(scale: VectorE3): Mat4R;

        /**
         *
         */
        scaling(scale: VectorE3): Mat4R;

        /**
         *
         */
        toFixed(digits?: number): string;

        /**
         *
         */
        toString(): string;

        /**
         *
         */
        translate(displacement: VectorE3): Mat4R;

        /**
         * Generates a new translation matrix.
         */
        static translation(vector: VectorE3): Mat4R;

        /**
         *
         */
        translation(displacement: VectorE3): Mat4R;

        /**
         *
         */
        transpose(): Mat4R;

        /**
         * Creates a new matrix with all elements zero.
         */
        static zero(): Mat4R;
    }

    /**
     *
     */
    interface VectorE1 {
        /**
         * The Cartesian x-coordinate.
         */
        x: number;
    }

    /**
     *
     */
    interface VectorE2 {
        /**
         * The Cartesian x-coordinate or <em>abscissa</em>.
         */
        x: number;
        /**
         * The Cartesian y-coordinate or <em>ordinate</em>.
         */
        y: number;
    }

    /**
     *
     */
    interface SpinorE2 {
        /**
         * The scalar component of this spinor.
         */
        α: number;

        /**
         * The bivector component of this spinor.
         */
        xy: number;
    }

    /**
     *
     */
    interface GeometricE2 extends Pseudo, Scalar, SpinorE2, VectorE2 {
    }

    /**
     * The Geometric Algebra of the Euclidean plane
     */
    class G2 extends VectorN<number> implements GeometricE2 {
        /**
         * The labels to use for the basis vectors.
         * For G2 there must be four (4) labels.
         * The first is the scalar symbol.
         * The second is the first vector symbol.
         * The third is the second vector symbol.
         * The fourth is the symbol for the pseudoscalar.
         * e.g.
         * [['1'], ['e1'], ['e2'], ['e12']]
         * or
         * [['1'], ['e1'], ['e2'], ['I']]
         * For compass directions you might use
         * [['1'], ['E'], ['N'], ['ccw']]
         * You can also use different symbols depending upon the sign.
         * The symbol for the negative sign goes on the left, positive on the right.
         * [['1'], ['W','E'], ['S','N'], ['clockwise','ccw']]
         * You can also use Unicode symbols
         * 
         */
        static BASIS_LABELS: string[][];
        // FIXME: When TypeScript has been upgraded we can do this...
        // static BASIS_LABELS: (string | string[])[];

        /**
         * Constructs a <code>G2</code>.
         * The multivector is initialized to zero.
         */
        constructor();
        /**
         * The coordinate corresponding to the unit standard basis scalar.
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
         * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
         */
        β: number;
        xy: number;

        /**
         * <p>
         * <code>this ⟼ this + M * α</code>
         * </p>
         * @param M
         * @param α
         */
        add(M: GeometricE2, α?: number): G2;

        /**
         * <p>
         * <code>this ⟼ this + v * α</code>
         * </p>
         * @param v
         * @param α
         */
        addVector(v: VectorE2, α?: number): G2;

        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @param a
         * @param b
         */
        add2(a: GeometricE2, b: GeometricE2): G2;

        /**
         * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
         */
        angle(): G2;

        /**
         *
         */
        clone(): G2;

        /**
         * Sets this <em>multivector</em> to its <em>Clifford conjugate</em>.
         * <p>
         * <code>this ⟼ conj(this)</code>
         * </p>
         */
        conj(): G2;

        /**
         * Sets this multivector to be a copy of another multivector.
         * <p>
         * <code>this ⟼ copy(M)</code>
         * </p>
         * @param M
         */
        copy(M: GeometricE2): G2;

        /**
         * Sets this multivector to be a copy of a spinor.
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         * @param spinor
         */
        copySpinor(spinor: SpinorE2): G2;
        /**
         * Sets this multivector to be a copy of a vector.
         * <p>
         * <code>this ⟼ copyVector(vector)</code>
         * </p>
         * @param vector
         */
        copyVector(vector: VectorE2): G2;

        /**
         * Sets this multivector to the result of division by another multivector.
         * <p>
         * <code>this ⟼ this / m</code>
         * </p>
         * @param m
         */
        div(m: GeometricE2): G2;

        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         * @param α
         */
        divByScalar(α: number): G2;

        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @param a
         * @param b
         */
        div2(a: SpinorE2, b: SpinorE2): G2;

        /**
         * <p>
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * Notice that the dual of a vector is related to the spinor by the right-hand rule.
         * @param m The vector whose dual will be used to set this spinor.
         */
        dual(m: VectorE2): G2;

        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         */
        exp(): G2;

        /**
         * <p>
         * <code>this ⟼ this ^ m</code>
         * </p>
         * @param m
         */
        ext(m: GeometricE2): G2;

        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @param a
         * @param b
         */
        ext2(a: GeometricE2, b: GeometricE2): G2;

        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         */
        inv(): G2;

        /**
         * Sets this multivector to the left contraction with another multivector.
         * <p>
         * <code>this ⟼ this << m</code>
         * </p>
         * @param m
         */
        lco(m: GeometricE2): G2;

        /**
         * Sets this multivector to the left contraction of two multivectors. 
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @param a
         * @param b
         */
        lco2(a: GeometricE2, b: GeometricE2): G2;

        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @param target
         * @param α
         */
        lerp(target: GeometricE2, α: number): G2;

        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @param a
         * @param b
         * @param α
         */
        lerp2(a: GeometricE2, b: GeometricE2, α: number): G2;

        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         */
        log(): G2;

        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         */
        magnitude(): G2;

        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @param m
         */
        mul(m: GeometricE2): G2;

        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @param a
         * @param b
         */
        mul2(a: GeometricE2, b: GeometricE2): G2;

        /**
         * <p>
         * <code>this ⟼ -1 * this</code>
         * </p>
         */
        neg(): G2;

        /**
         * <p>
         * <code>this ⟼ sqrt(this * conj(this))</code>
         * </p>
         */
        norm(): G2;

        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         */
        direction(): G2;

        /**
         * <p>
         * <code>this ⟼ this | ~this = scp(this, rev(this))</code>
         * </p>
         */
        quad(): G2;

        /**
         * Computes the squared norm, scp(A, rev(A)).
         */
        squaredNorm(): G2;

        /**
         * Sets this multivector to the right contraction with another multivector.
         * <p>
         * <code>this ⟼ this >> m</code>
         * </p>
         * @param m
         */
        rco(m: GeometricE2): G2;

        /**
         * Sets this multivector to the right contraction of two multivectors.
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @param a
         * @param b
         */
        rco2(a: GeometricE2, b: GeometricE2): G2;

        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @param n
         */
        reflect(n: VectorE2): G2;

        /**
         * <p>
         * <code>this ⟼ rev(this)</code>
         * </p>
         */
        rev(): G2;

        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @param R
         */
        rotate(R: SpinorE2): G2;

        /**
         * <p>
         * Sets this multivector to a rotor representing a rotation from a to b.
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         * </p>
         * @param a The <em>from</em> vector.
         * @param b The <em>to</em> vector.
         */
        rotorFromDirections(a: VectorE2, b: VectorE2): G2;

        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @param B
         * @param θ
         */
        rotorFromGeneratorAngle(B: SpinorE2, θ: number): G2;

        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @param α
         */
        scale(α: number): G2;

        /**
         * <p>
         * <code>this ⟼ scp(this, m)</code>
         * </p>
         * @param m
         */
        scp(m: GeometricE2): G2;

        /**
         * <p>
         * <code>this ⟼ scp(a, b)</code>
         * </p>
         * @param a
         * @param b
         */
        scp2(a: GeometricE2, b: GeometricE2): G2;

        /**
         * <p>
         * <code>this ⟼ a * b = a · b + a ^ b</code>
         * </p>
         * Sets this G2 to the geometric product a * b of the vector arguments.
         * @param a
         * @param b
         */
        spinor(a: VectorE2, b: VectorE2): G2;
        /**
         * <p>
         * <code>this ⟼ this - M * α</code>
         * </p>
         * @param M
         * @param α
         */
        sub(M: GeometricE2, α?: number): G2;
        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @param a
         * @param b
         */
        sub2(a: GeometricE2, b: GeometricE2): G2;

        /**
         * Returns a string representing the number in exponential notation.
         * @param fractionDigits
         */
        toExponential(): string;

        /**
         * Returns a string representing the number in fixed-point notation.
         * @param fractionDigits
         */
        toFixed(fractionDigits?: number): string;

        /**
         * Returns a string representation of the number.
         */
        toString(): string;

        /**
         * The identity element for addition, <b>0</b>.
         */
        static zero: G2;

        /**
         * The identity element for multiplication, <b>1</b>.
         */
        static one: G2;

        /**
         * Basis vector corresponding to the <code>x</code> coordinate.
         */
        static e1: G2;

        /**
         * Basis vector corresponding to the <code>y</code> coordinate.
         */
        static e2: G2;

        /**
         * Basis vector corresponding to the <code>β</code> coordinate.
         */
        static I: G2;

        /**
         * Creates a copy of a multivector.  
         * @param M
         */
        static copy(M: GeometricE2): G2;

        /**
         * Creates a copy of a scalar.
         * @param α
         */
        static fromScalar(α: number): G2;

        /**
         * Creates a copy of a spinor.
         * @param spinor
         */
        static fromSpinor(spinor: SpinorE2): G2;

        /**
         * Creates a copy of a vector.
         * @param vector
         */
        static fromVector(vector: VectorE2): G2;

        /**
         * Linear interpolation of two multivectors.
         * <code>A + α * (B - A)</code>
         * @param A
         * @param B
         * @param α
         */
        static lerp(A: GeometricE2, B: GeometricE2, α: number): G2;

        /**
         * Computes the rotor corresponding to a rotation from vector <code>a</code> to vector <code>b</code>.
         * @param a
         * @param b
         */
        static rotorFromDirections(a: VectorE2, b: VectorE2): G2;
    }

    /**
     *
     */
    class VectorN<T> implements Mutable<T[]> {
        callback: () => T[];
        coords: T[];
        modified: boolean;
        constructor(coords: T[], modified?: boolean, size?: number);
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
        x: number;
        constructor(coords?: number[], modified?: boolean);
    }

    /**
     *
     */
    class R2 extends VectorN<number> implements VectorE2 {
        x: number;
        y: number;
        constructor(coords?: number[], modified?: boolean);
        add(v: VectorE2): R2;
        add2(a: VectorE2, b: VectorE2): R2;
        copy(v: VectorE2): R2;
        magnitude(): number;
        scale(s: number): R2;
        squaredNorm(): number;
        set(x: number, y: number): R2;
        sub(v: VectorE2): R2;
        sub2(a: VectorE2, b: VectorE2): R2;
    }

    interface Scalar {
        α: number;
    }

    interface Pseudo {
        β: number;
    }

    /**
     * The even sub-algebra of <code>G3</code>.
     */
    interface SpinorE3 extends Scalar {
        /**
         * The bivector component in the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> plane.
         */
        yz: number;

        /**
         * The bivector component in the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> plane.
         */
        zx: number;

        /**
         * The bivector component in the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> plane.
         */
        xy: number;

        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         */
        magnitude(): SpinorE3;

        /**
         * The <em>squared norm</em>, as a <code>number</code>.
         */
        squaredNorm(): SpinorE3;
    }

    /**
     * The coordinates for a multivector in 3D in geometric Cartesian basis.
     */
    interface GeometricE3 extends Pseudo, Scalar, SpinorE3, VectorE3 {

    }
    /**
     * A mutable multivector in 3D with a Euclidean metric.
     */
    class G3 extends VectorN<number> implements GeometricE3 {
        /**
         * The coordinate corresponding to the unit standard basis scalar.
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
         * The bivector component in the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> plane.
         */
        yz: number;
        /**
         * The bivector component in the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> plane.
         */
        zx: number;
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
         */
        xy: number;
        /**
         * The pseudoscalar coordinate of the multivector.
           */
        β: number;
        /**
         * Constructs a <code>G3</code>.
         * The multivector is initialized to zero.
         */
        constructor();

        /**
         * <p>
         * <code>this ⟼ this + M * α</code>
         * </p>
         * @param M
         * @param α
         */
        add(M: GeometricE3, α?: number): G3;

        /**
         * <p>
         * <code>this ⟼ a + b</code>
         * </p>
         * @param a
         * @param b
         */
        add2(a: GeometricE3, b: GeometricE3): G3;

        addPseudo(β: number): G3;

        addScalar(α: number): G3;

        /**
         * <p>
         * <code>this ⟼ this + v * α</code>
         * </p>
         * @param v
         * @param α
         */
        addVector(v: VectorE3, α?: number): G3;

        align(m: GeometricE3): G3;

        /**
         * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
         */
        angle(): G3;

        /**
         *
         */
        clone(): G3;

        /**
         * Sets this <em>multivector</em> to its <em>Clifford conjugate</em>.
         * <p>
         * <code>this ⟼ conj(this)</code>
         * </p>
         */
        conj(): G3;

        /**
         * <p>
         * <code>this ⟼ copy(M)</code>
         * </p>
         */
        copy(M: GeometricE3): G3;

        /**
         * this ⟼ copy(α)
         */
        copyScalar(α: number): G3;

        /**
         * <p>
         * <code>this ⟼ copy(spinor)</code>
         * </p>
         */
        copySpinor(spinor: SpinorE3): G3;

        /**
         * <p>
         * <code>this ⟼ copyVector(vector)</code>
         * </p>
         */
        copyVector(vector: VectorE3): G3;

        /**
         * Sets this multivector to the result of division by another multivector.
         * <p>
         * <code>this ⟼ this / m</code>
         * </p>
         */
        div(m: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ this / α</code>
         * </p>
         */
        divByScalar(α: number): G3;

        /**
         * <p>
         * <code>this ⟼ a / b</code>
         * </p>
         * @param a
         * @param b
         */
        div2(a: SpinorE3, b: SpinorE3): G3;

        /**
         * <p>
         * <code>this ⟼ dual(m) = I * m</code>
         * </p>
         * Notice that the dual of a vector is related to the spinor by the right-hand rule.
         * @param m The vector whose dual will be used to set this spinor.
         */
        dual(m: VectorE3): G3;

        /**
         * <p>
         * <code>this ⟼ e<sup>this</sup></code>
         * </p>
         */
        exp(): G3;

        /**
         * <p>
         * <code>this ⟼ this ^ m</code>
         * </p>
         * @param m
         */
        ext(m: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ a ^ b</code>
         * </p>
         * @param a
         * @param b
         */
        ext2(a: GeometricE3, b: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ conj(this) / quad(this)</code>
         * </p>
         */
        inv(): G3;

        /**
         * Sets this multivector to the left contraction with another multivector.
         * <p>
         * <code>this ⟼ this << m</code>
         * </p>
         * @param m
         */
        lco(m: GeometricE3): G3;

        /**
         * Sets this multivector to the left contraction of two multivectors. 
         * <p>
         * <code>this ⟼ a << b</code>
         * </p>
         * @param a
         * @param b
         */
        lco2(a: GeometricE3, b: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ this + α * (target - this)</code>
         * </p>
         * @param target
         * @param α
         */
        lerp(target: GeometricE3, α: number): G3;

        /**
         * <p>
         * <code>this ⟼ a + α * (b - a)</code>
         * </p>
         * @param a {GeometricE3}
         * @param b {GeometricE3}
         * @param α {number}
         */
        lerp2(a: GeometricE3, b: GeometricE3, α: number): G3;

        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         */
        log(): G3;

        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         */
        magnitude(): G3;

        /**
         * <p>
         * <code>this ⟼ this * s</code>
         * </p>
         * @param m {GeometricE3}
         */
        mul(m: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * @param a
         * @param b
         */
        mul2(a: GeometricE3, b: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ -1 * this</code>
         * </p>
         */
        neg(): G3;

        /**
         * <p>
         * <code>this ⟼ sqrt(this * conj(this))</code>
         * </p>
         */
        norm(): G3

        /**
         * <p>
         * <code>this ⟼ this / magnitude(this)</code>
         * </p>
         */
        direction(): G3

        /**
         * <p>
         * <code>this ⟼ this | ~this = scp(this, rev(this))</code>
         * </p>
         */
        quad(): G3;

        /**
         * Sets this multivector to the right contraction with another multivector.
         * <p>
         * <code>this ⟼ this >> m</code>
         * </p>
         * @param m
         */
        rco(m: GeometricE3): G3;

        /**
         * Sets this multivector to the right contraction of two multivectors.
         * <p>
         * <code>this ⟼ a >> b</code>
         * </p>
         * @param a
         * @param b
         */
        rco2(a: GeometricE3, b: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ - n * this * n</code>
         * </p>
         * @param n
         */
        reflect(n: VectorE3): G3;

        /**
         * <p>
         * <code>this ⟼ rev(this)</code>
         * </p>
         */
        rev(): G3;

        /**
         * <p>
         * <code>this ⟼ R * this * rev(R)</code>
         * </p>
         * @param R
         */
        rotate(R: SpinorE3): G3;

        /**
         * <p>
         * <code>this = ⟼ exp(- dual(a) * θ / 2)</code>
         * </p>
         * @param axis
         * @param θ
         */
        rotorFromAxisAngle(axis: VectorE3, θ: number): G3;

        /**
         * <p>
         * Sets this multivector to a rotor representing a rotation from a to b.
         * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
         * </p>
         * @param a The <em>from</em> vector.
         * @param b The <em>to</em> vector.
         */
        rotorFromDirections(a: VectorE3, b: VectorE3): G3;

        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @param B
         * @param θ
         */
        rotorFromGeneratorAngle(B: SpinorE3, θ: number): G3;

        /**
         * <p>
         * <code>this ⟼ this * α</code>
         * </p>
         * @param α
         */
        scale(α: number): G3;

        /**
         * <p>
         * <code>this ⟼ scp(this, m)</code>
         * </p>
         * @param m
         */
        scp(m: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ scp(a, b)</code>
         * </p>
         * @param a
         * @param b
         */
        scp2(a: GeometricE3, b: GeometricE3): G3;

        /**
         * <p>
         * <code>this ⟼ a * b</code>
         * </p>
         * Sets this G3 to the geometric product a * b of the vector arguments.
         * @param a
         * @param b
         */
        spinor(a: VectorE3, b: VectorE3): G3;

        /**
         * Computes the <em>squared norm</em> of this multivector.
         */
        squaredNorm(): G3;

        /**
         * <p>
         * <code>this ⟼ this - M * α</code>
         * </p>
         * @param M
         * @param α
         */
        sub(M: GeometricE3, α?: number): G3;

        /**
         * <p>
         * <code>this ⟼ a - b</code>
         * </p>
         * @param a
         * @param b
         */
        sub2(a: GeometricE3, b: GeometricE3): G3;

        /**
         * Returns a string representing the number in exponential notation.
         */
        toExponential(): string;

        /**
         * Returns a string representing the number in fixed-point notation.
         * @param fractionDigits
         */
        toFixed(fractionDigits?: number): string;

        /**
         * Returns a string representation of the number.
         */
        toString(): string;

        /**
         * The identity element for addition, <b>0</b>.
         */
        static zero: G3;

        /**
         * The identity element for multiplication, <b>1</b>.
         */
        static one: G3;

        /**
         * Basis vector corresponding to the <code>x</code> coordinate.
         */
        static e1: G3;

        /**
         * Basis vector corresponding to the <code>y</code> coordinate.
         */
        static e2: G3;

        /**
         * Basis vector corresponding to the <code>z</code> coordinate.
         */
        static e3: G3;

        /**
         * Basis vector corresponding to the <code>β</code> coordinate.
         */
        static I: G3;

        /**
         * Creates a copy of a spinor.
         * @param spinor
         */
        static fromSpinor(spinor: SpinorE3): G3;

        /**
         * Creates a copy of a vector.
         * @param vector
         */
        static fromVector(vector: VectorE3): G3;

        /**
         * Computes the rotor that rotates vector <code>a</code> to vector <code>b</code>.
         * @param a The <em>from</em> vector.
         * @param b The <em>to</em> vector.
         */
        static rotorFromDirections(a: VectorE3, b: VectorE3): G3;
    }

    /**
     * The even sub-algebra of <code>G3</code>.
     */
    class SpinG3 extends VectorN<number> implements SpinorE3 {
        /**
         * The bivector component in the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> plane.
         */
        yz: number;

        /**
         * The bivector component in the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> plane.
         */
        zx: number;

        /**
         * The bivector component in the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> plane.
         */
        xy: number;

        /**
         * The scalar component.
         */
        α: number;

        /**
         * Constructs a <code>Spin3</code> with value <em>1</em>
         */
        constructor();
        /**
         * this ⟼ this + spinor * α
         */
        add(spinor: SpinorE3, α?: number): SpinG3;

        add2(a: SpinorE3, b: SpinorE3): SpinG3;

        /**
         * The bivector whose area (magnitude) is θ/2, where θ is the radian measure. 
         */
        angle(): SpinG3;

        /**
         * Computes a copy of this spinor.
         */
        clone(): SpinG3;

        /**
         * Sets this spinor to be a copy of the <code>spinor</code> argument.
         * this ⟼ copy(spinor)
         */
        copy(spinor: SpinorE3): SpinG3;

        divByScalar(scalar: number): SpinG3;

        /**
         * this ⟼ dual(v) = I * v
         */
        dual(v: VectorE3): SpinG3;

        /**
         * this ⟼ exp(this)
         */
        exp(): SpinG3;
        inv(): SpinG3;
        lerp(target: SpinorE3, α: number): SpinG3;

        /**
         * <p>
         * <code>this ⟼ log(this)</code>
         * </p>
         */
        log(): SpinG3;

        magnitude(): SpinG3;

        mul(rhs: SpinorE3): SpinG3;

        /**
         * Sets this SpinG3 to the geometric product of the vectors a and b, a * b.
         */
        mul2(a: SpinorE3, b: SpinorE3): SpinG3;

        /**
         * this ⟼ this / magnitude(this)
         * <em>s.direction()</em> scales the target spinor, <em>s</em>, so that it has unit magnitude.
         */
        direction(): SpinG3;

        /**
         * this ⟼ this * α
         */
        scale(α: number): SpinG3;

        squaredNorm(): SpinG3;

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
        rotorFromDirections(a: VectorE3, b: VectorE3): SpinG3;

        /**
         * <p>
         * <code>this = ⟼ exp(- B * θ / 2)</code>
         * </p>
         * @param B {SpinorE3}
         * @param θ {number}
         */
        rotorFromGeneratorAngle(B: SpinorE3, θ: number): SpinG3;

        /**
         * this ⟼ this - spinor * α
         */
        sub(spinor: SpinorE3, α?: number): SpinG3;
        /**
         *
         */
        sub2(a: SpinorE3, b: SpinorE3): SpinG3;
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
    class CartesianE3 implements VectorE3 {
        x: number;
        y: number;
        z: number;
        /**
         *
         */
        constructor()
        magnitude(): number;
        squaredNorm(): number;
        static zero: CartesianE3;
        static e1: CartesianE3;
        static e2: CartesianE3;
        static e3: CartesianE3;
        static fromVector(vector: VectorE3);
        static direction(vector: VectorE3);
    }

    /**
     *
     */
    class R3 extends VectorN<number> implements VectorE3 {
        x: number;
        y: number;
        z: number;
        constructor(coordinates?: number[], modified?: boolean);
        /**
         * this += alpha * vector
         */
        add(vector: VectorE3, alpha?: number): R3;
        add2(a: VectorE3, b: VectorE3): R3;
        applyMatrix4(m: Mat4R): R3;
        applyMatrix(m: Mat3R): R3;
        clone(): R3;
        copy(v: VectorE3): R3;
        static copy(vector: VectorE3): R3;
        copyCoordinates(coordinates: number[]): R3;
        cross(v: VectorE3): R3;
        cross2(a: VectorE3, b: VectorE3): R3;
        distanceTo(point: VectorE3): number;
        divByScalar(rhs: number): R3;
        static dot(a: VectorE3, b: VectorE3): number;
        dot(v: VectorE3): number;
        lerp(target: VectorE3, α: number): R3;
        static lerp(a: VectorE3, b: VectorE3, α: number): R3;
        lerp2(a: VectorE3, b: VectorE3, α: number): R3;
        /**
         * Computes the <em>square root</em> of the <em>squared norm</em>.
         */
        magnitude(): number;
        neg(): R3;
        direction(): R3;
        quadranceTo(point: VectorE3): number;
        static random(): R3;
        reflect(n: VectorE3): R3;
        rotate(rotor: SpinorE3): R3;
        scale(rhs: number): R3;
        set(x: number, y: number, z: number): R3;
        squaredNorm(): number;
        sub(rhs: VectorE3): R3;
        sub2(a: VectorE3, b: VectorE3): R3;
        toExponential(): string;
        toFixed(digits?: number): string;
        toString(): string;
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
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(coords?: number[], modified?: boolean);
    }

    /**
     *
     */
    interface FacetVisitor {
        uniform1f(name: string, x: number): void;
        uniform2f(name: string, x: number, y: number): void;
        uniform3f(name: string, x: number, y: number, z: number): void;
        uniform4f(name: string, x: number, y: number, z: number, w: number): void;
        mat2(name: string, matrix: Mat2R, transpose: boolean): void;
        mat3(name: string, matrix: Mat3R, transpose: boolean): void;
        mat4(name: string, matrix: Mat4R, transpose: boolean): void;
        vec2(name: string, vector: VectorE2): void;
        vec3(name: string, vector: VectorE3): void;
        vec4(name: string, vector: VectorE4): void;
        vector2(name: string, coords: number[]): void;
        vector3(name: string, coords: number[]): void;
        vector4(name: string, coords: number[]): void;
    }

    /**
     * A provider of a collection of 'uniform' variables for use in a WebGL program.
     */
    interface Facet extends IAnimationTarget {
        setProperty(name: string, value: number[]): Facet;
        setUniforms(visitor: FacetVisitor): void;
    }

    /**
     * Provides the uniform for the model to view coordinates transformation.
     */
    interface View extends Facet {
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
    interface IPrimitivesBuilder<T> {
        setPosition(position: VectorE3): T
        toPrimitives(): Primitive[];
    }
    /**
     *
     */
    interface IAxialGeometry<T> extends IPrimitivesBuilder<T> {
        setAxis(axis: VectorE3): T
    }
    /**
     * A geometry holds a list of simplices.
     */
    class SimplexPrimitivesBuilder extends PrimitivesBuilder {
        /**
         * The geometry as a list of simplices. These may be triangles, lines or points.
         */
        data: Simplex[];
        /**
         * Summary information on the simplices such as dimensionality and sizes for attributes.
         * This same data structure may be used to map vertex attribute names to program names.
         */
        meta: GeometryMeta;
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
        constructor();
        regenerate(): void;
        isModified(): boolean;
        setModified(modified: boolean): SimplexPrimitivesBuilder;
        setPosition(position: VectorE3): SimplexPrimitivesBuilder;
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
        boundary(times?: number): SimplexPrimitivesBuilder;
        /**
         * Updates the `meta` property by scanning the vertices.
         */
        check(): SimplexPrimitivesBuilder;
        /**
         * Subdivides the simplices of the geometry to produce finer detail.
         * times: The number of times to subdivide. Default is one (1).
         */
        subdivide(times?: number): SimplexPrimitivesBuilder;
        /**
         * Computes and returns the primitives used to draw in WebGL.
         */
        toPrimitives(): Primitive[];
    }

    /**
     *
     */
    interface ColorRGB {
        r: number;
        g: number;
        b: number;
    }

    /**
     *
     */
    interface ColorRGBA extends ColorRGB {
        α: number;
    }

    /**
     *
     */
    class Color extends VectorN<number> implements ColorRGB {
        static black: Color;
        static blue: Color;
        static green: Color;
        static cyan: Color;
        static red: Color;
        static magenta: Color;
        static yellow: Color;
        static white: Color;
        r: number;
        g: number;
        b: number;
        luminance: number;
        constructor(r: number, g: number, b: number);
        clone(): Color;
        interpolate(target: ColorRGB, alpha: number): Color;

        static fromColor(color: ColorRGB): Color;
        static fromCoords(coords: number[]): Color;
        static fromHSL(H: number, S: number, L: number): Color;
        static fromRGB(red: number, green: number, blue: number): Color;
        static interpolate(a: ColorRGB, b: ColorRGB, alpha: number): Color;
    }

    /**
     * A collection of primitives, one for each canvas.
     */
    interface IGraphicsBuffers extends IContextConsumer {
        /**
         *
         */
        draw(program: Material): void;
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
    function perspectiveMatrix(fov: number, aspect: number, near: number, far: number, matrix?: Mat4R): Mat4R;

    /**
     * Creates and returns a View.
     */
    function createView(): View;

    /**
     * Computes a view matrix.
     */
    function viewMatrix(eye: VectorE3, look: VectorE3, up: VectorE3, matrix?: Mat4R): Mat4R;

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
     * attributes
     * uniformsList
     * bindings Used for setting indices.
     */
    function smartProgram(attributes: { [name: string]: AttribMetaInfo }, uniforms: { [name: string]: UniformMetaInfo }, bindings?: string[]): Material;

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
    interface IContextProvider extends IUnknown {
        createArrayBuffer(): ShareableWebGLBuffer;
        createElementArrayBuffer(): ShareableWebGLBuffer;
        createBufferGeometry(primitive: Primitive, usage?: number): IBufferGeometry;
        createTexture2D(): ITexture2D;
        createTextureCubeMap(): ITextureCubeMap;
        gl: WebGLRenderingContext;
        canvas: HTMLCanvasElement;
    }

    /**
     * Constructs and returns a IContextProvider.
     * canvas: The HTML5 Canvas to be used for WebGL rendering.
     * attributes: Optional attributes for initializing the context.
     */
    function webgl(canvas: HTMLCanvasElement, attributes?: WebGLContextAttributes): IContextProvider;

    /**
     * A set of <em>state variables</em> for graphics modeling in Euclidean 2D space.
     */
    class ModelE2 extends Shareable implements IAnimationTarget {
        /**
         * The <em>position</em>, a vector. Initialized to <em>0</em>
         */
        X: G2;
        /**
         * The <em>attitude</em>, a unitary spinor. Initialized to <em>1</em>.
         */
        R: G2;
        /**
         * Constructs a <code>ModelE2</code> at the origin and with unity attitude.
         * Initializes <code>X</code> to <code>0</code>.
         * Initializes <code>R</code> to <code>1</code>.
         */
        constructor();
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): ModelE2;
    }

    /**
     * A collection of properties governing GLSL uniforms for Computer Graphics Modeling.
     */
    class ModelFacet extends Shareable implements Facet, IAnimationTarget {
        /**
         * The position, a vector.
         */
        X: G3;
        /**
         * The attitude, a unitary spinor.
         */
        R: G3;
        /**
         * The overall scale.
         */
        scaleXYZ: R3;
        /**
         * Constructs a ModelFacet at the origin and with unity attitude.
         */
        constructor();
        incRef(): ModelFacet;
        decRef(): ModelFacet;
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): ModelFacet;
        setUniforms(visitor: FacetVisitor): void;
    }

    /**
     * The publish date of the latest version of the library.
     */
    var LAST_MODIFIED: string;

    /**
     * May be set to 'true' after initializing to ensure that rendering
     * is not encumbered by assertions and the like.
     */
    var fastPath: boolean;

    /**
     * Deterimies whether the library strictly inforces invariants.
     * This may have a performance penalty.
     */
    var strict: boolean;

    /**
     * Determines whether the library provides verbose logging comments.
     * These can be useful for understanding how the library works and for debugging.
     */
    var verbose: boolean;

    /**
     * The version string of the davinci-eight module.
     */
    var VERSION: string;

    /**
     * Convenience function for document.getElementById(elementId), followed
     * be casting to HTMLCanvasElement.
     */
    function getCanvasElementById(elementId: string, document?: Document): HTMLCanvasElement;

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
    class GraphicsProgramSymbols {
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
        static UNIFORM_REFLECTION_ONE_MATRIX: string;
        static UNIFORM_REFLECTION_TWO_MATRIX: string;
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
    interface ContextController {
        start(canvas: HTMLCanvasElement): void
        stop(): void;
        // TODO: kill
        // kill(): void;
    }

    /**
     *
     */
    interface IDrawList extends IContextConsumer, IUnknown {

        add(mesh: Mesh): void;

        draw(ambients: Facet[]): void;

        /**
         * Gets a mesh that matches the specified test.
         */
        findOne(match: (mesh: Mesh) => boolean): Mesh;

        /**
         * Gets a mesh element with the specified name.
         */
        findOneByName(name: string): Mesh;

        /**
         * Gets a collection of mesh elements by name.
         */
        findByName(name: string): IUnknownArray<Mesh>;

        remove(mesh: Mesh): void;

        traverse(callback: (mesh: Mesh) => void): void;
    }

    /**
     *
     */
    class Scene implements IDrawList {
        constructor()
        add(mesh: Mesh): void
        addRef(): number
        subscribe(monitor: IContextMonitor): void
        contextFree(manager: IContextProvider): void
        contextGain(manager: IContextProvider): void
        contextLost(): void
        unsubscribe(): void
        draw(ambients: Facet[]): void
        findOne(match: (mesh: Mesh) => boolean): Mesh
        findOneByName(name: string): Mesh
        findByName(name: string): IUnknownArray<Mesh>
        release(): number
        remove(mesh: Mesh): void
        traverse(callback: (mesh: Mesh) => void): void
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
        material: Material;
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
        contextFree(manager: IContextProvider): void;
        contextGain(manager: IContextProvider): void;
        contextLost(): void;
        draw(): void;
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
         *
         */
        setUniforms(visitor: FacetVisitor): void
        release(): number
    }

    /**
     * A wrapper around a <code>WebGLRenderingContext</code> with additional capabilities.
     * <ul>
     *   <li>Shareable resources using reference counting.</li>
     *   <li>Monitoring for <code>webglcontextlost</code> and <code>webglcontextrestored</code>.</li>
     * </ul>
     */
    class WebGLRenderer extends Shareable implements ContextController, IContextMonitor {

        /**
         * If the canvas property has not been initialized by calling `start()`,
         * then any attempt to access this property will trigger the construction of
         * a new HTML canvas element which will remain in effect for this WebGLRenderer
         * until `stop()` is called.
         */
        canvas: HTMLCanvasElement;

        /**
         *
         */
        commands: IUnknownArray<IContextCommand>;

        /**
         * @param gl The underlying <code>WebGLRenderingContext</code>.
         */
        gl: WebGLRenderingContext;

        /**
         * Constructs a <code>WebGLRenderer</code> using <code>WebGLContextAttributes</code>.
         */
        constructor(attributes?: WebGLContextAttributes);

        /**
         *
         */
        addContextListener(user: IContextConsumer): void;

        /**
         * <p>
         * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
         * <p>
         */
        clearColor(red: number, green: number, blue: number, alpha: number): WebGLRenderer;

        /**
         *
         */
        contextFree(manager: IContextProvider): void;

        /**
         *
         */
        contextGain(manager: IContextProvider): void;

        /**
         *
         */
        contextLost(): void;

        /**
         *
         */
        createArrayBuffer(): ShareableWebGLBuffer;

        /**
         *
         */
        createBufferGeometry(primitive: Primitive, usage?: number): IBufferGeometry;

        /**
         *
         */
        createElementArrayBuffer(): ShareableWebGLBuffer;

        /**
         *
         */
        createTexture2D(): ITexture2D;

        /**
         *
         */
        createTextureCubeMap(): ITextureCubeMap;

        /**
         * Turns off specific WebGL capabilities for this context.
         */
        disable(capability: Capability): WebGLRenderer;

        /**
         * Turns on specific WebGL capabilities for this context.
         */
        enable(capability: Capability): WebGLRenderer;

        /**
         * Performs the configured animation prolog such as clearing color and depth buffers.
         */
        prolog(): void;

        /**
         *
         */
        render(drawList: IDrawList, ambients: Facet[]): void;

        /**
         *
         */
        removeContextListener(user: IContextConsumer): void;

        /**
         * Initializes the WebGL context for the specified <code>canvas</code>.
         */
        start(canvas: HTMLCanvasElement): WebGLRenderer;

        /**
         * Terminates the <code>WebGLRenderingContext</code> for the underlying canvas.
         */
        stop(): WebGLRenderer;

        /**
         *
         */
        synchronize(user: IContextConsumer): void;

        /**
         * Defines what part of the canvas will be used in rendering the drawing buffer.
         * @param x
         * @param y
         * @param width
         * @param height
         */
        viewport(x: number, y: number, width: number, height: number): WebGLRenderer;
    }

    class PrimitivesBuilder {
        /**
         * The local <code>position</code> property used for geometry generation.
         /*
        position: CartesianE3;
        /**
         *
         */
        useTextureCoords: boolean;
        /**
         *
         */
        constructor();
        enableTextureCoords(enable: boolean): PrimitivesBuilder;
        setPosition(position: VectorE3): PrimitivesBuilder;
        toPrimitives(): Primitive[];
    }

    class AxialPrimitivesBuilder extends PrimitivesBuilder {
        axis: CartesianE3;
        sliceAngle: number;
        sliceStart: VectorE3;
        constructor(axis: VectorE3);
    }

    class AxialSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
        axis: R3;
        constructor(axis: VectorE3)
    }

    class SliceSimplexGeometry extends AxialSimplexPrimitivesBuilder {
        constructor(axis: VectorE3)
    }

    class ArrowPrimitivesBuilder extends AxialPrimitivesBuilder implements IPrimitivesBuilder<ArrowPrimitivesBuilder> {
        /**
         *
         */
        heightCone: number;
        /**
         *
         */
        radiusCone: number;
        /**
         *
         */
        radiusShaft: number;
        /**
         *
         */
        thetaSegments: number;
        /**
         *
         */
        constructor(axis: VectorE3, sliceStart?: VectorE3);
        setPosition(position: VectorE3): ArrowPrimitivesBuilder;
        toPrimitives(): Primitive[];
    }

    class VortexSimplexGeometry extends SimplexPrimitivesBuilder {
        generator: SpinG3;
        constructor()
    }
    /**
     *
     */
    class RingBuilder extends AxialPrimitivesBuilder implements IAxialGeometry<RingBuilder> {
        innerRadius: number;
        outerRadius: number;
        constructor();
        setAxis(axis: VectorE3): RingBuilder
        setPosition(position: VectorE3): RingBuilder
        toPrimitives(): Primitive[];
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
    class BarnSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
        a: R3;
        b: R3;
        c: R3;
        k: number;
        constructor();
    }

    class BoxGeometry extends Geometry {
        constructor(width: number, height: number, depth: number);
    }

    /**
     *
     */
    class ConeGeometry extends AxialPrimitivesBuilder implements IPrimitivesBuilder<ConeGeometry> {
        radius: number;
        height: number;
        constructor(axis: VectorE3);
        setPosition(position: VectorE3): ConeGeometry;
        toPrimitives(): Primitive[];
    }

    /**
     *
     */
    class ConeSimplexGeometry extends SliceSimplexGeometry {
        radiusTop: number;
        radius: number;
        height: number;
        openTop: boolean;
        openBottom: boolean;
        thetaStart: number;
        thetaLength: number;
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
    class CuboidPrimitivesBuilder extends PrimitivesBuilder implements IPrimitivesBuilder<CuboidPrimitivesBuilder> {
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
        setPosition(position: VectorE3): CuboidPrimitivesBuilder;
        toPrimitives(): Primitive[];
    }
    /**
     *
     */
    class CuboidSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
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

    class CylinderGeometry extends AxialPrimitivesBuilder implements IPrimitivesBuilder<CylinderGeometry> {
        radius: number;
        height: number;
        constructor(axis: VectorE3);
        setPosition(position: VectorE3): CylinderGeometry
        toPrimitives(): Primitive[];
    }

    class DodecahedronSimplexGeometry extends PolyhedronBuilder {
        constructor(radius?: number, detail?: number);
    }

    class OctahedronSimplexGeometry extends PolyhedronBuilder {
        constructor(radius?: number, detail?: number);
    }

    class IcosahedronSimplexGeometry extends PolyhedronBuilder {
        constructor(radius?: number, detail?: number);
    }

    class PolyhedronBuilder extends SimplexPrimitivesBuilder {
        constructor(vertices: number[], indices: number[], radius?: number, detail?: number);
    }

    class RevolutionSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
        constructor(points: R3[], generator: SpinG3, segments: number, phiStart: number, phiLength: number, attitude: SpinG3)
    }

    class Simplex1Geometry extends SimplexPrimitivesBuilder {
        head: R3;
        tail: R3;
        constructor();
        calculate(): void;
    }

    /**
     *
     */
    class SphereGeometry extends SliceSimplexGeometry implements IAxialGeometry<SphereGeometry> {
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
        setAxis(axis: VectorE3): SphereGeometry;
        setPosition(position: VectorE3): SphereGeometry;
    }

    /**
     *
     */
    class GridSimplexGeometry extends SimplexPrimitivesBuilder {
        constructor(parametricFunction: (u: number, v: number) => VectorE3, uSegments: number, vSegments: number)
    }

    class TetrahedronGeometry extends Geometry {
        constructor(radius?: number)
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
    class Material {
        program: WebGLProgram;
        programId: string;
        vertexShader: string;
        fragmentShader: string;
        addRef(): number;
        attributes(): { [name: string]: AttribLocation };
        contextFree(manager: IContextProvider): void;
        contextGain(manager: IContextProvider): void;
        contextLost(): void;
        constructor(name: string, monitors?: IContextMonitor[]);
        disableAttrib(name: string): void;
        enableAttrib(name: string): void;
        release(): number;
        uniform1f(name: string, x: number): void;
        uniform2f(name: string, x: number, y: number): void;
        uniform3f(name: string, x: number, y: number, z: number): void;
        uniform4f(name: string, x: number, y: number, z: number, w: number): void;
        mat2(name: string, matrix: Mat2R, transpose: boolean): void;
        mat3(name: string, matrix: Mat3R, transpose: boolean): void;
        mat4(name: string, matrix: Mat4R, transpose: boolean): void;
        uniforms(): { [name: string]: UniformLocation };
        vec2(name: string, vector: VectorE2): void;
        vec3(name: string, vector: VectorE3): void;
        vec4(name: string, vector: VectorE4): void;
        use(): void;
        vector2(name: string, coords: number[]): void;
        vector3(name: string, coords: number[]): void;
        vector4(name: string, coords: number[]): void;
    }

    class Geometry extends Shareable implements IGraphicsBuffers {
        constructor(primitives: Primitive[]);
        contextFree(manager: IContextProvider): void;
        contextGain(manager: IContextProvider): void;
        contextLost(): void;
        draw(material: Material): void;
    }

    /**
     * A collection of primitives, a single graphics program, and some facets.
     * The primitives provide attribute arguments to the graphics program.
     * The facets provide uniform arguments to the graphics program. 
     */
    class Mesh extends Shareable {

        /**
         *
         */
        geometry: Geometry;

        /**
         *
         */
        material: Material;

        /**
         * A user-assigned name that allows the composite object to be found.
         */
        name: string;

        /**
         * Determines whether this Mesh will be rendered.
         */
        visible: boolean;

        /**
         *
         */
        constructor(geometry: Geometry, material: Material, type?: string);

        /**
         *
         */
        subscribe(monitor: IContextMonitor): void;

        /**
         *
         */
        unsubscribe(): void;

        setUniforms(): void;
        draw(ambients: Facet[]): void;

        contextFree(manager: IContextProvider): void;
        contextGain(manager: IContextProvider): void;
        contextLost(): void;

        /**
         * Gets a facet of this composite object by name.
         * Facets provide uniform arguments to the graphics program.
         */
        getFacet(name: string): Facet;

        /**
         * Sets a facet of this composite object by name.
         * Facets provide uniform arguments to the graphics program.
         */
        setFacet(name: string, facet: Facet): void;
    }

    /**
     * A <code>Material</code> based upon scripts in a DOM.
     */
    class HTMLScriptsMaterial extends Material {
        /**
         * Constructs a <code>Material</code> using scripts in a Document Object Model (DOM).
         * scriptIds: The id properties of the script elements. Defaults to [].
         * dom:       The document object model. Defaults to document.
         */
        constructor(scriptIds?: string[], dom?: Document);
    }

    /**
     *
     */
    class PointMaterial extends Material {
        constructor();
    }

    /**
     *
     */
    class LineMaterial extends Material {
        constructor();
    }

    /**
     *
     */
    class MeshMaterial extends Material {
        constructor();
    }

    /**
     * Utility for generating a <code>Material</code> based upon supplied
     * hints such as the attribute and uniform parameters.
     */
    class GraphicsProgramBuilder {
        /**
         * Constructs the <code>GraphicsProgramBuilder</code>.
         * The lifecycle for using this generator is
         * <ol>
         * <li>Create an instance of the <code>GraphicsProgramBuilder.</code></li>
         * <li>Make calls to the <code>attribute</code> and/or <code>uniform</code> methods in any order.</li>
         * <li>Call the <code>build</code> method to create the <code>Material</code>.</li>
         * </ol>
         * The same builder instance may be reused to create other programs.
         */
        constructor();

        /**
         * Declares that the material should have an `attribute`
         * with the specified name and size.
         */
        public attribute(name: string, size: number): GraphicsProgramBuilder;

        /**
         * Declares that the material should have a `uniform` with the specified name and type.
         * The <code>type</code> parameter is the GLSL type. e.g. 'float', 'vec3', 'mat2'
         */
        public uniform(name: string, type: string): GraphicsProgramBuilder;

        /**
         * Creates a Material. This may contain multiple <code>WebGLProgram</code>(s),
         * one for each context supplied. The generated program is compiled and linked
         * for each context in response to context gain and loss events.
         */
        build(contexts?: IContextMonitor[]): Material;
    }

    class AbstractFacet extends Shareable implements Facet {
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): Facet;
        setUniforms(visitor: FacetVisitor): void;
    }

    class AmbientLight extends AbstractFacet {
        color: Color;
        constructor(color: ColorRGB);
        destructor(): void;
    }

    /**
     *
     */
    class ColorFacet extends AbstractFacet implements ColorRGBA {
        r: number;
        g: number;
        b: number;
        α: number
        constructor(name?: string);
        incRef(): ColorFacet;
        decRef(): ColorFacet;
        scaleRGB(α: number): ColorFacet;
        scaleRGBA(α: number): ColorFacet;
        setColorRGB(color: ColorRGB): ColorFacet;
        setColorRGBA(color: ColorRGBA): ColorFacet;
        setRGB(red: number, green: number, blue: number): ColorFacet;
        setRGBA(red: number, green: number, blue: number, alpha: number): ColorFacet;
    }

    /**
     * <code>DirectionalLight</code> provides two uniform values.
     * GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION
     * GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR
     */
    class DirectionalLight extends AbstractFacet {
        /**
         * The <em>direction</em> (unit vector) in which the light is travelling.
         */
        direction: R3;
        /**
         * The <em>color</em> of the light.
         */
        color: Color;
        /**
         * Constructs a <code>DirectionalLight</code>.
         * @param direction The initial direction.
         * @param color The initial color.
         */
        constructor(direction: VectorE3, color: ColorRGB);
        /**
         * Sets the <code>direction</code> property by copying a vector.
         * The direction is normalized to be a unit vector.
         * @param direction
         */
        setDirection(direction: VectorE3): DirectionalLight;
    }


    class PointSizeFacet extends AbstractFacet {
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
    class Vector3Facet extends AbstractFacet {
        constructor(name: string, vector: R3);
    }

    /**
     *
     */
    class ReflectionFacetE2 extends Shareable implements Facet {
        /**
         * The vector perpendicular to the (hyper-)plane of reflection.
         */
        public normal: R2;

        /**
         * @param name The name of the uniform variable associated with this facet.
         */
        constructor(name: string);

        /**
         * @param name
         */
        getProperty(name: string): Array<number>;

        /**
         * @param name
         * @param value
         */
        setProperty(name: string, value: Array<number>): ReflectionFacetE2;

        /**
         *
         */
        setUniforms(visitor: FacetVisitor): void;
    }

    /**
     *
     */
    class ReflectionFacetE3 extends Shareable implements Facet {
        /**
         * The vector perpendicular to the (hyper-)plane of reflection.
         *
         */
        public normal: R3;

        /**
         * @param name The name of the uniform variable associated with this facet.
         */
        constructor(name: string);

        /**
         * @param name
         */
        getProperty(name: string): Array<number>;

        /**
         * @param name
         * @param value
         */
        setProperty(name: string, value: Array<number>): ReflectionFacetE3;

        /**
         *
         */
        setUniforms(visitor: FacetVisitor): void;
    }

    // commands
    interface IContextCommand extends IContextConsumer {
    }

    /**
     * The enumerated blending factors for use with <code>WebGLBlendFunc</code>.
     * Assuming destination with RGBA values of (R<sub>d</sub>, G<sub>d</sub>, B<sub>d</sub>, A<sub>d</sub>),
     * and source fragment with values (R<sub>s</sub>, G<sub>s</sub>, B<sub>s</sub>, A<sub>s</sub>),
     * <ul>
     * <li>R<sub>result</sub> = R<sub>s</sub> * S<sub>r</sub> + R<sub>d</sub> * D<sub>r</sub></li>
     * </ul>
     */
    enum BlendFactor {
        /**
         *
         */
        DST_ALPHA,

        /**
         *
         */
        DST_COLOR,

        /**
         *
         */
        ONE,

        /**
         *
         */
        ONE_MINUS_DST_ALPHA,

        /**
         *
         */
        ONE_MINUS_DST_COLOR,

        /**
         *
         */
        ONE_MINUS_SRC_ALPHA,

        /**
         *
         */
        ONE_MINUS_SRC_COLOR,

        /**
         *
         */
        SRC_ALPHA,

        /**
         *
         */
        SRC_ALPHA_SATURATE,

        /**
         *
         */
        SRC_COLOR,

        /**
         *
         */
        ZERO
    }

    /**
     * `blendFunc(sfactor: number, dfactor: number): void`
     */
    class WebGLBlendFunc extends Shareable implements IContextCommand {
        sfactor: BlendFactor;
        dfactor: BlendFactor;
        constructor(sfactor: BlendFactor, dfactor: BlendFactor);

        /**
         *
         */
        contextFree(manager: IContextProvider): void;

        /**
         *
         */
        contextGain(manager: IContextProvider): void;

        /**
         *
         */
        contextLost(): void;
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
         *
         */
        contextFree(manager: IContextProvider): void;
        /**
         *
         */
        contextGain(manager: IContextProvider): void;
        /**
         *
         */
        contextLost(): void;
    }

    /**
     * A capability that may be enabled or disabled for a <code>WebGLRenderingContext</code>.
     */
    enum Capability {
        /**
         * Blend computed fragment color values with color buffer values.
         */
        BLEND,

        /**
         * Let polygons be culled.
         */
        CULL_FACE,

        /**
         * Enable updates of the depth buffer.
         */
        DEPTH_TEST,

        /**
         * Add an offset to the depth values of a polygon's fragments.
         */
        POLYGON_OFFSET_FILL,

        /**
         * Abandon fragments outside a scissor rectangle.
         */
        SCISSOR_TEST
    }

    /**
     * `disable(capability: number): void`
     */
    class WebGLDisable extends Shareable implements IContextCommand {
        /**
         *
         */
        constructor(capability: Capability);
        /**
         *
         */
        contextFree(manager: IContextProvider): void;
        /**
         *
         */
        contextGain(manager: IContextProvider): void;
        /**
         *
         */
        contextLost(): void;
    }

    /**
     * `enable(capability: number): void`
     */
    class WebGLEnable extends Shareable implements IContextCommand {
        /**
         *
         */
        constructor(capability: Capability);
        /**
         *
         */
        contextFree(manager: IContextProvider): void;
        /**
         *
         */
        contextGain(manager: IContextProvider): void;
        /**
         *
         */
        contextLost(): void;
    }

    ///////////////////////////////////////////////////////////////////////////////

    interface IAnimationTarget extends IUnknown {
        uuid: string;
        getProperty(name: string): number[];
        setProperty(name: string, value: number[]): IAnimationTarget;
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
        start: number;
        duration: number;
        fraction: number;
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
        toDrawPrimitive(): Primitive;
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
    class RigidBody extends Mesh {

        /**
         *
         */
        axis: G3;

        /**
         * Mass
         */
        m: G3;

        /**
         * Color
         */
        color: Color;

        /**
         * Angular Momentum (bivector)
         */
        L: G3;

        /**
         * Momentum
         */
        P: G3;

        /**
         * Attitude (spinor)
         */
        R: G3;

        /**
         * Position (vector)
         */
        X: G3;
    }

    class Arrow extends RigidBody {
        constructor()
        length: number;
    }

    class Ball extends RigidBody {
        constructor()
        radius: number;
    }

    class Box extends RigidBody {
        constructor()
        width: number;
        height: number;
        depth: number;
    }

    class Rod extends RigidBody {
        constructor()
        radius: number;
        length: number;
    }

    class Tetrahedron extends RigidBody {
        constructor()
        radius: number;
    }

    class Trail {

        /**
         *
         */
        maxLength: number

        /**
         *
         */
        spacing: number

        /**
         * Constructs a trail for the specified rigidBody.
         * The maximum number of trail points defaults to 10.
         */
        constructor(rigidBody: RigidBody, maxLength?: number);

        /**
         * Records the graphics model variables.
         */
        snapshot(): void;

        /**
         * @method draw
         * @param ambients {Facet[]}
         * @return {void}
         */
        draw(ambients: Facet[]): void;
    }

    function vector(x: number, y: number, z: number): G3;
    ///////////////////////////////////////////////////////////////////////////////
    /**
     * The universal cosine function, cos.
     * Returns the cosine of the argument.
     * If the argument is an object with a cos method, calls the method.
     * Otherwise calls Math.cos(x).
     */
    function cos<T>(x: T): T;
    function cosh<T>(x: T): T;

    /**
     * <p>
     * Returns e (the base of natural logarithms) raised to a power.
     * </p>
     * <p>
     * The <em>exponential function</em> of a multivector A is denoted by exp A or e<sup>A</sup>
     * and defined by
     * </p>
     * <p>
     * exp A = e<sup>A</sup> = Σ<sub>k=0</sub> A<sup>k</sup> / k!
     * </p>
     * <p>
     * = 1 + A / 1! + A<sup>2</sup> / 2! + ...
     * </p>
     */
    function exp<T>(x: T): T;

    /**
     * Returns the natural logarithm (base e) of a number.
     */
    function log<T>(x: T): T;
    function norm<T>(x: T): T;
    function quad<T>(x: T): T;
    /**
     * The universal sine function, sin.
     * Returns the sine of the argument.
     * If the argument is an object with a sin method, calls the method.
     * Otherwise calls Math.sin(x).
     */
    function sin<T>(x: T): T;
    function sinh<T>(x: T): T;
    function sqrt<T>(x: T): T;
    ///////////////////////////////////////////////////////////////////////////////
}

declare module 'eight' {
    export = EIGHT;
}
