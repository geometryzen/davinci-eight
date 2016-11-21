import config from '../config';
import ContextProvider from '../core/ContextProvider';
import { ShareableBase } from '../core/ShareableBase';

/**
 * Displays details about EIGHT to the console.
 */
export default class EIGHTLogger extends ShareableBase {

  constructor() {
    super();
    this.setLoggingName('EIGHTLogger');
  }

  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1);
  }

  contextFree(contextProvider: ContextProvider): void {
    // Does nothing.
  }

  /**
   * Logs the namespace, version, GitHub URL, and last modified date to the console.
   */
  contextGain(contextProvider: ContextProvider): void {
    console.log(`${config.NAMESPACE} ${config.VERSION} (${config.GITHUB}) ${config.LAST_MODIFIED}`);
  }

  contextLost(): void {
    // Do nothing.
  }

  get name(): string {
    return this._type;
  }
}
