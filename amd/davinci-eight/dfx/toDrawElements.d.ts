import DrawElements = require('../dfx/DrawElements');
import Simplex = require('../dfx/Simplex');
declare function toDrawElements(geometry: Simplex[], attribMap?: {
    [name: string]: {
        name?: string;
        size: number;
    };
}): DrawElements;
export = toDrawElements;
