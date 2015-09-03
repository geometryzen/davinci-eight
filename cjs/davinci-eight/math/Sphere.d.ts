import Cartesian3 = require('../math/Cartesian3');
declare class Sphere {
    center: Cartesian3;
    radius: number;
    constructor(center?: Cartesian3, radius?: number);
    setFromPoints(points: Cartesian3[]): void;
}
export = Sphere;
