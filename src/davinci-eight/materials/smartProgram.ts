import AttribMetaInfo from '../core/AttribMetaInfo';
import {Engine} from '../core/Engine';
import fragmentShaderSrc from './fragmentShaderSrc';
import mergeStringMapList from '../utils/mergeStringMapList';
import mustBeDefined from '../checks/mustBeDefined';
import MaterialBase from './MaterialBase';
import UniformMetaInfo from '../core/UniformMetaInfo';
import vColorRequired from './vColorRequired';
import vertexShaderSrc from './vertexShaderSrc';
import vLightRequired from './vLightRequired';

/**
 *
 */
export default function smartProgram(attributes: { [name: string]: AttribMetaInfo }, uniformsList: { [name: string]: UniformMetaInfo }[], bindings: string[], engine: Engine): MaterialBase {
  mustBeDefined('attributes', attributes);
  mustBeDefined('uniformsList', uniformsList);

  const uniforms = mergeStringMapList(uniformsList);

  const vColor: boolean = vColorRequired(attributes, uniforms);
  const vLight: boolean = vLightRequired(attributes, uniforms);

  return new MaterialBase(
    vertexShaderSrc(attributes, uniforms, vColor, vLight),
    fragmentShaderSrc(attributes, uniforms, vColor, vLight),
    bindings,
    engine
  )
}
