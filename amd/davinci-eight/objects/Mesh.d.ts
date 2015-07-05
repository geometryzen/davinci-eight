/// <reference path="../../../src/davinci-eight/objects/FactoredDrawable.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/Geometry.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/Material.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/UniformMetaInfo.d.ts" />
/// <reference path="../../../src/davinci-eight/renderers/UniformProvider.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/AttributeMetaInfos.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/CuboidGeometry.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
declare class Mesh<G extends Geometry, M extends Material> implements FactoredDrawable<G, M> {
    private innerMesh;
    private meshUniformProvider;
    constructor(geometry: G, material: M);
    geometry: G;
    material: M;
    attitude: blade.Euclidean3;
    position: blade.Euclidean3;
    drawGroupName: string;
    useProgram(context: WebGLRenderingContext): void;
    draw(context: WebGLRenderingContext, time: number, uniformProvider: UniformProvider): any;
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext, contextGainId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
    static getUniformMetaInfo(): UniformMetaInfo;
}
export = Mesh;
