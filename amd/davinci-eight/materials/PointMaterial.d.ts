import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import LineMaterialParameters = require('../materials/LineMaterialParameters');
import GraphicsProgram = require('../materials/GraphicsProgram');
/**
 * @class PointMaterial
 * @extends GraphicsProgram
 */
declare class PointMaterial extends GraphicsProgram {
    /**
     * @class PointMaterial
     * @constructor
     * @param monitors [IContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors?: IContextMonitor[], parameters?: LineMaterialParameters);
    protected createGraphicsProgram(): IGraphicsProgram;
}
export = PointMaterial;
