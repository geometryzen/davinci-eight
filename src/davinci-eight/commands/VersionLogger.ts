import ContextProvider from '../core/ContextProvider';
import {ShareableBase} from '../core/ShareableBase';

const QUALIFIED_NAME = 'EIGHT.VersionLogger'

/**
 * @class VersionLogger
 * @extends ShareableBase
 */
export default class VersionLogger extends ShareableBase {
  /**
   * <p>
   * Displays details about the WegGL version to the console.
   * </p> 
   * <p>
   * Initializes the <code>type</code> property to <code>'VersionLogger'</code> for reference count tracking.
   * </p>
   * @class VersionLogger
   * @constructor
   */
  constructor() {
    super()
    this.setLoggingName(QUALIFIED_NAME)
  }

  /**
   * @method destructor
   * @param levelUp {number}
   * @return {void}
   * @protected
   */
  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1)
  }

  contextFree(): void {
    // Do nothing.
  }

  /**
   * <p>
   * Logs the WebGL <code>VERSION</code> parameter to the console.
   * </p>
   * @method contextGain
   * @param manager {ContextProvider}
   * @return {void}
   */
  contextGain(manager: ContextProvider): void {
    const gl = manager.gl
    console.log(gl.getParameter(gl.VERSION))
  }
  contextLost(): void {
    // Do nothing.
  }
  get name(): string {
    return QUALIFIED_NAME
  }
}
