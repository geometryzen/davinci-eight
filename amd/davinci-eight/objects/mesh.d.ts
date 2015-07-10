/// <reference path="../../../src/davinci-eight/geometries/VertexAttributeProvider.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/Material.d.ts" />
/// <reference path="../../../src/davinci-eight/renderers/VertexUniformProvider.d.ts" />
import FactoredDrawable = require('../objects/FactoredDrawable');
declare var mesh: <G extends VertexAttributeProvider, M extends Material>(geometry: G, material: M, meshUniforms: VertexUniformProvider) => FactoredDrawable<G, M>;
export = mesh;
