import VectorE3 = require('../math/VectorE3');
declare class Sphere {
    center: VectorE3;
    radius: number;
    constructor(center?: VectorE3, radius?: number);
    setFromPoints(points: VectorE3[]): void;
}
export = Sphere;
