import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMetaInfos = require('../core/UniformMetaInfos');
declare class Uniform2fvProvider extends DefaultUniformProvider {
    private name;
    private data;
    private glslType;
    private canonicalName;
    constructor(name: string, data: () => number[], glslType?: string, canonicalName?: string);
    getUniformVector2(name: string): number[];
    getUniformMetaInfos(): UniformMetaInfos;
}
export = Uniform2fvProvider;
