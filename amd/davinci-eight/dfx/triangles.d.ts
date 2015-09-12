import Elements = require('../dfx/Elements');
import Simplex = require('../dfx/Simplex');
declare function triangles(faces: Simplex[], attribMap: {
    [name: string]: {
        name?: string;
        size: number;
    };
}): Elements;
export = triangles;
