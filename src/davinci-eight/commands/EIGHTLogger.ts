import config from '../config';
import ContextManager from '../core/ContextManager';
import { ShareableBase } from '../core/ShareableBase';

/**
 * Displays details about EIGHT to the console.
 */
export default class EIGHTLogger extends ShareableBase {

  constructor(private contextManager: ContextManager) {
    super();
    this.setLoggingName('EIGHTLogger');
  }

  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1);
  }

  contextFree(): void {
    // Does nothing.
  }

  /**
   * Logs the namespace, version, GitHub URL, and last modified date to the console.
   */
  contextGain(): void {
    console.log(`${config.NAMESPACE} ${config.VERSION} (${config.GITHUB}) ${config.LAST_MODIFIED}`);
  }

  contextLost(): void {
    // Do nothing.
  }
}
