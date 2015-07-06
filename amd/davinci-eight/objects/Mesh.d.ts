/// <reference path="../../../src/davinci-eight/geometries/VertexAttributeProvider.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/Material.d.ts" />
/// <reference path="../../../src/davinci-eight/materials/UniformMetaInfo.d.ts" />
/// <reference path="../../../src/davinci-eight/renderers/VertexUniformProvider.d.ts" />
/// <reference path="../../../src/davinci-eight/geometries/AttributeMetaInfos.d.ts" />
/// <reference path="../../../vendor/davinci-blade/dist/davinci-blade.d.ts" />
import Quaternion = require('../math/Quaternion');
import FactoredDrawable = require('../objects/FactoredDrawable');
import Geometry = require('../geometries/Geometry');
declare class Mesh<G extends Geometry, M extends Material> implements FactoredDrawable<G, M> {
    geometry: G;
    private innerMesh;
    private meshVertexUniformProvider;
    constructor(geometry: G, material: M);
    material: M;
    attitude: blade.Euclidean3;
    position: blade.Euclidean3;
    setRotationFromQuaternion(q: Quaternion): void;
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
