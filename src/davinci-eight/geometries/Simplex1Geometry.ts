import SimplexGeometry from '../geometries/SimplexGeometry';
import Simplex from '../geometries/Simplex';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import R3 from '../math/R3';
//import VectorN from '../math/VectorN')

/**
 * @class Simplex1Geometry
 */
export default class Simplex1Geometry extends SimplexGeometry {
    public head: R3 = new R3([1, 0, 0]);
    public tail: R3 = new R3([0, 1, 0]);
    /**
     * @class Simplex1Geometry
     * @constructor
     */
    constructor() {
        super()
        this.calculate();
    }
    public calculate(): void {
        var pos: R3[] = [0, 1].map(function(index) { return void 0 })
        pos[0] = this.tail
        pos[1] = this.head

        function simplex(indices: number[]): Simplex {
            let simplex = new Simplex(indices.length - 1)
            for (var i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = pos[indices[i]]
            }
            return simplex
        }
        this.data = [[0, 1]].map(function(line: number[]) { return simplex(line) })
        // Compute the meta data.
        this.check()
    }
}
