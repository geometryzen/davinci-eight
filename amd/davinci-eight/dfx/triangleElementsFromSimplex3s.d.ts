import Elements = require('../dfx/Elements');
import Simplex3 = require('../dfx/Simplex3');
declare function triangleElementsFromSimplex3s(faces: Simplex3[], attribMap: {
    [name: string]: {
        name?: string;
        size: number;
    };
}): Elements;
export = triangleElementsFromSimplex3s;
