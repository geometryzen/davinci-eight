/// <reference path="../../../src/davinci-eight/objects/FactoredDrawable.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/Material.d.ts" />
/// <reference path="../../../src/davinci-eight/renderers/UniformProvider.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
declare var mesh: <G extends Geometry, M extends Material>(geometry: G, material: M, meshUniforms: UniformProvider) => FactoredDrawable<G, M>;
export = mesh;
