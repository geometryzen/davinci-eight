import { Geometric3 } from '../math/Geometric3';
/**
 * @hidden
 */
export declare class ModelE3 {
    /**
     * The name of the property that designates the attitude.
     */
    static readonly PROP_ATTITUDE = "R";
    /**
     * The name of the property that designates the position.
     */
    static readonly PROP_POSITION = "X";
    private readonly _position;
    private readonly _attitude;
    /**
     * <p>
     * A collection of properties for Rigid Body Modeling.
     * </p>
     * <p>
     * ModelE3 implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelE3 at the origin and with unity attitude.
     * </p>
     */
    constructor();
    /**
     * <p>
     * The <em>attitude</em>, a rotor.
     * </p>
     */
    get R(): Geometric3;
    set R(attitude: Geometric3);
    /**
     * <p>
     * The <em>position</em>, a vector.
     * </p>
     */
    get X(): Geometric3;
    set X(position: Geometric3);
}
