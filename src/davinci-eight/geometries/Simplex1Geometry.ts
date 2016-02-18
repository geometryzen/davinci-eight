import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import Simplex from '../geometries/Simplex';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import R3m from '../math/R3m';

export default class Simplex1Geometry extends SimplexPrimitivesBuilder {
    public head: R3m = new R3m([1, 0, 0]);
    public tail: R3m = new R3m([0, 1, 0]);
    constructor() {
        super()
        this.calculate();
    }
    public calculate(): void {
        var pos: R3m[] = [0, 1].map(function(index) { return void 0 })
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
