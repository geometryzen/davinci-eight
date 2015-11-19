import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import MeshMaterialParameters = require('../materials/MeshMaterialParameters');
import GraphicsProgram = require('../materials/GraphicsProgram');
import MonitorList = require('../scene/MonitorList');
import createGraphicsProgram = require('../programs/createGraphicsProgram');
import GraphicsProgramBuilder = require('../materials/GraphicsProgramBuilder')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')
/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'MeshMaterial';

function nameBuilder(): string {
    return LOGGING_NAME;
}

/**
 * @class MeshMaterial
 * @extends GraphicsProgram
 */
class MeshMaterial extends GraphicsProgram {
    /**
     * @class MeshMaterial
     * @constructor
     * @param monitors [IContextMonitor[]=[]]
     * @parameters [MeshNormalParameters]
     */
    constructor(monitors: IContextMonitor[] = [], parameters?: MeshMaterialParameters) {
        super(monitors, LOGGING_NAME);
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor();
    }
    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     * @protected
     */
    protected createGraphicsProgram(): IGraphicsProgram {
        let smb = new GraphicsProgramBuilder();

        smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3);
        smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_NORMAL, 3);
        // smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COLOR, 3);

        smb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
        smb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
        smb.uniform(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, 'mat3');
        smb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
        smb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');

        smb.uniform(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, 'vec3')
        smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3')
        smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3')

        return smb.build(this.monitors);
    }
}

export = MeshMaterial;
