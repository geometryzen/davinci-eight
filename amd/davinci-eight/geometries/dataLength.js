define(["require", "exports", '../math/G2', '../math/G3', '../math/R2', '../math/R3'], function (require, exports, G2, G3, R2, R3) {
    /**
     * This seems a bit hacky. Maybe we need an abstraction that recognizes the existence of
     * geometric numbers for vertex attributes, but allows us to extract the vector (grade-1) part?
     */
    function dataLength(source) {
        if (source instanceof G3) {
            if (source.length !== 8) {
                throw new Error("source.length is expected to be 8");
            }
            return 3;
        }
        else if (source instanceof G2) {
            if (source.length !== 4) {
                throw new Error("source.length is expected to be 4");
            }
            return 2;
        }
        else if (source instanceof R3) {
            if (source.length !== 3) {
                throw new Error("source.length is expected to be 3");
            }
            return 3;
        }
        else if (source instanceof R2) {
            if (source.length !== 2) {
                throw new Error("source.length is expected to be 2");
            }
            return 2;
        }
        else {
            // console.warn("dataLength(source: VectorN<number>): number[], source.length => " + source.length)
            return source.length;
        }
    }
    return dataLength;
});
