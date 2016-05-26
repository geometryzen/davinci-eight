import ContextProvider from '../core/ContextProvider';
import mustBeNumber from '../checks/mustBeNumber';
import {ShareableBase} from '../core/ShareableBase';

/**
 * <p>
 * clearColor(red: number, green: number, blue: number, alpha: number): void
 * <p>
 */
export class WebGLClearColor extends ShareableBase {
  public red: number;
  public green: number;
  public blue: number;
  public alpha: number;

  /**
   * @param red
   * @param green
   * @param blue
   * @param alpha
   */
  constructor(red = 0, green = 0, blue = 0, alpha = 1) {
    super()
    this.setLoggingName('WebGLClearColor')
    this.red = mustBeNumber('red', red)
    this.green = mustBeNumber('green', green)
    this.blue = mustBeNumber('blue', blue)
    this.alpha = mustBeNumber('alpha', alpha)
  }

  /**
   *
   */
  destructor(levelUp: number): void {
    this.red = void 0
    this.green = void 0
    this.blue = void 0
    this.alpha = void 0
    super.destructor(levelUp + 1)
  }

  contextFree(manager: ContextProvider): void {
    // Do nothing;
  }

  contextGain(manager: ContextProvider): void {
    mustBeNumber('red', this.red)
    mustBeNumber('green', this.green)
    mustBeNumber('blue', this.blue)
    mustBeNumber('alpha', this.alpha)
    manager.gl.clearColor(this.red, this.green, this.blue, this.alpha)
  }

  contextLost(): void {
    // Do nothing;
  }
}
