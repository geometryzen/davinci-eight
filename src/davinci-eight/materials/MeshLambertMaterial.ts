import GraphicsProgramBuilder from '../materials/GraphicsProgramBuilder';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import ShareableWebGLProgram from '../core/ShareableWebGLProgram';

function vertexShader(): string {
    const smb = new GraphicsProgramBuilder()

    smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3)
    smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_NORMAL, 3)

    smb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, 'mat3')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4')

    smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3')

    return smb.vertexShader();
}

function fragmentShader(): string {
    const smb = new GraphicsProgramBuilder()

    smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3)
    smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_NORMAL, 3)

    smb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, 'mat3')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4')

    smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3')
    smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3')

    return smb.fragmentShader();
}

/**
 * @class MeshLambertMaterial
 * @extends ShareableWebGLProgram
 */
export default class MeshLambertMaterial extends ShareableWebGLProgram {
    /**
     * 
     * @class MeshLambertMaterial
     * @constructor
     */
    constructor() {
        super(vertexShader(), fragmentShader());
    }
}
