import config from '../config';
import ContextProvider from '../core/ContextProvider';
import {ShareableBase} from '../core/ShareableBase';

/**
 * @module EIGHT
 * @submodule commands
 */

/**
 * <p>
 * Displays details about EIGHT to the console.
 * <p> 
 * @class EIGHTLogger
 * @extends ShareableBase
 */
export default class EIGHTLogger extends ShareableBase {

  /**
   * <p>
   * Initializes <b>the</b> `type` property to 'EIGHTLogger'.
   * </p>
   * @class EIGHTLogger
   * @constructor
   */
  constructor() {
    super()
    this.setLoggingName('EIGHTLogger')
  }

  /**
   * @method destructor
   * @param levelUp {number}
   * @return void
   * @protected
   */
  protected destructor(levelUp: number): void {
    super.destructor(levelUp + 1)
  }

  /**
   * @method contextFree
   * @param contextProvider {ContextProvider}
   * @return {void}
   */
  contextFree(contextProvider: ContextProvider): void {
    // Does nothing.
  }

  /**
   * Logs the namespace, version, GitHub URL, and last modified date to the console.
   *
   * @method execute
   * @param unused WebGLRenderingContext
   * @return {void}
   */
  contextGain(contextProvider: ContextProvider): void {
    console.log(`${config.NAMESPACE} ${config.VERSION} (${config.GITHUB}) ${config.LAST_MODIFIED}`);
  }

  /**
   * @method contextLost
   * @return {void}
   */
  contextLost(): void {
    // Do nothing.
  }

  get name(): string {
    return this._type;
  }
}
