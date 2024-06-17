import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
import { AttributeGlslType } from "../core/AttributeGlslType";
import { ContextManager } from "../core/ContextManager";
import { UniformGlslType } from "../core/UniformGlslType";
import { fragmentShaderSrc as fShaderSrc } from "./fragmentShaderSrc";
import { glslVersionFromWebGLContextId } from "./glslVersionFromWebGLContextId";
import { ShaderMaterial } from "./ShaderMaterial";
import { vertexShaderSrc as vShaderSrc } from "./vertexShaderSrc";

function getContextId(contextManager: ContextManager): "webgl2" | "webgl" {
    return mustBeNonNullObject("contextManager", contextManager).contextId;
}

/**
 * A Material that is generated based upon knowledge of parameters and some hints.
 * This is currently not exposed and has limited testing.
 * @hidden
 */
export class SmartGraphicsProgram extends ShaderMaterial {
    /**
     *
     */
    constructor(aParams: { [name: string]: { glslType: AttributeGlslType } }, uParams: { [name: string]: { glslType: UniformGlslType } }, vColor: boolean, vCoords: boolean, vLight: boolean, contextManager: ContextManager, levelUp = 0) {
        super(
            vShaderSrc(aParams, uParams, vColor, vCoords, vLight, glslVersionFromWebGLContextId(void 0, getContextId(contextManager))),
            fShaderSrc(aParams, uParams, vColor, vCoords, vLight, glslVersionFromWebGLContextId(void 0, getContextId(contextManager))),
            [],
            contextManager,
            levelUp + 1
        );
        this.setLoggingName("SmartGraphicsProgram");
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     *
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName("SmartGraphicsProgram");
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
