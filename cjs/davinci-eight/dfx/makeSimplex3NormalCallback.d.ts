import Simplex3 = require('../dfx/Simplex3');
/**
 * This only works if the position property has dimensionality 3.
 */
declare function makeSimplex3NormalCallback(face: Simplex3): () => number[];
export = makeSimplex3NormalCallback;
