import { AttributeSizeType } from '../core/AttributeSizeType';
import { Primitive } from '../core/Primitive';
import { UniformGlslType } from '../core/UniformGlslType';
import { GLSLESVersion } from './glslVersion';
/**
 * GraphicsProgramBuilder is the builder pattern for generating vertex and fragment shader source code.
 * @hidden
 */
export declare class GraphicsProgramBuilder {
    private aMeta;
    private uParams;
    private _version;
    /**
     * @param primitive
     */
    constructor(primitive?: Primitive);
    attribute(name: string, size: AttributeSizeType): this;
    uniform(name: string, glslType: UniformGlslType): this;
    version(version: GLSLESVersion): this;
    /**
     * Computes vertex shader source code consistent with the state of this builder.
     */
    vertexShaderSrc(): string;
    /**
     * Computes fragment shader source code consistent with the state of this builder.
     */
    fragmentShaderSrc(): string;
}
