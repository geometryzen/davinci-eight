import ContextManager = require('../core/ContextManager');
import Geometry = require('../geometries/Geometry');
import IDrawable = require('../core/IDrawable');
import IProgram = require('../core/IProgram');
import UniformData = require('../core/UniformData');
/**
 * @class Mesh
 * @implements IDrawable
 */
declare class Mesh<G extends Geometry, M extends IProgram, U extends UniformData> implements IDrawable {
    private _refCount;
    private _uuid;
    geometry: G;
    _material: M;
    /**
     * FIXME This is a bad name because it is not just a collection of meshLookup.
     * A map from canvas to IBufferGeometry.
     * It's a function that returns a mesh, given a canvasId; a lokup
     */
    private meshLookup;
    model: U;
    private mode;
    constructor(geometry: G, material: M, model: U);
    addRef(): number;
    release(): number;
    draw(canvasId: number): void;
    contextFree(canvasId: number): void;
    contextGain(manager: ContextManager): void;
    contextLoss(canvasId: number): void;
    /**
     * @property material
     *
     * Provides a reference counted reference to the material.
     */
    material: IProgram;
}
export = Mesh;
