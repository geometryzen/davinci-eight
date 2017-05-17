import { AttributeSizeType } from '../core/AttributeSizeType';
import { ContextManager } from '../core/ContextManager';
import { GraphicsProgramBuilder } from '../materials/GraphicsProgramBuilder';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { isDefined } from '../checks/isDefined';
import { isNull } from '../checks/isNull';
import { isUndefined } from '../checks/isUndefined';
import { ShaderMaterial } from './ShaderMaterial';
import { MeshMaterialOptions } from './MeshMaterialOptions';
import { mustBeObject } from '../checks/mustBeObject';
import { UniformGlslType } from '../core/UniformGlslType';

function builder(options?: MeshMaterialOptions) {
    if (isUndefined(options) || isNull(options)) {
        options = { kind: 'MeshMaterial', attributes: {}, uniforms: {} };

        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;
        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = 3;
        options.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = 2;

        options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX] = 'mat3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';

        options.uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] = 'vec3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] = 'vec3';
        options.uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] = 'vec3';
    }
    else {
        mustBeObject('options', options);
    }

    const attributes: { [name: string]: AttributeSizeType } = isDefined(options.attributes) ? options.attributes : {};
    const uniforms: { [name: string]: UniformGlslType } = isDefined(options.uniforms) ? options.uniforms : {};

    const gpb = new GraphicsProgramBuilder();

    const aNames = Object.keys(attributes);
    for (let a = 0; a < aNames.length; a++) {
        const aName = aNames[a];
        const size = attributes[aName];
        gpb.attribute(aName, size);
    }

    const uNames = Object.keys(uniforms);
    for (let u = 0; u < uNames.length; u++) {
        const uName = uNames[u];
        const type = uniforms[uName];
        gpb.uniform(uName, type);
    }

    return gpb;
}

function vertexShaderSrc(options?: MeshMaterialOptions): string {
    return builder(options).vertexShaderSrc();
}

function fragmentShaderSrc(options?: MeshMaterialOptions): string {
    return builder(options).fragmentShaderSrc();
}

const LOGGING_NAME_MESH_MATERIAL = 'MeshMaterial';

/**
 * 
 */
export class MeshMaterial extends ShaderMaterial {
    /**
     * 
     */
    constructor(contextManager: ContextManager, options: MeshMaterialOptions, levelUp = 0) {
        super(vertexShaderSrc(options), fragmentShaderSrc(options), [], contextManager, levelUp + 1);
        this.setLoggingName(LOGGING_NAME_MESH_MATERIAL);
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName(LOGGING_NAME_MESH_MATERIAL);
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1);
    }
}
