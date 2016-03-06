import cleanUp from './cleanUp';
import ContextConsumer from './ContextConsumer';
import ContextProvider from './ContextProvider';
import Engine from './Engine';
import isUndefined from '../checks/isUndefined';
import isNull from '../checks/isNull';
import readOnly from '../i18n/readOnly';
import ShareableBase from './ShareableBase';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * <p>
 * A base <code>class</class> for <code>ContextConsumer</code>(s).
 * </p>
 * <p>
 * Using this base <code>class</code> provides a standard and reliable way to
 * subscribe to <code>Engine</code> events.
 * </p>
 *
 * @example
 *     class MyContextConsumer extends EIGHT.ShareableContextConsumer {
 *       constructor(engine: EIGHT.Engine) {
 *         // Allocate your own resources here or on-demand.
 *         super('MyContextConsumer', engine)
 *       }
 *       protected destructor(): void {
 *         // Deallocate your own resources here.
 *         super.destructor()
 *       }
 *     }
 *
 * @class ShareableContextConsumer
 * @extends ShareableBase
 * @extends ContextConsumer
 */
export default class ShareableContextConsumer extends ShareableBase implements ContextConsumer {

  /**
   * @property engine
   * @type Engine
   * @private
   */
  private engine: Engine;

  /**
   * @property contextProvider
   * @type {ContextProvider}
   * @protected
   */
  protected contextProvider: ContextProvider;

  /**
   * @class ShareableContextConsumer
   * @constructor
   * @param type {string} The name of the derived class for logging purposes.
   * @param engine {Engine} The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
   */
  constructor(type: string, engine: Engine) {
    super(type)
    if (engine instanceof Engine) {
      this.subscribe(engine)
    }
    else if (!isNull(engine) && !isUndefined(engine)) {
      throw new Error(`engine must be an Engine or null or undefined. typeof engine => ${typeof engine}`)
    }
  }

  /**
   * @method destructor
   * @return {void}
   */
  protected destructor(): void {
    this.unsubscribe()
    super.destructor()
  }

  /**
   * <p>
   * Instructs the consumer to subscribe to context events.
   * </p>
   *
   *
   * @method subscribe
   * @param engine {Engine}
   * @return {void}
   */
  subscribe(engine: Engine): void {
    if (!this.engine) {
      engine.addRef()
      this.engine = engine
      engine.addContextListener(this)
      engine.synchronize(this)
    }
    else {
      this.unsubscribe()
      this.subscribe(engine)
    }
  }

  /**
   * Instructs the consumer to unsubscribe from context events.
   *
   * @method unsubscribe
   * @return {void}
   */
  unsubscribe(): void {
    if (this.contextProvider) {
      cleanUp(this.contextProvider, this)
    }
    if (this.engine) {
      this.engine.removeContextListener(this)
      this.engine.release()
      this.engine = void 0
    }
  }

  /**
   * @method contextFree
   * @param contextProvider {ContextProvider}
   * @return {void}
   */
  contextFree(contextProvider: ContextProvider): void {
    this.contextProvider = void 0
  }

  /**
   * @method contextGain
   * @param contextProvider {ContextProvider}
   * @return {void}
   */
  contextGain(contextProvider: ContextProvider): void {
    this.contextProvider = contextProvider
  }

  /**
   * @method contextLost
   * @return {void}
   */
  contextLost(): void {
    this.contextProvider = void 0
  }

  /**
   * <p>
   * Provides access to the underlying WebGL context.
   * </p>
   * <p>
   * This property is deprecated to encourage access throught the <code>ContextProvider</code>.
   * </p>
   * 
   * @property gl
   * @type WebGLRenderingContext
   * @readOnly
   * @deprecated
   */
  get gl(): WebGLRenderingContext {
    if (this.contextProvider) {
      return this.contextProvider.gl
    }
    else {
      return void 0
    }
  }
  set gl(unused: WebGLRenderingContext) {
    throw new Error(readOnly('gl').message)
  }
}
