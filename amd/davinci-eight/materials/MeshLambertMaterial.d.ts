import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import GraphicsProgram = require('../materials/GraphicsProgram');
/**
 * @class MeshLambertMaterial
 * @extends GraphicsProgram
 */
declare class MeshLambertMaterial extends GraphicsProgram {
    /**
     *
     * @class MeshLambertMaterial
     * @constructor
     * @param monitors [IContextMonitor[]=[]]
     */
    constructor(monitors?: IContextMonitor[]);
    protected destructor(): void;
    protected createGraphicsProgram(): IGraphicsProgram;
}
export = MeshLambertMaterial;
