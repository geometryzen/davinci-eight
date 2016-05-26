import {Engine} from '../core/Engine';
import fShaderSrc from './fragmentShaderSrc';
import {MaterialBase} from './MaterialBase';
import vShaderSrc from './vertexShaderSrc';

/**
 *
 */
export class SmartGraphicsProgram extends MaterialBase {
  constructor(
    aParams: { [name: string]: { glslType: string } },
    uParams: { [name: string]: { glslType: string } },
    vColor: boolean,
    vLight: boolean,
    engine: Engine
  ) {
    super(
      vShaderSrc(aParams, uParams, vColor, vLight),
      fShaderSrc(aParams, uParams, vColor, vLight),
      [],
      engine
    )
    this.setLoggingName('SmartGraphicsProgram')
  }
  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1)
  }
}
