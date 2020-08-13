import { AttributeGlslType } from '../core/AttributeGlslType';
import { ContextManager } from '../core/ContextManager';
import { UniformGlslType } from '../core/UniformGlslType';
import { ShaderMaterial } from './ShaderMaterial';
/**
 * A Material that is generated based upon knowledge of parameters and some hints.
 * This is currently not exposed and has limited testing.
 */
export declare class SmartGraphicsProgram extends ShaderMaterial {
    /**
     *
     */
    constructor(aParams: {
        [name: string]: {
            glslType: AttributeGlslType;
        };
    }, uParams: {
        [name: string]: {
            glslType: UniformGlslType;
        };
    }, vColor: boolean, vCoords: boolean, vLight: boolean, contextManager: ContextManager, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
}
