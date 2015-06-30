/// <reference path="../../../src/davinci-eight/materials/Material.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
declare var material: (attributes: {
    name: string;
    size: number;
}[], vertexShader: string, fragmentShader: string) => Material;
export = material;
