import { AttributeSizeType } from '../core/AttributeSizeType';
import { UniformGlslType } from '../core/UniformGlslType';
import { Primitive } from '../core/Primitive';
import { GLSLESVersion } from './glslVersion';
/**
 * GraphicsProgramBuilder is the builder pattern for generating vertex and fragment shader source code.
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
