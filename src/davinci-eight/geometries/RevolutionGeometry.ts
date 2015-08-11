import Face3 = require('../core/Face3');
import Geometry = require('../geometries/Geometry');
import Spinor3 = require('../math/Spinor3');
import Vector2 = require('../math/Vector2');
import Vector3 = require('../math/Vector3');

class RevolutionGeometry extends Geometry
{
  constructor(
    points: Vector3[],
    generator: Spinor3,
    segments: number,
    phiStart: number,
    phiLength: number,
    attitude: Spinor3)
  {
    super();

    segments = segments || 12;
    phiStart = phiStart || 0;
    phiLength = phiLength || 2 * Math.PI;

    // Determine heuristically whether the user intended to make a complete revolution.
    var isClosed = Math.abs(2 * Math.PI - Math.abs(phiLength - phiStart)) < 0.0001;

    // The number of vertical half planes (phi constant).
    var halfPlanes = isClosed ? segments : segments + 1;
    var inverseSegments = 1.0 / segments;
    var phiStep = (phiLength - phiStart) * inverseSegments;

    var i: number;
    var j: number;
    var il: number;
    var jl: number;

    for (i = 0, il = halfPlanes; i < il; i++) {

      var phi = phiStart + i * phiStep;

      var halfAngle = phi / 2;

      var cosHA = Math.cos( halfAngle );
      var sinHA = Math.sin( halfAngle );
      // TODO: This is simply the exp(B theta / 2), maybe needs a sign.
      var rotor = new Spinor3([generator.yz * sinHA, generator.zx * sinHA, generator.xy * sinHA, cosHA]);

      for (j = 0, jl = points.length; j < jl; j++) {

        var vertex = points[j].clone();

        // The generator tells us how to rotate the points.
        vertex.applySpinor(rotor);

        // The attitude tells us where we want the symmetry axis to be.
        if (attitude) {
          vertex.applySpinor(attitude);
        }

        this.vertices.push( vertex );
      }
    }

    var inversePointLength = 1.0 / ( points.length - 1 );
    var np = points.length;

    // The denominator for modulo index arithmetic.
    var wrap = np * halfPlanes;

    for (i = 0, il = segments; i < il; i++) {

      for (j = 0, jl = points.length - 1; j < jl; j++) {

        var base = j + np * i;
        var a = base % wrap;
        var b = (base + np) % wrap;
        var c = (base + 1 + np) % wrap;
        var d = (base + 1) % wrap;

        var u0 = i * inverseSegments;
        var v0 = j * inversePointLength;
        var u1 = u0 + inverseSegments;
        var v1 = v0 + inversePointLength;

        this.faces.push(new Face3(d, b, a));
        this.faceVertexUvs[ 0 ].push([
          new Vector2([u0, v0]),
          new Vector2([u1, v0]),
          new Vector2([u0, v1])
        ]);

        this.faces.push(new Face3(d, c, b));
        this.faceVertexUvs[ 0 ].push([
          new Vector2([u1, v0]),
          new Vector2([u1, v1]),
          new Vector2([u0, v1])
        ]);
      }
    }
    this.computeFaceNormals();
    this.computeVertexNormals();
  }
}

export = RevolutionGeometry;
