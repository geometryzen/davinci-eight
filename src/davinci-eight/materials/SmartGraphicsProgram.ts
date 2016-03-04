import fragmentShaderSrc from './fragmentShaderSrc';
import MaterialBase from './MaterialBase';
import vertexShaderSrc from './vertexShaderSrc';

/**
 *
 */
export default class SmartGraphicsProgram extends MaterialBase {
  constructor(
    aParams: { [name: string]: { glslType: string } },
    uParams: { [name: string]: { glslType: string } },
    vColor: boolean,
    vLight: boolean
  ) {
    super(vertexShaderSrc(aParams, uParams, vColor, vLight), fragmentShaderSrc(aParams, uParams, vColor, vLight), [], 'SmartGraphicsProgram')
  }
}
