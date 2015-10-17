import arc3 = require('../geometries/arc3')
import Cartesian3 = require('../math/Cartesian3')
import Geometry = require('../geometries/Geometry')
import Simplex = require('../geometries/Simplex')
import SliceGeometry = require('../geometries/SliceGeometry');
import Spinor3 = require('../math/Spinor3')
import Spinor3Coords = require('../math/Spinor3Coords')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

// TODO: The caps don't have radial segments!

function computeVertices(radius: number, height: number, axis: Cartesian3, start: Cartesian3, angle: number, generator: Spinor3Coords, heightSegments: number, thetaSegments: number, points: Vector3[], vertices: number[][], uvs: Vector2[][]) {

    let begin = Vector3.copy(start).scale(radius)
    let halfHeight = Vector3.copy(axis).scale(0.5 * height)

    /**
     * A displacement in the direction of axis that we must move for each height step.
     */
    let stepH = Vector3.copy(axis).normalize().scale(height / heightSegments)

    for (var i = 0; i <= heightSegments; i++) {
        /**
         * The displacement to the current level.
         */
        let dispH = Vector3.copy(stepH).scale(i).sub(halfHeight)
        let verticesRow: number[] = [];
        let uvsRow: Vector2[] = [];
        /**
         * Interesting that the v coordinate is 1 at the base and 0 at the top!
         * This is because i originally went from top to bottom.
         */
        let v = (heightSegments - i) / heightSegments
        /**
         * arcPoints.length => thetaSegments + 1
         */
        var arcPoints = arc3(begin, angle, generator, thetaSegments)
        /**
         * j < arcPoints.length => j <= thetaSegments
         */
        for (var j = 0, jLength = arcPoints.length; j < jLength; j++) {
            var point = arcPoints[j].add(dispH)
            /**
             * u will vary from 0 to 1, because j goes from 0 to thetaSegments
             */
            let u = j / thetaSegments;
            points.push(point);
            verticesRow.push(points.length - 1);
            uvsRow.push(new Vector2([u, v]));
        }
        vertices.push(verticesRow);
        uvs.push(uvsRow);
    }

}

/**
 * @class CylinderGeometry
 * @extends SliceGeometry
 */
class CylinderGeometry extends SliceGeometry {
    public radius: number;
    public height: number;
    public openTop: boolean;
    public openBottom: boolean;
    /**
     * <p>
     * Constructs a Cylindrical Shell.
     * </p>
     * <p>
     * Sets the <code>sliceAngle</code> property to <code>2 * Math.PI</p>.
     * </p>
     * @class CylinderGeometry
     * @constructor
     * @param radius [number = 1]
     * @param height [number = 1]
     * @param axis [Cartesian3 = Vector3.e2]
     * @param openTop [boolean = false]
     * @param openBottom [boolean = false]
     */
    constructor(
        radius: number = 1,
        height: number = 1,
        axis: Cartesian3 = Vector3.e2,
        openTop: boolean = false,
        openBottom: boolean = false
    ) {
        super('CylinderGeometry', axis, void 0, void 0)
        this.radius = radius
        this.height = height
        this.openTop = openTop
        this.openBottom = openBottom
        this.setModified(true)
    }
    public regenerate(): void {
        this.data = []
        let radius = this.radius
        //let height = this.height
        let heightSegments = this.flatSegments
        let thetaSegments = this.curvedSegments
        var generator: Spinor3Coords = new Spinor3().dual(this.axis)

        let heightHalf = this.height / 2;

        var points: Vector3[] = [];
        // The double array allows us to manage the i,j indexing more naturally.
        // The alternative is to use an indexing function.
        let vertices: number[][] = [];
        let uvs: Vector2[][] = [];

        computeVertices(radius, this.height, this.axis, this.sliceStart, this.sliceAngle, generator, heightSegments, thetaSegments, points, vertices, uvs)

        var na: Vector3;
        var nb: Vector3;
        // sides
        for (let j = 0; j < thetaSegments; j++) {
            if (radius !== 0) {
                na = Vector3.copy(points[vertices[0][j]]);
                nb = Vector3.copy(points[vertices[0][j + 1]]);
            }
            else {
                na = Vector3.copy(points[vertices[1][j]]);
                nb = Vector3.copy(points[vertices[1][j + 1]]);
            }
            // FIXME: This isn't geometric.
            na.setY(0).normalize();
            nb.setY(0).normalize();
            for (let i = 0; i < heightSegments; i++) {
                /**
                 *  2-------3
                 *  |       | 
                 *  |       |
                 *  |       |
                 *  1-------4
                 */
                let v1: number = vertices[i][j];
                let v2: number = vertices[i + 1][j];
                let v3: number = vertices[i + 1][j + 1];
                let v4: number = vertices[i][j + 1];
                // The normals for 1 and 2 are the same.
                // The normals for 3 and 4 are the same.
                let n1 = na.clone();
                let n2 = na.clone();
                let n3 = nb.clone();
                let n4 = nb.clone();
                let uv1 = uvs[i][j].clone();
                let uv2 = uvs[i + 1][j].clone();
                let uv3 = uvs[i + 1][j + 1].clone();
                let uv4 = uvs[i][j + 1].clone()
                this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3])
                this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()])
            }
        }

        // top cap
        if (!this.openTop && radius > 0) {
            // Push an extra point for the center of the top.
            points.push(this.axis.clone().scale(heightHalf));
            for (let j = 0; j < thetaSegments; j++) {
                let v1: number = vertices[heightSegments][j + 1];
                let v2: number = points.length - 1;
                let v3: number = vertices[heightSegments][j];
                let n1: Vector3 = this.axis.clone();
                let n2: Vector3 = this.axis.clone();
                let n3: Vector3 = this.axis.clone();
                let uv1: Vector2 = uvs[heightSegments][j + 1].clone();
                // Check this
                let uv2: Vector2 = new Vector2([uv1.x, 1]);
                let uv3: Vector2 = uvs[heightSegments][j].clone();
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }

        // bottom cap
        if (!this.openBottom && radius > 0) {
            // Push an extra point for the center of the bottom.
            points.push(this.axis.clone().scale(-heightHalf))
            for (let j = 0; j < thetaSegments; j++) {
                let v1: number = vertices[0][j]
                let v2: number = points.length - 1
                let v3: number = vertices[0][j + 1]
                let n1: Vector3 = this.axis.clone().scale(-1)
                let n2: Vector3 = this.axis.clone().scale(-1)
                let n3: Vector3 = this.axis.clone().scale(-1)
                let uv1: Vector2 = uvs[0][j].clone()
                // TODO: Check this
                let uv2: Vector2 = new Vector2([uv1.x, 1])
                let uv3: Vector2 = uvs[0][j + 1].clone()
                this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3])
            }
        }
        //    this.computeFaceNormals();
        //    this.computeVertexNormals();
        this.setModified(false)
    }
}

export = CylinderGeometry;
