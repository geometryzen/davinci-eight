import CartesianE3 from '../math/CartesianE3';
import computeFaceNormals from '../geometries/computeFaceNormals';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import quad from '../geometries/quadrilateral';
import Simplex from '../geometries/Simplex';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import R1 from '../math/R1';
import R3 from '../math/R3';
import VectorE3 from '../math/VectorE3';

export default class CuboidSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
    private _a: CartesianE3;
    private _b: CartesianE3;
    private _c: CartesianE3;
    private _isModified: boolean = true;
    constructor(a: VectorE3, b: VectorE3, c: VectorE3, k = Simplex.TRIANGLE, subdivide = 0, boundary = 0) {
        super()
        this._a = CartesianE3.fromVectorE3(a)
        this._b = CartesianE3.fromVectorE3(b)
        this._c = CartesianE3.fromVectorE3(c)
        this.k = k
        this.subdivide(subdivide)
        this.boundary(boundary)
        this.regenerate();
    }
    public get a(): CartesianE3 {
        return this._a
    }
    public set a(a: CartesianE3) {
        this._a = a
        this._isModified = true
    }
    public get b(): CartesianE3 {
        return this._b
    }
    public set b(b: CartesianE3) {
        this._b = b
        this._isModified = true
    }
    public get c(): CartesianE3 {
        return this._c
    }
    public set c(c: CartesianE3) {
        this._c = c
        this._isModified = true
    }
    public isModified() {
        return this._isModified || super.isModified()
    }
    public setModified(modified: boolean): CuboidSimplexPrimitivesBuilder {
        this._isModified = modified
        super.setModified(modified)
        return this
    }
    public regenerate(): void {
        this.setModified(false)

        // Define the anchor points relative to the origin.
        var pos: R3[] = [0, 1, 2, 3, 4, 5, 6, 7].map(function(index) { return void 0 })
        pos[0] = new R3().sub(this._a).sub(this._b).add(this._c).divByScalar(2)
        pos[1] = new R3().add(this._a).sub(this._b).add(this._c).divByScalar(2)
        pos[2] = new R3().add(this._a).add(this._b).add(this._c).divByScalar(2)
        pos[3] = new R3().sub(this._a).add(this._b).add(this._c).divByScalar(2)
        pos[4] = new R3().copy(pos[3]).sub(this._c)
        pos[5] = new R3().copy(pos[2]).sub(this._c)
        pos[6] = new R3().copy(pos[1]).sub(this._c)
        pos[7] = new R3().copy(pos[0]).sub(this._c)

        // Translate the points according to the position.
        let position = this.position
        pos.forEach(function(point: R3) {
            point.add(position)
        })

        function simplex(indices: number[]): Simplex {
            let simplex = new Simplex(indices.length - 1)
            for (var i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = pos[indices[i]]
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX] = new R1([i])
            }
            return simplex
        }
        switch (this.k) {
            case 0: {
                var points = [[0], [1], [2], [3], [4], [5], [6], [7]]
                this.data = points.map(function(point) { return simplex(point) })
            }
                break
            case 1: {
                let lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]]
                this.data = lines.map(function(line) { return simplex(line) })
            }
                break
            case 2: {
                var faces: Simplex[][] = [0, 1, 2, 3, 4, 5].map(function(index) { return void 0 })
                faces[0] = quad(pos[0], pos[1], pos[2], pos[3])
                faces[1] = quad(pos[1], pos[6], pos[5], pos[2])
                faces[2] = quad(pos[7], pos[0], pos[3], pos[4])
                faces[3] = quad(pos[6], pos[7], pos[4], pos[5])
                faces[4] = quad(pos[3], pos[2], pos[5], pos[4])
                faces[5] = quad(pos[7], pos[6], pos[1], pos[0])
                this.data = faces.reduce(function(a, b) { return a.concat(b) }, []);

                this.data.forEach(function(simplex) {
                    computeFaceNormals(simplex);
                })
            }
                break
            default: {
                // Do nothing.
            }
        }
        // Compute the meta data.
        this.check()
    }
}
