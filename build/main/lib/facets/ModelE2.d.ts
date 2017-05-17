import { Geometric2 } from '../math/Geometric2';
/**
 *
 */
export declare class ModelE2 {
    /**
     * The name of the property that designates the attitude.
     */
    static PROP_ATTITUDE: string;
    /**
     * The name of the property that designates the position.
     */
    static PROP_POSITION: string;
    private _position;
    private _attitude;
    /**
     * <p>
     * A collection of properties for Rigid Body Modeling.
     * </p>
     * <p>
     * ModelE2 implements Facet required for manipulating a composite object.
     * </p>
     * <p>
     * Constructs a ModelE2 at the origin and with unity attitude.
     * </p>
     */
    constructor();
    /**
     * <p>
     * The <em>attitude</em>, a unitary spinor.
     * </p>
     */
    R: Geometric2;
    /**
     * <p>
     * The <em>position</em>, a vector.
     * The vector <b>X</b> designates the center of mass of the body (Physics).
     * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
     * </p>
     */
    X: Geometric2;
}
