import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import LineMaterialParameters = require('../materials/LineMaterialParameters');
import GraphicsProgram = require('../materials/GraphicsProgram');
/**
 * @class LineMaterial
 * @extends GraphicsProgram
 */
declare class LineMaterial extends GraphicsProgram {
    /**
     * @property chunkSize
     * @type {number}
     */
    chunkSize: number;
    /**
     * @class LineMaterial
     * @constructor
     * @param [monitors = []] {IContextMonitor[]}
     * @param [parameters = {}] {LineMaterialParameters}
     */
    constructor(monitors?: IContextMonitor[], parameters?: LineMaterialParameters);
    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     * @protected
     */
    protected createGraphicsProgram(): IGraphicsProgram;
}
export = LineMaterial;
