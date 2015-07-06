/// <reference path='./VertexAttributeProvider.d.ts'/>
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
interface CuboidGeometry extends VertexAttributeProvider {
  a: blade.Euclidean3;
  b: blade.Euclidean3;
  c: blade.Euclidean3;
  color: number[];
  grayScale: boolean;
}