import ContextProvider from './ContextProvider';
import readOnly from '../i18n/readOnly';
import ShareableBase from './ShareableBase';
import Engine from './Engine';

/**
 * Intentionally undocumented.
 */
export default class DefaultContextProvider extends ShareableBase implements ContextProvider {

  private _renderer: Engine

  constructor(renderer: Engine) {
    super('DefaultContextProvider')
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
