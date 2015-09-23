import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import IDrawable = require('../core/IDrawable');
import IDrawList = require('../scene/IDrawList');
import IMaterial = require('../core/IMaterial');
/**
 * @class Scene
 * @extends IDrawList
 */
declare class Scene implements IDrawList {
    private _drawList;
    private monitors;
    private _refCount;
    private _uuid;
    /**
     * @class Scene
     * @constructor
     * @param monitors [ContextMonitor[]=[]]
     */
    constructor(monitors?: ContextMonitor[]);
    add(drawable: IDrawable): void;
    addRef(): number;
    release(): number;
    remove(drawable: IDrawable): void;
    traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (program: IMaterial) => void): void;
    contextFree(canvasId: number): void;
    contextGain(manager: ContextManager): void;
    contextLoss(canvasId: number): void;
}
export = Scene;
