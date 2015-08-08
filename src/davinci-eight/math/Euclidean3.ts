// Considering new ideas for a totally immutable Euclidean3 value type.
class Euclidean3 {
  // The constructor is essentially for internal use.
  constructor(w: number, x: number, y: number, z: number) {

  }
  // It's a bit dangerous, but it might let us coexist with other types.
  // Another possibility is to write specialized mapping functions.
  copy(coords: {w?: number, x?: number, y?: number, z?: number}) {

  }
  add(other: Euclidean3): Euclidean3 {
    return new Euclidean3(0,0,0,0);
  }
  sub(other: Euclidean3): Euclidean3 {
    return new Euclidean3(0,0,0,0);
  }
  mul(other: Euclidean3): Euclidean3 {
    return new Euclidean3(0,0,0,0);
  }
  div(other: Euclidean3): Euclidean3 {
    return new Euclidean3(0,0,0,0);
  }
  public static scalar(w: number) {
    return new Euclidean3(w,0,0,0);
  }
  public static vector(x: number, y: number, z: number) {
    return new Euclidean3(0, x, y, z);
  }
  public static ZERO = Euclidean3.scalar(0);
  public static ONE = Euclidean3.scalar(1);
  public static MINUS_ONE = Euclidean3.scalar(-1);
  public static TWO = Euclidean3.scalar(2);
  public static e1 = Euclidean3.vector(1, 0, 0);
  public static e2 = Euclidean3.vector(0, 1, 0);
  public static e3 = Euclidean3.vector(0, 1, 0);
}

export = Euclidean3;