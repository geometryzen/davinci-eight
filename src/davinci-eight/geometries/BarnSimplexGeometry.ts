import computeFaceNormals = require('../geometries/computeFaceNormals')
import Euclidean3 = require('../math/Euclidean3')
import SimplexGeometry = require('../geometries/SimplexGeometry')
import mustBeInteger = require('../checks/mustBeInteger');
import quad = require('../geometries/quadrilateral')
import Simplex = require('../geometries/Simplex')
import Symbolic = require('../core/Symbolic')
import triangle = require('../geometries/triangle')
import R1 = require('../math/R1')
import G3 = require('../math/G3')
import VectorN = require('../math/VectorN')

/**
 * @module EIGHT
 * @submodule geometries
 * @class BarnSimplexGeometry
 */
class BarnSimplexGeometry extends SimplexGeometry {
    // FIXME: decouple from Euclidean3
    public a: G3 = G3.fromVector(Euclidean3.e1);
    public b: G3 = G3.fromVector(Euclidean3.e2);
    public c: G3 = G3.fromVector(Euclidean3.e3);
    /**
     * A barn similar to that described in "Computer Graphics using OpenGL", by Hill and Kelly.
     * @class BarnSimplexGeometry
     * @constructor
     */
    constructor() {
        super('BarnSimplexGeometry')
        this.regenerate();
    }
    protected destructor(): void {
        super.destructor()
    }
    public isModified() {
        return this.a.modified || this.b.modified || this.c.modified || super.isModified()
    }
    public setModified(modified: boolean): BarnSimplexGeometry {
        this.a.modified = modified
        this.b.modified = modified
        this.c.modified = modified
        super.setModified(modified)
        return this
    }
    public regenerate(): void {
        this.setModified(false)

        var points: G3[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(index) { return void 0 })

        points[0] = new G3().sub(this.a).sub(this.b).sub(this.c).divideByScalar(2)
        points[1] = new G3().add(this.a).sub(this.b).sub(this.c).divideByScalar(2)
        points[6] = new G3().add(this.a).sub(this.b).add(this.c).divideByScalar(2)
        points[5] = new G3().sub(this.a).sub(this.b).add(this.c).divideByScalar(2)

        points[4] = new G3().copy(points[0]).add(this.b)
        points[2] = new G3().copy(points[1]).add(this.b)
        points[7] = new G3().copy(points[6]).add(this.b)
        points[9] = new G3().copy(points[5]).add(this.b)

        points[3] = G3.lerp(points[4], points[2], 0.5).scale(2).add(this.b).divideByScalar(2)
        points[8] = G3.lerp(points[7], points[9], 0.5).scale(2).add(this.b).divideByScalar(2)

        function simplex(indices: number[]): Simplex {
            let simplex = new Simplex(indices.length - 1)
            for (var i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[Symbolic.ATTRIBUTE_POSITION] = points[indices[i]]
            }
            return simplex
        }

        switch (this.k) {
            case 0:
                {
                    var simplices = points.map(function(point) {
                        let simplex = new Simplex(0)
                        simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = point
                        return simplex;
                    })
                    this.data = simplices;
                }
                break
            case 1:
                {
                    var lines = [[0, 1], [1, 6], [6, 5], [5, 0], [1, 2], [6, 7], [5, 9], [0, 4], [4, 3], [3, 2], [9, 8], [8, 7], [9, 4], [8, 3], [7, 2]]
                    this.data = lines.map(function(line) { return simplex(line) })
                }
                break
            case 2:
                {
                    var faces: Simplex[][] = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function(index) { return void 0 })
                    faces[0] = quad(points[0], points[5], points[9], points[4])
                    faces[1] = quad(points[3], points[4], points[9], points[8])
                    faces[2] = quad(points[2], points[3], points[8], points[7])
                    faces[3] = quad(points[1], points[2], points[7], points[6])
                    faces[4] = quad(points[0], points[1], points[6], points[5])
                    faces[5] = quad(points[5], points[6], points[7], points[9])
                    faces[6] = quad(points[0], points[4], points[2], points[1])
                    faces[7] = triangle(points[9], points[7], points[8])
                    faces[8] = triangle(points[2], points[4], points[3])
                    this.data = faces.reduce(function(a, b) { return a.concat(b) }, []);

                    this.data.forEach(function(simplex) {
                        computeFaceNormals(simplex);
                    })
                }
                break
            default: {

            }
        }
        // Compute the meta data.
        this.check()
    }
}

export = BarnSimplexGeometry;
