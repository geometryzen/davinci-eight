import IContextProvider from './IContextProvider';
import readOnly from '../i18n/readOnly';
import Shareable from './Shareable';
import WebGLRenderer from './WebGLRenderer';

/**
 * Intentionally undocumented.
 */
export default class WebGLContextProvider extends Shareable implements IContextProvider {

  private _renderer: WebGLRenderer

  constructor(renderer: WebGLRenderer) {
    super('WebGLContextProvider')
    this._renderer = renderer
  }

  protected destructor(): void {
    super.destructor()
  }

  get gl() {
    return this._renderer.gl
  }
  set gl(unused) {
    throw new Error(readOnly('gl').message)
  }
}
