import {Engine} from '../core/Engine';
import fShaderSrc from './fragmentShaderSrc';
import {ShaderMaterial} from './ShaderMaterial';
import vShaderSrc from './vertexShaderSrc';

/**
 *
 */
export class SmartGraphicsProgram extends ShaderMaterial {
    constructor(
        aParams: { [name: string]: { glslType: string } },
        uParams: { [name: string]: { glslType: string } },
        vColor: boolean,
        vLight: boolean,
        engine: Engine,
        levelUp = 0
    ) {
        super(
            vShaderSrc(aParams, uParams, vColor, vLight),
            fShaderSrc(aParams, uParams, vColor, vLight),
            [],
            engine,
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
