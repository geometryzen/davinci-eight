import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformProvider = require('../core/UniformProvider');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
declare class MultiUniformProvider extends DefaultUniformProvider {
    private providers;
    constructor(providers: UniformProvider[]);
    getUniformFloat(name: string): number;
    getUniformMatrix2(name: string): {
        transpose: boolean;
        matrix2: Float32Array;
    };
    getUniformMatrix3(name: string): {
        transpose: boolean;
        matrix3: Float32Array;
    };
    getUniformMatrix4(name: string): {
        transpose: boolean;
        matrix4: Float32Array;
    };
    getUniformVector2(name: string): number[];
    getUniformVector3(name: string): number[];
    getUniformVector4(name: string): number[];
    getUniformMeta(): UniformMetaInfos;
}
export = MultiUniformProvider;
