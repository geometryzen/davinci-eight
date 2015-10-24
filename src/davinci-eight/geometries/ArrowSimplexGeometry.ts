import Euclidean3 = require('../math/Euclidean3')
import mustBeNumber = require('../checks/mustBeNumber');
import RevolutionSimplexGeometry = require('../geometries/RevolutionSimplexGeometry');
import SpinG3 = require('../math/SpinG3');
import R1 = require('../math/R1');
import R3 = require('../math/R3');
import VectorE3 = require('../math/VectorE3');

function signum(x: number): number {
    return x >= 0 ? +1 : -1;
}

function bigger(a: number, b: number): boolean {
    return a >= b;
}

var permutation = function(direction: VectorE3): number {
    var x = Math.abs(direction.x)
    var y = Math.abs(direction.y)
    var z = Math.abs(direction.z)
    return bigger(x, z) ? (bigger(x, y) ? 0 : 1) : (bigger(y, z) ? 1 : 2)
}

var orientation = function(cardinalIndex: number, direction: R3): number {
    return signum(direction.getComponent(cardinalIndex))
}

function nearest(direction: R3): R3 {
    var cardinalIndex = permutation(direction)
    switch (cardinalIndex) {
        case 0: {
            return new R3([orientation(cardinalIndex, direction), 0, 0])
        }
        case 1: {
            return new R3([0, orientation(cardinalIndex, direction), 0])
        }
        case 2: {
            return new R3([0, 0, orientation(cardinalIndex, direction)])
        }
    }
    return R3.copy(direction)
}

/**
 * @class ArrowSimplexGeometry
 */
class ArrowSimplexGeometry extends RevolutionSimplexGeometry {
    public lengthCone: number = 0.20;
    public radiusCone: number = 0.08;
    public radiusShaft: number = 0.01;
    /**
     * @property vector
     * @type {R3}
     */
    public vector: R3 = R3.copy(Euclidean3.e1);
    public segments: number = 12;
    /**
     * @class ArrowSimplexGeometry
     * @constructor
     */
    constructor() {
        super('ArrowSimplexGeometry')
        this.setModified(true)
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
    }
    /**
     * @method isModified
     * @return {boolean}
     */
    public isModified(): boolean {
        return this.vector.modified
    }
    /**
     * @method setModified
     * @param modified {boolean}
     * @return {ArrowSimplexGeometry}
     */
    public setModified(modified: boolean): ArrowSimplexGeometry {
        this.vector.modified = modified
        return this
    }
    /**
     * @method regenerate
     * @return {void}
     */
    public regenerate(): void {
        var length = this.vector.magnitude()
        var lengthShaft = length - this.lengthCone
        var halfLength = length / 2;
        var radiusCone = this.radiusCone
        var radiusShaft = this.radiusShaft
        var computeArrow = function(direction: R3): { points: R3[], generator: SpinG3 } {
            var cycle = permutation(direction)
            var sign = orientation(cycle, direction)
            var i = (cycle + 0) % 3
            var j = (cycle + 2) % 3
            var k = (cycle + 1) % 3
            var a = halfLength * sign
            var b = lengthShaft * sign
            // data is for an arrow pointing in the e1 direction in the xy-plane.
            var data = [
                [a, 0, 0],    // head end
                [b - a, radiusCone, 0],
                [b - a, radiusShaft, 0],
                [-a, radiusShaft, 0],
                [-a, 0, 0]    // tail end
            ]
            var points = data.map(function(point: number[]) {
                return new R3([point[i], point[j], point[k]])
            })
            // We're essentially computing the dual of the vector as the rotation generator.
            var n = nearest(direction)
            var generator = new SpinG3([n.x, n.y, n.z, 0])
            return { "points": points, "generator": generator }
        }
        var direction = R3.copy(this.vector).normalize()
        var arrow = computeArrow(direction)
        var R = new SpinG3().rotor(direction, nearest(direction))
        this.data = []
        super.revolve(arrow.points, arrow.generator, this.segments, 0, 2 * Math.PI, R)
        this.setModified(false)
    }
}

export = ArrowSimplexGeometry;
