import { AttributeSizeType } from '../core/AttributeSizeType';
import { UniformGlslType } from '../core/UniformGlslType';
import { Primitive } from '../core/Primitive';
/**
 * GraphicsProgramBuilder is the builder pattern for generating vertex and fragment shader source code.
 */
export declare class GraphicsProgramBuilder {
    private aMeta;
    private uParams;
    /**
     * @param primitive
     */
    constructor(primitive?: Primitive);
    attribute(name: string, size: AttributeSizeType): this;
    uniform(name: string, glslType: UniformGlslType): this;
    /**
     * Computes vertex shader source code consistent with the state of this builder.
     */
    vertexShaderSrc(): string;
    /**
     * Computes fragment shader source code consistent with the state of this builder.
     */
    fragmentShaderSrc(): string;
}
