import { ContextManager } from '../core/ContextManager';
import { ShareableBase } from '../core/ShareableBase';

/**
 * Displays details about the WegGL version to the console.
 */
export class VersionLogger extends ShareableBase {
  constructor(private contextManager: ContextManager) {
    super();
    this.setLoggingName("VersionLogger");
  }

  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1);
  }

  contextFree(): void {
    // Do nothing.
  }

  contextGain(): void {
    const gl = this.contextManager.gl;
    console.log(gl.getParameter(gl.VERSION));
  }

  contextLost(): void {
    // Do nothing.
  }
}
