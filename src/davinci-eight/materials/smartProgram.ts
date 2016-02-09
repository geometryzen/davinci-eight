import AttribMetaInfo from '../core/AttribMetaInfo';
import fragmentShader from './fragmentShader';
import mergeStringMapList from '../utils/mergeStringMapList';
import mustBeDefined from '../checks/mustBeDefined';
import Material from '../core/Material';
import UniformMetaInfo from '../core/UniformMetaInfo';
import vColorRequired from './vColorRequired';
import vertexShader from './vertexShader';
import vLightRequired from './vLightRequired';

/**
 *
 */
export default function smartProgram(attributes: { [name: string]: AttribMetaInfo }, uniformsList: { [name: string]: UniformMetaInfo }[], bindings: string[]): Material {
    mustBeDefined('attributes', attributes);
    mustBeDefined('uniformsList', uniformsList);

    const uniforms = mergeStringMapList(uniformsList);

    const vColor: boolean = vColorRequired(attributes, uniforms);
    const vLight: boolean = vLightRequired(attributes, uniforms);

    return new Material(vertexShader(attributes, uniforms, vColor, vLight), fragmentShader(attributes, uniforms, vColor, vLight), bindings);
}
