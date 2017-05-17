import { Matrix3 } from './Matrix3';
import { Vector2 } from './Vector2';
import { Vector3 } from './Vector3';

// Accept some loss of accuracy due to using Float32Array.
/**
 * The number of decimal places.
 */
const precision = 5;

describe("Matrix3", function () {
  describe("elements", function () {
    it("should be a Float32Array to support WebGL", function () {
      const m = new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
      expect(m.elements instanceof Float32Array).toBe(true);
    });
  });
  describe("translation", function () {
    const a = Vector2.random();
    const T = Matrix3.one.clone().translation(a);
    it("should set the elements correctly", function () {
      // 1st row
      expect(T.getElement(0, 0)).toBe(1);
      expect(T.getElement(0, 1)).toBe(0);
      expect(T.getElement(0, 2)).toBeCloseTo(a.x, precision);
      // 2nd row
      expect(T.getElement(1, 0)).toBe(0);
      expect(T.getElement(1, 1)).toBe(1);
      expect(T.getElement(1, 2)).toBeCloseTo(a.y, precision);
      // 3nd row
      expect(T.getElement(2, 0)).toBe(0);
      expect(T.getElement(2, 1)).toBe(0);
      expect(T.getElement(2, 2)).toBe(1);
    });
    it("should translate a position vector", function () {
      // Create a random point in 2D space.
      const point = Vector2.random();
      // Create the equivalent homogeneous point.
      const x = Vector3.vector(point.x, point.y, 1);

      const Tx = x.clone().applyMatrix(T);

      const displacement = Tx.clone().sub(x);
      expect(displacement.x).toBeCloseTo(a.x, precision);
      expect(displacement.y).toBeCloseTo(a.y, precision);
      expect(displacement.z).toBe(0);
    });
  });
});
