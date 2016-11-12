import ContextProvider from '../core/ContextProvider';
import { ShareableBase } from '../core/ShareableBase';

const QUALIFIED_NAME = 'EIGHT.VersionLogger'

/**
 * Displays details about the WegGL version to the console.
 */
export default class VersionLogger extends ShareableBase {
  constructor() {
    super()
    this.setLoggingName(QUALIFIED_NAME)
  }

  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1)
  }

  contextFree(): void {
    // Do nothing.
  }

  contextGain(contextProvider: ContextProvider): void {
    const gl = contextProvider.gl;
    console.log(gl.getParameter(gl.VERSION));
  }

  contextLost(): void {
    // Do nothing.
  }

  get name(): string {
    return QUALIFIED_NAME
  }
}
