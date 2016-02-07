import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import ShareableWebGLProgram from '../core/ShareableWebGLProgram';

function vertexShader(): string {
    const gpb = new GraphicsProgramBuilder();

    gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3);

    gpb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, 'float');

    return gpb.vertexShader();
}

function fragmentShader(): string {
    const gpb = new GraphicsProgramBuilder();

    gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3);

    gpb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, 'float');

    return gpb.fragmentShader();
}

/**
 * @class LineMaterial
 * @extends GraphicsProgram
 */
export default class LineMaterial extends ShareableWebGLProgram {
    /**
     * @class LineMaterial
     * @constructor
     */
    constructor() {
        super(vertexShader(), fragmentShader())
    }
}
