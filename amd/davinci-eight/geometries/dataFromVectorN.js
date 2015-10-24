define(["require", "exports", '../math/G3', '../math/R2', '../math/R3'], function (require, exports, G3, R2, R3) {
    /**
     * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
     * geometric numbers fo vertex attributes, but allows us to extract the vector (grade-1) part?
     */
    function dataFromVectorN(source) {
        if (source instanceof G3) {
            var g3 = source;
            return [g3.x, g3.y, g3.z];
        }
        else if (source instanceof R3) {
            var v3 = source;
            return [v3.x, v3.y, v3.z];
        }
        else if (source instanceof R2) {
            var v2 = source;
            return [v2.x, v2.y];
        }
        else {
            // console.warn("dataFromVectorN(source: VectorN<number>): number[], source.length => " + source.length)
            return source.data;
        }
    }
    return dataFromVectorN;
});
