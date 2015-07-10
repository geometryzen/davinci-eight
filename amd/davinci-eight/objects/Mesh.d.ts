/// <reference path="../../../src/davinci-eight/geometries/VertexAttributeProvider.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/Material.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/UniformMetaInfo.d.ts" />
/// <reference path="../../../src/davinci-eight/renderers/VertexUniformProvider.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/AttributeMetaInfos.d.ts" />
import Spinor3 = require('../math/Spinor3');
import Vector3 = require('../math/Vector3');
import FactoredDrawable = require('../objects/FactoredDrawable');
import Geometry = require('../geometries/Geometry');
declare class Mesh<G extends Geometry, M extends Material> implements FactoredDrawable<G, M> {
    geometry: G;
    private innerMesh;
    private meshVertexUniformProvider;
    constructor(geometry: G, material: M);
    material: M;
    attitude: Spinor3;
    position: Vector3;
    drawGroupName: string;
    useProgram(context: WebGLRenderingContext): void;
    draw(context: WebGLRenderingContext, time: number, uniformProvider: VertexUniformProvider): any;
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext, contextGainId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
    static getUniformMetaInfo(): UniformMetaInfo;
}
export = Mesh;
