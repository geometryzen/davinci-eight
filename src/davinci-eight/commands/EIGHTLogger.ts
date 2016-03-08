import core from '../core';
import ContextProvider from '../core/ContextProvider';
import incLevel from '../base/incLevel';
import ShareableBase from '../core/ShareableBase';

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
   * @param [level = 0] {number}
   */
  constructor(level = 0) {
    super('EIGHTLogger', incLevel(level))
  }

  /**
   * @method destructor
   * @param level {number}
   * @return void
   * @protected
   */
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
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
    console.log(`${core.NAMESPACE} ${core.VERSION} (${core.GITHUB}) ${core.LAST_MODIFIED}`);
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
