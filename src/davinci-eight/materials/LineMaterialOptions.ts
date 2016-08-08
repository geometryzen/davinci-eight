import MaterialOptions from './MaterialOptions'

/**
 *
 */
interface LineMaterialOptions extends MaterialOptions {

  /**
   *
   */
  attributes?: { [name: string]: number }

  /**
   *
   */
  uniforms?: { [name: string]: string }
}

export default LineMaterialOptions
