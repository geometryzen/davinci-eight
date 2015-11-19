import createGraphicsProgram = require('../programs/createGraphicsProgram')
import IContextProvider = require('../core/IContextProvider')
import IContextMonitor = require('../core/IContextMonitor')
import IGraphicsProgram = require('../core/IGraphicsProgram')
import isDefined = require('../checks/isDefined')
import LineMaterialParameters = require('../materials/LineMaterialParameters')
import GraphicsProgram = require('../materials/GraphicsProgram')
import MonitorList = require('../scene/MonitorList')
import mustBeInteger = require('../checks/mustBeInteger')
import GraphicsProgramBuilder = require('../materials/GraphicsProgramBuilder')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')

/**
 * @class LineMaterial
 * @extends GraphicsProgram
 */
class LineMaterial extends GraphicsProgram {
    /**
     * @property chunkSize
     * @type {number}
     */
    public chunkSize: number;

    /**
     * @class LineMaterial
     * @constructor
     * @param [monitors = []] {IContextMonitor[]}
     * @param [parameters = {}] {LineMaterialParameters}
     */
    constructor(monitors: IContextMonitor[] = [], parameters: LineMaterialParameters = {}) {
        super(monitors, 'LineMaterial')
        if (isDefined(parameters.chunkSize)) {
            this.chunkSize = mustBeInteger('parameters.chunkSize', parameters.chunkSize)
        }
        else {
            this.chunkSize = 3;
        }
    }

    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     * @protected
     */
    protected createGraphicsProgram(): IGraphicsProgram {
        let smb = new GraphicsProgramBuilder();

        smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, this.chunkSize);

        smb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');

        smb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
        smb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
        smb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');

        return smb.build(this.monitors);
    }
}

export = LineMaterial;
