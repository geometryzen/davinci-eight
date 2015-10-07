import Geometry = require('../geometries/Geometry')
import Simplex = require('../geometries/Simplex');
import Sphere = require('../math/Sphere')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

/**
 * @class SphereGeometry
 * @extends Geometry
 */
class SphereGeometry extends Geometry {
  /**
   * Constructs a geometry consisting of triangular simplices based on spherical coordinates.
   * @class SphereGeometry
   * @constructor
   * @param radius [number = 1]
   * @param widthSegments [number = 16]
   * @param heightSegments [number = 12]
   * @param phiStart [number = 0]
   * @param phiLength [number = 2 * Math.PI]
   * @param thetaStart [number = 0]
   * @param thetaLength [number = Math.PI]
   */
  constructor(
    radius: number = 1,
    widthSegments: number = 16,
    heightSegments: number = 12,
    phiStart: number = 0,
    phiLength: number = 2 * Math.PI,
    thetaStart: number = 0,
    thetaLength: number = Math.PI) {
    super();

    var x: number;
    var y: number;
    var verticesRows: number[][] = [];
    /**
     * Temporary storage for the 2D uv coordinates
     */
    var uvs: Vector2[][] = []
    /**
     * Temporary storage for the 3D cartesian coordinates.
     */
    var points: Vector3[] = []

    // This first loop pair generates the points.
    for ( y = 0; y <= heightSegments; y ++ )
    {
      var verticesRow: number[] = [];
      var uvsRow: Vector2[] = [];

      for ( x = 0; x <= widthSegments; x ++ )
      {
        var u = x / widthSegments;
        var v = y / heightSegments;

        var point = new Vector3([0, 0, 0]);
        point.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
        point.y = radius * Math.cos( thetaStart + v * thetaLength );
        point.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

        points.push( point );

        verticesRow.push( points.length - 1 );
        uvsRow.push(new Vector2([u, 1 - v]));

      }
      verticesRows.push( verticesRow );
      uvs.push( uvsRow );
    }

    for ( y = 0; y < heightSegments; y ++ )
    {
      for ( x = 0; x < widthSegments; x ++ )
      {
        // Form a quadrilateral. v1 thtough v4 give the indices into the points array.
        var v1: number = verticesRows[ y ][ x + 1 ];
        var v2: number = verticesRows[ y ][ x ];
        var v3: number = verticesRows[ y + 1 ][ x ];
        var v4: number = verticesRows[ y + 1 ][ x + 1 ];

        // The normal vectors for the sphere are simply the normalized position vectors.
        var n1: Vector3 = Vector3.copy(points[v1]).normalize();
        var n2: Vector3 = Vector3.copy(points[v2]).normalize();
        var n3: Vector3 = Vector3.copy(points[v3]).normalize();
        var n4: Vector3 = Vector3.copy(points[v4]).normalize();

        // Grab the uv coordinates too.
        var uv1: Vector2 = uvs[ y ][ x + 1 ].clone();
        var uv2: Vector2 = uvs[ y ][ x ].clone();
        var uv3: Vector2 = uvs[ y + 1 ][ x ].clone();
        var uv4: Vector2 = uvs[ y + 1 ][ x + 1 ].clone();

        // Special case the north and south poles by only creating one triangle.
        if ( Math.abs(points[ v1 ].y ) === radius )
        {
          uv1.x = ( uv1.x + uv2.x ) / 2;
          var simplex = new Simplex(Simplex.K_FOR_TRIANGLE)
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v1]
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = n1
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv1
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v3]
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = n3
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv3
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v4]
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = n4
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv4
          this.data.push(simplex)
        }
        else if ( Math.abs(points[ v3 ].y ) === radius )
        {
          uv3.x = ( uv3.x + uv4.x ) / 2;
          var simplex = new Simplex(Simplex.K_FOR_TRIANGLE)
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v1]
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = n1
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv1
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v2]
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = n2
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv2
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v3]
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = n3
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv3
          this.data.push(simplex)
        }
        else
        {
          // The other patches create two triangles.
          var simplex = new Simplex(Simplex.K_FOR_TRIANGLE)
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v1]
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = n1
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv1
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v2]
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = n2
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv2
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v4]
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = n4
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv4
          this.data.push(simplex)

          var simplex = new Simplex(Simplex.K_FOR_TRIANGLE)
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v2]
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = n2.clone()
          simplex.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv2.clone()
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v3]
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = n3
          simplex.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv3
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[v4]
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = n4.clone()
          simplex.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uv4.clone()
          this.data.push(simplex)
        }
      }
    }
  }
}

export = SphereGeometry;
