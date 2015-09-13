import Simplex = require('../dfx/Simplex');
declare function checkGeometry(geometry: Simplex[]): {
    [key: string]: {
        size: number;
    };
};
export = checkGeometry;
