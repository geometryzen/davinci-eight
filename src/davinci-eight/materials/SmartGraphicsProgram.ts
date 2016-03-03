import fragmentShader from './fragmentShader';
import MaterialBase from './MaterialBase';
import vertexShader from './vertexShader';

export default class SmartGraphicsProgram extends MaterialBase {
    constructor(
        aParams: { [name: string]: { glslType: string } },
        uParams: { [name: string]: { glslType: string } },
        vColor: boolean,
        vLight: boolean
    ) {
        super(vertexShader(aParams, uParams, vColor, vLight), fragmentShader(aParams, uParams, vColor, vLight));
    }
}
