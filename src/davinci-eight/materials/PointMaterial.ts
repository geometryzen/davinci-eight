import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import IGraphicsProgram from '../core/IGraphicsProgram';
import LineMaterialParameters from '../materials/LineMaterialParameters';
import GraphicsProgram from '../materials/GraphicsProgram';
import MonitorList from '../scene/MonitorList';
import createGraphicsProgram from '../programs/createGraphicsProgram';
import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

/**
 * Name used for reference count monitoring and logging.
 */
const LOGGING_NAME = 'PointMaterial';

function nameBuilder(): string {
    return LOGGING_NAME;
}

/**
 * @class PointMaterial
 * @extends GraphicsProgram
 */
export default class PointMaterial extends GraphicsProgram {
    /**
     * @class PointMaterial
     * @constructor
     * @param [parameters] {MeshNormalParameters}
     * @param [monitors] {IContextMonitor[]}
     */
    constructor(parameters?: LineMaterialParameters, monitors?: IContextMonitor[]) {
        super(LOGGING_NAME, monitors);
    }
    protected createGraphicsProgram(): IGraphicsProgram {
        const gpb = new GraphicsProgramBuilder();

        gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3);

        gpb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, 'float');

        return gpb.build(this.monitors);
    }
}
