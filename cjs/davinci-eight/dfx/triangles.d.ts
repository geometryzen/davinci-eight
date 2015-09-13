import Elements = require('../dfx/Elements');
import Simplex = require('../dfx/Simplex');
declare function triangles(geometry: Simplex[], attribMap?: {
    [name: string]: {
        name?: string;
        size: number;
    };
}): Elements;
export = triangles;
