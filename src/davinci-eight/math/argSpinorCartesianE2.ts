/**
 * Computes the principal argument of an E2 spinor from its scalar and bivector components.
 * α: The scalar part.
 * β: The bivector part.
 */
function argSpinorCartesianE2(α: number, β: number): number {
    return Math.atan2(β, α)
}

export = argSpinorCartesianE2