define(["require", "exports"], function (require, exports) {
    /**
     * Computes the principal argument of an E2 spinor from its scalar and bivector components.
     * w: The scalar part.
     * B: The bivector part.
     */
    function argSpinorCartesianE2(w, B) {
        return Math.atan2(B, w);
    }
    return argSpinorCartesianE2;
});
