import Euclidean3 = require('../math/Euclidean3')
import VectorE3 = require('../math/VectorE3')

class Sphere {
    public center: VectorE3;
    public radius: number;
    constructor(center: VectorE3 = Euclidean3.zero, radius: number = 0) {
        this.center = center
        this.radius = radius
    }
    setFromPoints(points: VectorE3[]) {
        throw new Error("Not Implemented: Sphere.setFromPoints")
    }
}

export = Sphere
