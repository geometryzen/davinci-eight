/// <reference path="../../../src/davinci-eight/objects/Mesh.d.ts" />
/// <reference path="../../../src/davinci-eight/cameras/Camera.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/Material.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
declare var mesh: <G extends Geometry, M extends Material>(geometry: G, material: M) => Mesh<G, M>;
export = mesh;
