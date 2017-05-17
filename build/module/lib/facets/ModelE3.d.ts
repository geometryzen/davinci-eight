import { Geometric3 } from '../math/Geometric3';
/**
 *
 */
export declare class ModelE3 {
    /**
     * The name of the property that designates the attitude.
     */
    static readonly PROP_ATTITUDE: string;
    /**
     * The name of the property that designates the position.
     */
    static readonly PROP_POSITION: string;
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
    R: Geometric3;
    /**
     * <p>
     * The <em>position</em>, a vector.
     * </p>
     */
    X: Geometric3;
}
