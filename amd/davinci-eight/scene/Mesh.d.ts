import IContextProvider = require('../core/IContextProvider');
import Geometry = require('../geometries/Geometry');
import IDrawable = require('../core/IDrawable');
import IMaterial = require('../core/IMaterial');
import Shareable = require('../utils/Shareable');
import UniformData = require('../core/UniformData');
/**
 * @class Mesh
 * @implements IDrawable
 */
declare class Mesh<G extends Geometry, M extends IMaterial, U extends UniformData> extends Shareable implements IDrawable {
    geometry: G;
    _material: M;
    /**
     * FIXME This is a bad name because it is not just a collection of buffersByCanvasid.
     * A map from canvas to IBufferGeometry.
     * It's a function that returns a mesh, given a canvasId a lokup
     */
    private buffersByCanvasid;
    model: U;
    private mode;
    constructor(geometry: G, material: M, model: U);
    protected destructor(): void;
    draw(canvasId: number): void;
    contextFree(canvasId: number): void;
    contextGain(manager: IContextProvider): void;
    contextLost(canvasId: number): void;
    /**
     * @property material
     *
     * Provides a reference counted reference to the material.
     */
    material: IMaterial;
}
export = Mesh;
