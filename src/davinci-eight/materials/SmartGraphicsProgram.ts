import Engine from '../core/Engine';
import fragmentShaderSrc from './fragmentShaderSrc';
import Material from './Material';
import mustBeNumber from '../checks/mustBeNumber';
import vertexShaderSrc from './vertexShaderSrc';

/**
 *
 */
export default class SmartGraphicsProgram extends Material {
  constructor(
    aParams: { [name: string]: { glslType: string } },
    uParams: { [name: string]: { glslType: string } },
    vColor: boolean,
    vLight: boolean,
    engine: Engine,
    level: number
  ) {
    super(
      vertexShaderSrc(aParams, uParams, vColor, vLight),
      fragmentShaderSrc(aParams, uParams, vColor, vLight),
      [],
      'SmartGraphicsProgram',
      engine,
      mustBeNumber('level', level) + 1
    )
    if (level === 0) {
      this.synchUp()
    }
  }
  // FIXME: destructor
}
