import GeometryContainer from '../core/GeometryContainer';
import GeometryElements from '../core/GeometryElements';
import isDefined from '../checks/isDefined';
import mustBeNumber from '../checks/mustBeNumber';
import PolyhedronBuilder from '../geometries/PolyhedronBuilder';
import TetrahedronGeometryOptions from './TetrahedronGeometryOptions';
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive';

//
// Imagine 4 vertices sitting on some of the vertices of a cube of side-length 2.
// The vertices are:
// [0] (+1, +1, +1)
// [1] (-1, -1, +1)
// [2] (-1, +1, -1)
// [3] (+1, -1, -1)
//
// This is seen to form a tetrahedron because all of the side lengths are
// the same, sqrt(8), because the side length of the cube is 2. So we have
// four equilateral triangles stiched together to form a tetrahedron.
//
const vertices: number[] = [
    +1, +1, +1, -1, -1, +1, -1, +1, -1, +1, -1, -1
]

//
// The following 12 indices comprise four triangles.
// Each triangle is traversed counter-clockwise as seen from the outside. 
//
const indices: number[] = [
    2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
];

/**
 * A convenience class for creating a tetrahedron geometry.
 */
export default class TetrahedronGeometry extends GeometryContainer {

    /**
     *
     * @param options
     * @param levelUp
     */
    constructor(options: TetrahedronGeometryOptions = {}, levelUp = 0) {
        super(options.tilt, options.engine, levelUp + 1)
        this.setLoggingName('TetrahedronGeometry')
        const radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 1.0
        const builder = new PolyhedronBuilder(vertices, indices, radius)
        const ps = builder.toPrimitives()
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const p = ps[i]
            const geometry = new GeometryElements(vertexArraysFromPrimitive(p), options.tilt, options.engine)
            this.addPart(geometry)
            geometry.release()
        }
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1)
    }
}
