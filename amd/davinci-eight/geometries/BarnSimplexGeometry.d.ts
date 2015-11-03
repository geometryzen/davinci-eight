import SimplexGeometry = require('../geometries/SimplexGeometry');
import G3 = require('../math/G3');
/**
 * @module EIGHT
 * @submodule geometries
 * @class BarnSimplexGeometry
 */
declare class BarnSimplexGeometry extends SimplexGeometry {
    a: G3;
    b: G3;
    c: G3;
    /**
     * A barn similar to that described in "Computer Graphics using OpenGL", by Hill and Kelly.
     * @class BarnSimplexGeometry
     * @constructor
     */
    constructor();
    isModified(): boolean;
    setModified(modified: boolean): BarnSimplexGeometry;
    regenerate(): void;
}
export = BarnSimplexGeometry;
