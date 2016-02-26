import R3 from '../math/R3';
import computeFaceNormals from '../geometries/computeFaceNormals';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import quad from '../geometries/quadrilateral';
import Simplex from '../geometries/Simplex';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import Unit from '../math/Unit'
import Vector1 from '../math/Vector1';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';

export default class CuboidSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
    private _a: R3;
    private _b: R3;
    private _c: R3;
    private _isModified: boolean = true;
    constructor(a: VectorE3, b: VectorE3, c: VectorE3, k = Simplex.TRIANGLE, subdivide = 0, boundary = 0) {
        super()
        this._a = R3.fromVector(a, Unit.ONE)
        this._b = R3.fromVector(b, Unit.ONE)
        this._c = R3.fromVector(c, Unit.ONE)
        this.k = k
        this.subdivide(subdivide)
        this.boundary(boundary)
        this.regenerate();
    }
    public get a(): R3 {
        return this._a
    }
    public set a(a: R3) {
        this._a = a
        this._isModified = true
    }
    public get b(): R3 {
        return this._b
    }
    public set b(b: R3) {
        this._b = b
        this._isModified = true
    }
    public get c(): R3 {
        return this._c
    }
    public set c(c: R3) {
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
        var pos: Vector3[] = [0, 1, 2, 3, 4, 5, 6, 7].map(function(index) { return void 0 })
        pos[0] = new Vector3().sub(this._a).sub(this._b).add(this._c).divByScalar(2)
        pos[1] = new Vector3().add(this._a).sub(this._b).add(this._c).divByScalar(2)
        pos[2] = new Vector3().add(this._a).add(this._b).add(this._c).divByScalar(2)
        pos[3] = new Vector3().sub(this._a).add(this._b).add(this._c).divByScalar(2)
        pos[4] = new Vector3().copy(pos[3]).sub(this._c)
        pos[5] = new Vector3().copy(pos[2]).sub(this._c)
        pos[6] = new Vector3().copy(pos[1]).sub(this._c)
        pos[7] = new Vector3().copy(pos[0]).sub(this._c)

        // Perform the scale, tilt, offset active transformation.
        pos.forEach(function(point: Vector3) {
            point.scale(this.scale.x)
            point.rotate(this.tilt)
            point.add(this.offset)
        })

        function simplex(indices: number[]): Simplex {
            let simplex = new Simplex(indices.length - 1)
            for (var i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = pos[indices[i]]
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX] = new Vector1([i])
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
