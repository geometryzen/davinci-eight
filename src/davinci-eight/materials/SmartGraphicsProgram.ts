import ContextManager from '../core/ContextManager';
import fShaderSrc from './fragmentShaderSrc';
import { ShaderMaterial } from './ShaderMaterial';
import vShaderSrc from './vertexShaderSrc';

/**
 * A Material that is generated based upon knowledge of parameters and some hints.
 */
export class SmartGraphicsProgram extends ShaderMaterial {
    constructor(
        aParams: { [name: string]: { glslType: string } },
        uParams: { [name: string]: { glslType: string } },
        vColor: boolean,
        vCoords: boolean,
        vLight: boolean,
        contextManager: ContextManager,
        levelUp = 0
    ) {
        super(
            vShaderSrc(aParams, uParams, vColor, vCoords, vLight),
            fShaderSrc(aParams, uParams, vColor, vCoords, vLight),
            [],
            contextManager,
            levelUp + 1
        )
        this.setLoggingName('SmartGraphicsProgram');
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        super.destructor(levelUp + 1)
    }
}
