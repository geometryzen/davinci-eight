import Unit = require('../math/Unit');
declare function toStringCustom(coordinates: number[], uom: Unit, coordToString: (x: number) => string, labels: string[]): string;
export = toStringCustom;
