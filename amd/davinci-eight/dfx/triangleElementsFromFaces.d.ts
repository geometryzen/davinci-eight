import Elements = require('../dfx/Elements');
import Face = require('../dfx/Face');
declare function triangleElementsFromFaces(faces: Face[], attribMap: {
    [name: string]: {
        name?: string;
        size: number;
    };
}): Elements;
export = triangleElementsFromFaces;
