import Elements = require('../dfx/Elements');
import Simplex = require('../dfx/Simplex');
declare function trianglesFromSimplex3(simplices: Simplex[], attribMap: {
    [name: string]: {
        name?: string;
        size: number;
    };
}): Elements;
export = trianglesFromSimplex3;
