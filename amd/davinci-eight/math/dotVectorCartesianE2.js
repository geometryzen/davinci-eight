define(["require", "exports"], function (require, exports) {
    /**
     * Computes the dot product of the Cartesian components in a Euclidean metric
     */
    function dotVectorCartesianE2(ax, ay, bx, by) {
        return ax * bx + ay * by;
    }
    return dotVectorCartesianE2;
});
