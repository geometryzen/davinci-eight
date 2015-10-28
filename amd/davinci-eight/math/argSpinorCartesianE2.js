define(["require", "exports"], function (require, exports) {
    /**
     * Computes the principal argument of an E2 spinor from its scalar and bivector components.
     * α: The scalar part.
     * β: The bivector part.
     */
    function argSpinorCartesianE2(α, β) {
        return Math.atan2(β, α);
    }
    return argSpinorCartesianE2;
});
