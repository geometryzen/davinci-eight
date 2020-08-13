import { isDefined } from '../checks/isDefined';
import { isNull } from '../checks/isNull';
import { isUndefined } from '../checks/isUndefined';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { mustBeObject } from '../checks/mustBeObject';
import { AttributeSizeType } from '../core/AttributeSizeType';
import { ContextManager } from '../core/ContextManager';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { UniformGlslType } from '../core/UniformGlslType';
import { GraphicsProgramBuilder } from '../materials/GraphicsProgramBuilder';
import { glslVersionFromWebGLContextId } from './glslVersionFromWebGLContextId';
import { PointMaterialOptions } from './PointMaterialOptions';
import { ShaderMaterial } from './ShaderMaterial';

function defaultOptions(options: PointMaterialOptions): void {
    if (!options.attributes) {
        options.attributes = {};
    }
    if (!options.uniforms) {
        options.uniforms = {};
    }

    options.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = 3;

    options.uniforms[GraphicsProgramSymbols.UNIFORM_COLOR] = 'vec3';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_OPACITY] = 'float';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX] = 'mat4';
    options.uniforms[GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX] = 'mat4';

    options.uniforms[GraphicsProgramSymbols.UNIFORM_POINT_SIZE] = 'float';
}

function shaderPropertiesCount(options: PointMaterialOptions): number {
    let count = Object.keys(options).length;
    if (options.version) {
        count--;
    }
    return count;
}

function builder(contextId: 'webgl2' | 'webgl', options: PointMaterialOptions) {
    if (isNull(options) || isUndefined(options)) {
        options = { attributes: {}, uniforms: {} };
        defaultOptions(options);
    }
    else {
        mustBeObject('options', options);
        if (shaderPropertiesCount(options) === 0) {
            defaultOptions(options);
        }
    }

    const attributes: { [name: string]: AttributeSizeType } = isDefined(options.attributes) ? options.attributes : {};
    const uniforms: { [name: string]: UniformGlslType } = isDefined(options.uniforms) ? options.uniforms : {};

    const gpb = new GraphicsProgramBuilder();
    gpb.version(glslVersionFromWebGLContextId(options.version, contextId));

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

function vertexShaderSrc(contextId: 'webgl2' | 'webgl', options?: PointMaterialOptions): string {
    return builder(contextId, options).vertexShaderSrc();
}

function fragmentShaderSrc(contextId: 'webgl2' | 'webgl', options?: PointMaterialOptions): string {
    return builder(contextId, options).fragmentShaderSrc();
}

const LOGGING_NAME_POINT_MATERIAL = 'PointMaterial';

function getContextId(contextManager: ContextManager): 'webgl2' | 'webgl' {
    return mustBeNonNullObject('contextManager', contextManager).contextId;
}

/**
 *
 */
export class PointMaterial extends ShaderMaterial {

    /**
     * 
     */
    constructor(contextManager: ContextManager, options: PointMaterialOptions, levelUp = 0) {
        super(vertexShaderSrc(getContextId(contextManager), options), fragmentShaderSrc(getContextId(contextManager), options), [], contextManager, levelUp + 1);
        this.setLoggingName(LOGGING_NAME_POINT_MATERIAL);
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName(LOGGING_NAME_POINT_MATERIAL);
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
