import createGraphicsProgram from '../programs/createGraphicsProgram';
import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import IGraphicsProgram from '../core/IGraphicsProgram';
import isDefined from '../checks/isDefined';
import LineMaterialParameters from '../materials/LineMaterialParameters';
import GraphicsProgram from '../materials/GraphicsProgram';
import MonitorList from '../scene/MonitorList';
import mustBeInteger from '../checks/mustBeInteger';
import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';

/**
 * @class LineMaterial
 * @extends GraphicsProgram
 */
export default class LineMaterial extends GraphicsProgram {
    /**
     * @property size
     * @type {number}
     */
    public size: number;

    /**
     * @class LineMaterial
     * @constructor
     * @param [parameters = {}] {LineMaterialParameters}
     * @param [monitors = []] {IContextMonitor[]}
     */
    constructor(parameters: LineMaterialParameters = {}, monitors?: IContextMonitor[]) {
        super('LineMaterial', monitors)
        if (isDefined(parameters.size)) {
            this.size = mustBeInteger('parameters.size', parameters.size)
        }
        else {
            this.size = 3;
        }
    }

    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     * @protected
     */
    protected createGraphicsProgram(): IGraphicsProgram {
        const gpb = new GraphicsProgramBuilder();

        gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, this.size);

        gpb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');

        gpb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');

        return gpb.build(this.monitors);
    }
}
