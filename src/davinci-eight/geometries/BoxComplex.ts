import Complex = require('../dfx/Complex');
import mustBeInteger = require('../checks/mustBeInteger');
import mustBeNumber = require('../checks/mustBeNumber');
import Simplex = require('../dfx/Simplex');
import Symbolic = require('../core/Symbolic');
import Vector1 = require('../math/Vector1');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

function boxCtor() {
  return "BoxComplex constructor";
}

/**
 * @class BoxComplex
 * @extends Complex
 */
class BoxComplex extends Complex {
  constructor(width: number = 1, height: number = 1, depth: number = 1,
    widthSegments: number = 1, heightSegments: number = 1, depthSegments: number = 1,
    wireFrame: boolean = false) {

    super();

    mustBeNumber('width', width, boxCtor);
    mustBeNumber('height', height, boxCtor);
    mustBeNumber('depth', depth, boxCtor);
    mustBeInteger('widthSegments', widthSegments, boxCtor);
    mustBeInteger('heightSegments', heightSegments, boxCtor);
    mustBeInteger('depthSegments', depthSegments, boxCtor);

    // Temporary storage for points.
    // The approach is:
    // 1. Compute the points first.
    // 2. Compute the faces and have them reference the points.
    // 3. Throw away the temporary storage of points. 
    let points: Vector3[] = [];

    let geometry = this;

    let width_half = width / 2;
    let height_half = height / 2;
    let depth_half = depth / 2;

    buildPlane('z', 'y', -1, -1, depth, height, +width_half,  new Vector1([0])); // positive-x
    buildPlane('z', 'y', +1, -1, depth, height, -width_half,  new Vector1([1])); // negative-x
    buildPlane('x', 'z', +1, +1, width, depth,  +height_half, new Vector1([2])); // positive-y
    buildPlane('x', 'z', +1, -1, width, depth,  -height_half, new Vector1([3])); // negative-y
    buildPlane('x', 'y', +1, -1, width, height, +depth_half,  new Vector1([4])); // positive-z
    buildPlane('x', 'y', -1, -1, width, height, -depth_half,  new Vector1([5])); // negative-z

    function buildPlane(u: string, v: string, udir: number, vdir: number, width: number, height: number, depth: number, materialIndex: Vector1) {

      var w: string;
      var ix: number;
      var iy: number;
      let gridX = widthSegments;
      let gridY = heightSegments;
      
      let width_half = width / 2;
      let height_half = height / 2;

      let offset = points.length;

      if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) ) {
        w = 'z';
      }
      else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) ) {
        w = 'y';
        gridY = depthSegments;
      }
      else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) ) {
        w = 'x';
        gridX = depthSegments;
      }

      let gridX1 = gridX + 1;
      let gridY1 = gridY + 1;
      let segment_width = width / gridX;
      let segment_height = height / gridY;

      // The normal starts out as all zeros.
      let normal = new Vector3();
      // This bit of code sets the appropriate coordinate in the normal vector.
      normal[ w ] = depth > 0 ? 1 : - 1;

      // Compute the points.
      for ( iy = 0; iy < gridY1; iy ++ ) {
        for ( ix = 0; ix < gridX1; ix ++ ) {
          let point = new Vector3();

          // This bit of code sets the appropriate coordinate in the position vector.
          point[ u ] = ( ix * segment_width - width_half ) * udir;
          point[ v ] = ( iy * segment_height - height_half ) * vdir;
          point[ w ] = depth;

          points.push(point);
        }
      }

      // Compute the triangular faces using the pre-computed points.
      for ( iy = 0; iy < gridY; iy ++ ) {
        for ( ix = 0; ix < gridX; ix ++ ) {

          var a = ix + gridX1 * iy;
          var b = ix + gridX1 * ( iy + 1 );
          var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
          var d = ( ix + 1 ) + gridX1 * iy;

          var uva = new Vector2([ix / gridX, 1 - iy / gridY]);
          var uvb = new Vector2([ix / gridX, 1 - ( iy + 1 ) / gridY]);
          var uvc = new Vector2([( ix + 1 ) / gridX, 1 - ( iy + 1 ) / gridY]);
          var uvd = new Vector2([( ix + 1 ) / gridX, 1 - iy / gridY]);

          var face = new Simplex(Simplex.K_FOR_TRIANGLE);
          
          face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[a + offset];
          face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
          face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uva;
          face.vertices[0].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;

          face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b + offset];
          face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
          face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb;
          face.vertices[1].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;

          face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d + offset];
          face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
          face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd;
          face.vertices[2].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;

          geometry.simplices.push( face );

          face = new Simplex(Simplex.K_FOR_TRIANGLE);

          face.vertices[0].attributes[Symbolic.ATTRIBUTE_POSITION] = points[b + offset];
          face.vertices[0].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
          face.vertices[0].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvb;
          face.vertices[0].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;

          face.vertices[1].attributes[Symbolic.ATTRIBUTE_POSITION] = points[c + offset];
          face.vertices[1].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
          face.vertices[1].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvc;
          face.vertices[1].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;

          face.vertices[2].attributes[Symbolic.ATTRIBUTE_POSITION] = points[d + offset];
          face.vertices[2].attributes[Symbolic.ATTRIBUTE_NORMAL] = normal;
          face.vertices[2].attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = uvd;
          face.vertices[2].attributes[Symbolic.ATTRIBUTE_MATERIAL_INDEX] = materialIndex;

          geometry.simplices.push( face );
        }
      }
    }
    if (wireFrame) {
      this.boundary();
    }
    // This construction duplicates vertices along the edges of the cube.
    this.mergeVertices();
    // Update the metadata.
    this.check();
  }
}

export = BoxComplex;
