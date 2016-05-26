import {FacetVisitor} from './FacetVisitor';
import {ContextConsumer} from './ContextConsumer';
import UniformLocation from './UniformLocation';

/**
 * <p>
 * <code>Material</code> is an object-oriented wrapper around a <code>WebGLProgram</code>
 * <p/>
 */
export interface Material extends FacetVisitor, ContextConsumer {

  /**
   *
   */
  vertexShaderSrc: string

  /**
   *
   */
  fragmentShaderSrc: string

  /**
   * @param name
   * @returns
   */
  getAttribLocation(name: string): number

  /**
   * @param name
   * @returns
   */
  getUniformLocation(name: string): UniformLocation

  /**
   *
   */
  use(): void
}
