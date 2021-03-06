import { Color } from './Color';
import { ContextManager } from './ContextManager';
import { Drawable } from './Drawable';
import { Geometric3 } from '../math/Geometric3';
import { Geometry } from './Geometry';
import { Material } from './Material';
import { AbstractMesh } from '../core/AbstractMesh';
import { MeshOptions } from './MeshOptions';
import { R3 } from '../math/R3';
import { Texture } from './Texture';
import { VectorE3 } from '../math/VectorE3';
/**
 * The standard pairing of a Geometry and a Material.
 */
export declare class Mesh<G extends Geometry, M extends Material> extends Drawable<G, M> implements AbstractMesh<G, M> {
    /**
     * The reference frame axis.
     */
    readonly referenceAxis: Readonly<R3>;
    /**
     * The reference frame meridian.
     */
    readonly referenceMeridian: Readonly<R3>;
    /**
     * Scratch variable for intermediate calculation value.
     * This can probably be raised to a module level constant.
     */
    private readonly canonicalScale;
    /**
     * The rotation matrix equivalent to the initial tilt spinor.
     */
    private readonly K;
    /**
     * The (cached) inverse of K.
     */
    private readonly Kinv;
    /**
     * Cached value that tells you whether the K matrix is unity.
     */
    private readonly Kidentity;
    /**
     * Initializes this Mesh with a ColorFacet ('color'), a TextureFacet ('image'), and a ModelFacet ('model').
     *
     * @param geometry An optional Geometry, which may be supplied later.
     * @param material An optional Material, which may be supplied later.
     * @param contextManager
     * @param options
     * @param levelUp The zero-based level of this instance in an inheritance hierarchy.
     */
    constructor(geometry: G, material: M, contextManager: ContextManager, options?: MeshOptions, levelUp?: number);
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     * Attitude (spinor). This is an alias for the R property.
     */
    get attitude(): Geometric3;
    set attitude(spinor: Geometric3);
    /**
     * Attitude (spinor). This is an alias for the attitude property.
     */
    get R(): Geometric3;
    set R(spinor: Geometric3);
    /**
     * Color
     */
    get color(): Color;
    set color(color: Color);
    /**
     * Texture (image).
     */
    get texture(): Texture;
    set texture(value: Texture);
    /**
     * Position (vector). This is an alias for the position property.
     */
    get X(): Geometric3;
    set X(vector: Geometric3);
    /**
     * Position (vector). This is an alias for the X property.
     */
    get position(): Geometric3;
    set position(vector: Geometric3);
    /**
     * Stress (tensor)
     */
    private get stress();
    private set stress(value);
    private getScale;
    protected getScaleX(): number;
    protected getScaleY(): number;
    protected getScaleZ(): number;
    /**
     * Implementations of setPrincipalScale are expected to call this method.
     */
    protected setScale(x: number, y: number, z: number): void;
    /**
     * Implementation of the axis (get) property.
     * Derived classes may overide to perform scaling.
     */
    protected getAxis(): Readonly<R3>;
    /**
     * Implementation of the axis (set) property.
     * Derived classes may overide to perform scaling.
     */
    protected setAxis(axis: VectorE3): void;
    /**
     * The current axis (unit vector) of the mesh.
     */
    get axis(): VectorE3;
    set axis(axis: VectorE3);
    protected getMeridian(): Readonly<R3>;
    /**
     * The current meridian (unit vector) of the mesh.
     */
    get meridian(): VectorE3;
    set meridian(value: VectorE3);
    /**
     * The name of the uniform mat4 variable in the vertex shader that receives the model matrix value.
     * The default name is `uModel`.
     */
    get modelMatrixUniformName(): string;
    set modelMatrixUniformName(name: string);
    /**
     * The name of the uniform mat3 variable in the vertex shader that receives the normal matrix value.
     * The default name is `uNormal`.
     */
    get normalMatrixUniformName(): string;
    set normalMatrixUniformName(name: string);
}
