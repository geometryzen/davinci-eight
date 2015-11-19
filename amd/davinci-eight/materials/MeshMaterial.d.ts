import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import MeshMaterialParameters = require('../materials/MeshMaterialParameters');
import GraphicsProgram = require('../materials/GraphicsProgram');
/**
 * @class MeshMaterial
 * @extends GraphicsProgram
 */
declare class MeshMaterial extends GraphicsProgram {
    /**
     * @class MeshMaterial
     * @constructor
     * @param monitors [IContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors?: IContextMonitor[], parameters?: MeshMaterialParameters);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     * @protected
     */
    protected createGraphicsProgram(): IGraphicsProgram;
}
export = MeshMaterial;
