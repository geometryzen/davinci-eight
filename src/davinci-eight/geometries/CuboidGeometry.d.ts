/// <reference path='./Geometry.d.ts'/>
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
interface CuboidGeometry extends Geometry {
  a: blade.Euclidean3;
  b: blade.Euclidean3;
  c: blade.Euclidean3;
  color: number[];
}