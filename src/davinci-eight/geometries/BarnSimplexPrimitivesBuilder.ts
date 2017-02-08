import computeFaceNormals from '../geometries/computeFaceNormals';
import SimplexPrimitivesBuilder from '../geometries/SimplexPrimitivesBuilder';
import quad from '../geometries/quadrilateral';
import Simplex from '../geometries/Simplex';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import triangle from '../geometries/triangle';
import { Geometric3 } from '../math/Geometric3';

export default class BarnSimplexPrimitivesBuilder extends SimplexPrimitivesBuilder {
    public a: Geometric3 = Geometric3.vector(1, 0, 0);
    public b: Geometric3 = Geometric3.vector(0, 1, 0);
    public c: Geometric3 = Geometric3.vector(0, 0, 1);
    constructor() {
        super();
        this.regenerate();
    }
    public isModified() {
        return this.a.modified || this.b.modified || this.c.modified || super.isModified();
    }
    public setModified(modified: boolean): BarnSimplexPrimitivesBuilder {
        this.a.modified = modified;
        this.b.modified = modified;
        this.c.modified = modified;
        super.setModified(modified);
        return this;
    }
    protected regenerate(): void {

        this.setModified(false);

        let points: Geometric3[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (index) { return void 0; });

        // Define the anchor points relative to the origin.
        points[0] = Geometric3.zero(false).sub(this.a).sub(this.b).sub(this.c).divByScalar(2);
        points[1] = Geometric3.zero(false).add(this.a).sub(this.b).sub(this.c).divByScalar(2);
        points[6] = Geometric3.zero(false).add(this.a).sub(this.b).add(this.c).divByScalar(2);
        points[5] = Geometric3.zero(false).sub(this.a).sub(this.b).add(this.c).divByScalar(2);

        points[4] = Geometric3.zero(false).copy(points[0]).add(this.b);
        points[2] = Geometric3.zero(false).copy(points[1]).add(this.b);
        points[7] = Geometric3.zero(false).copy(points[6]).add(this.b);
        points[9] = Geometric3.zero(false).copy(points[5]).add(this.b);

        points[3] = Geometric3.lerp(points[4], points[2], 0.5).scale(2).add(this.b).divByScalar(2);
        points[8] = Geometric3.lerp(points[7], points[9], 0.5).scale(2).add(this.b).divByScalar(2);

        // FIXME
        const tilt = Geometric3.scalar(1);
        points = points.map((point) => { return point.stress(this.stress).rotate(tilt).addVector(this.offset); });

        function simplex(indices: number[]): Simplex {
            const simplex = new Simplex(indices.length - 1);
            for (let i = 0; i < indices.length; i++) {
                // Why does this work? It's because of dataFromVectorN
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = points[indices[i]];
            }
            return simplex;
        }

        switch (this.k) {
            case 0: {
                var simplices = points.map(function (point) {
                    let simplex = new Simplex(0);
                    simplex.vertices[0].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = point;
                    return simplex;
                });
                this.data = simplices;
                break;
            }
            case 1: {
                var lines = [[0, 1], [1, 6], [6, 5], [5, 0], [1, 2], [6, 7], [5, 9], [0, 4], [4, 3], [3, 2], [9, 8], [8, 7], [9, 4], [8, 3], [7, 2]];
                this.data = lines.map(function (line) { return simplex(line); });
                break;
            }
            case 2: {
                var faces: Simplex[][] = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (index) { return void 0; });
                faces[0] = quad(points[0], points[5], points[9], points[4]);
                faces[1] = quad(points[3], points[4], points[9], points[8]);
                faces[2] = quad(points[2], points[3], points[8], points[7]);
                faces[3] = quad(points[1], points[2], points[7], points[6]);
                faces[4] = quad(points[0], points[1], points[6], points[5]);
                faces[5] = quad(points[5], points[6], points[7], points[9]);
                faces[6] = quad(points[0], points[4], points[2], points[1]);
                faces[7] = triangle(points[9], points[7], points[8]);
                faces[8] = triangle(points[2], points[4], points[3]);
                this.data = faces.reduce(function (a, b) { return a.concat(b); }, []);

                this.data.forEach(function (simplex) {
                    computeFaceNormals(simplex);
                });
                break;
            }
            default: {
                // Do nothing.
            }
        }
        // Compute the meta data.
        this.check();
    }
}
