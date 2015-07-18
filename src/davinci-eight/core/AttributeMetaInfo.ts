/**
 * @class AttributeMetaInfo
 */
interface AttributeMetaInfo {
  name: string,
  type: string,
  size: number,
  normalized: boolean,
  stride: number,
  offset: number
}

export = AttributeMetaInfo;
