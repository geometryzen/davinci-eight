import Face = require('../dfx/Face');
/**
 * This only works if the position property has dimensionality 3.
 */
declare function makeFaceNormalCallback(face: Face): () => number[];
export = makeFaceNormalCallback;
