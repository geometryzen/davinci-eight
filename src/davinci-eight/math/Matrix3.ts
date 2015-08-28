/// <reference path="../../../src/gl-matrix.d.ts" />
/// <amd-dependency path="gl-matrix" name="glMatrix"/>
import Matrix4 = require('./Matrix4');
import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');
declare var glMatrix: glMatrix;

class Matrix3 {
  /**
   * @property elements
   * @type Float32Array
   */
  public elements: Float32Array;
  /**
   * Constructs the Matrix4 by wrapping a Float32Array.
   * @constructor
   */
  constructor(elements: Float32Array) {
    expectArg('elements', elements)
    .toSatisfy(elements instanceof Float32Array, "elements must be a Float32Array")
    .toSatisfy(elements.length === 9, 'elements must have length 9');
    this.elements = elements;
  }
  public static identity() {
    return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
  }
  getInverse(matrix: Matrix4, throwOnInvertible?: boolean): Matrix3 {

    // input: THREE.Matrix4
    // ( based on http://code.google.com/p/webgl-mjs/ )

    var me = matrix.elements;
    var te = this.elements;

    te[ 0 ] =   me[ 10 ] * me[ 5 ] - me[ 6 ] * me[ 9 ];
    te[ 1 ] = - me[ 10 ] * me[ 1 ] + me[ 2 ] * me[ 9 ];
    te[ 2 ] =   me[ 6 ] * me[ 1 ] - me[ 2 ] * me[ 5 ];
    te[ 3 ] = - me[ 10 ] * me[ 4 ] + me[ 6 ] * me[ 8 ];
    te[ 4 ] =   me[ 10 ] * me[ 0 ] - me[ 2 ] * me[ 8 ];
    te[ 5 ] = - me[ 6 ] * me[ 0 ] + me[ 2 ] * me[ 4 ];
    te[ 6 ] =   me[ 9 ] * me[ 4 ] - me[ 5 ] * me[ 8 ];
    te[ 7 ] = - me[ 9 ] * me[ 0 ] + me[ 1 ] * me[ 8 ];
    te[ 8 ] =   me[ 5 ] * me[ 0 ] - me[ 1 ] * me[ 4 ];

    var det = me[ 0 ] * te[ 0 ] + me[ 1 ] * te[ 3 ] + me[ 2 ] * te[ 6 ];

    // no inverse

    if ( det === 0 ) {

      var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

      if ( throwOnInvertible || !throwOnInvertible ) {

        throw new Error( msg );

      } else {

        console.warn( msg );

      }

      this.identity();

      return this;

    }

    this.multiplyScalar( 1.0 / det );

    return this;

  }
  identity(): Matrix3 {
    return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }
  multiplyScalar(s: number): Matrix3 {
    let m = this.elements;
    m[0] *= s; m[3] *= s; m[6] *= s;
    m[1] *= s; m[4] *= s; m[7] *= s;
    m[2] *= s; m[5] *= s; m[8] *= s;
    return this;
  }
  normalFromMatrix4(m: Matrix4): void {
    this.getInverse(m).transpose();
  }
  set(
    n11: number,
    n12: number,
    n13: number,
    n21: number,
    n22: number,
    n23: number,
    n31: number,
    n32: number,
    n33: number): Matrix3 {

    var te = this.elements;

    te[ 0 ] = n11; te[ 3 ] = n12; te[ 6 ] = n13;
    te[ 1 ] = n21; te[ 4 ] = n22; te[ 7 ] = n23;
    te[ 2 ] = n31; te[ 5 ] = n32; te[ 8 ] = n33;

    return this;
  }
  transpose(): Matrix3 {
    var tmp: number;
    var m = this.elements;

    tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
    tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
    tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

    return this;

  }
}

export = Matrix3;
