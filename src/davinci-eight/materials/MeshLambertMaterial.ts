import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import IGraphicsProgram from '../core/IGraphicsProgram';
import MeshMaterialParameters from '../materials/MeshMaterialParameters';
import GraphicsProgram from '../materials/GraphicsProgram';
import MonitorList from '../scene/MonitorList';
import createGraphicsProgram from '../programs/createGraphicsProgram';
import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

/**
 * Name used for reference count monitoring and logging.
 */
let LOGGING_NAME = 'MeshLambertMaterial'

function nameBuilder(): string {
    return LOGGING_NAME;
}

/**
 * @class MeshLambertMaterial
 * @extends GraphicsProgram
 */
export default class MeshLambertMaterial extends GraphicsProgram {
    /**
     * 
     * @class MeshLambertMaterial
     * @constructor
     * @param [monitors] {IContextMonitor[]}
     */
    constructor(monitors?: IContextMonitor[]) {
        super(LOGGING_NAME, monitors);
    }
    protected destructor(): void {
        super.destructor()
    }
    protected createGraphicsProgram(): IGraphicsProgram {
        let smb = new GraphicsProgramBuilder()

        smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3)
        smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_NORMAL, 3)

        smb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3')
        smb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4')
        smb.uniform(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, 'mat3')
        smb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4')
        smb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4')

        smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3')
        smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3')

        return smb.build(this.monitors);
    }
}
