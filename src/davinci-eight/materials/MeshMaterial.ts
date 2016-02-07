import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import ShareableWebGLProgram from '../core/ShareableWebGLProgram';

function vertexShader(): string {
    const gpb = new GraphicsProgramBuilder();

    gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3);
    gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_NORMAL, 3);
    // gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COLOR, 3);

    gpb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, 'mat3');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');

    gpb.uniform(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, 'vec3')
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3')
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3')

    return gpb.vertexShader();
}

function fragmentShader(): string {
    const gpb = new GraphicsProgramBuilder();

    gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3);
    gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_NORMAL, 3);
    // gpb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COLOR, 3);

    gpb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, 'mat3');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');

    gpb.uniform(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, 'vec3')
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3')
    gpb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3')

    return gpb.fragmentShader();
}

/**
 * @class MeshMaterial
 * @extends GraphicsProgram
 */
export default class MeshMaterial extends ShareableWebGLProgram {
    /**
     * @class MeshMaterial
     * @constructor
     */
    constructor() {
        super(vertexShader(), fragmentShader());
    }
}
