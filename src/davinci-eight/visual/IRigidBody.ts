/**
 * Intentionally undocumented.
 * Enforce naming (but not type) consistency between implementations.
 */
interface IRigidBody<MASS, MV, ELECTRIC_CHARGE> {

    /**
     * Attitude (spinor)
     */
    R: MV;

    /**
     * Axis (vector)
     */
    axis: MV;

    /**
     * Angular momentum (bivector)
     */
    L: MV;

    /**
     * Mass (scalar)
     */
    m: MASS;

    /**
     * Momentum (vector)
     */
    P: MV;

    /**
     * Charge
     */
    Q: ELECTRIC_CHARGE;

    /**
     * Position (vector)
     */
    X: MV;
}

export default IRigidBody;
