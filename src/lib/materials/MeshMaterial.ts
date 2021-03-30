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
import { MeshMaterialOptions } from './MeshMaterialOptions';
import { ShaderMaterial } from './ShaderMaterial';

/**
 * @hidden
 */
function defaultOptions(options: MeshMaterialOptions): void {
    if (!options.attributes) {
        options.attributes = {};
    }
    if (!options.uniforms) {
        options.uniforms = {};
    }

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

/**
 * @hidden
 */
function shaderPropertiesCount(options: MeshMaterialOptions): number {
    let count = Object.keys(options).length;
    if (options.version) {
        count--;
    }
    return count;
}

/**
 * 
 * @param contextId The context identifier used when creating the WebGL rendering context. May be undefined.
 * @param options 
 * @hidden
 */
function builder(contextId: 'webgl2' | 'webgl', options?: MeshMaterialOptions) {
    if (isUndefined(options) || isNull(options)) {
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

/**
 * @hidden
 */
function vertexShaderSrc(contextId: 'webgl2' | 'webgl', options?: MeshMaterialOptions): string {
    return builder(contextId, options).vertexShaderSrc();
}

/**
 * @hidden
 */
function fragmentShaderSrc(contextId: 'webgl2' | 'webgl', options?: MeshMaterialOptions): string {
    return builder(contextId, options).fragmentShaderSrc();
}

/**
 * @hidden
 */
const LOGGING_NAME_MESH_MATERIAL = 'MeshMaterial';

/**
 * @hidden
 */
function getContextId(contextManager: ContextManager): 'webgl2' | 'webgl' {
    return mustBeNonNullObject('contextManager', contextManager).contextId;
}

/**
 * 
 */
export class MeshMaterial extends ShaderMaterial {
    /**
     * 1. Creates a subscription to WebGL rendering context events but does not subscribe.
     * 2. Constructs vertex and fragment shader sources.
     * 3. Sets the name for reporting reference counts.
     * 4. Synchronize with the WebGL rendering context if this is a top-level class (levelUp is zero).
     * 
     * The contextManager must be defined.
     * 
     * @param contextManager The ContextManager that will be subscribed to for WebGL rendering context events.
     * @param options Used to configure the MeshMaterial.
     * @param levelUp Defines the level of the MeshMaterial in the inheritance hierarchy.
     */
    constructor(contextManager: ContextManager, options: MeshMaterialOptions, levelUp = 0) {
        super(vertexShaderSrc(getContextId(contextManager), options), fragmentShaderSrc(getContextId(contextManager), options), [], contextManager, levelUp + 1);
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
