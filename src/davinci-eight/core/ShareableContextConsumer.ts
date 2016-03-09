import cleanUp from './cleanUp';
import ContextConsumer from './ContextConsumer';
import ContextProvider from './ContextProvider';
import Engine from './Engine';
import incLevel from '../base/incLevel';
import isUndefined from '../checks/isUndefined';
import isNull from '../checks/isNull';
import mustBeBoolean from '../checks/mustBeBoolean'
import mustBeObject from '../checks/mustBeObject'
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
 * subscribe to <code>Engine</code> events. Extending this class provides automatic
 * subscribe at construction time and automatic unsubscribe in destruction. However,
 * it does not provide automatic synchronization (contextGain events) or automatic clean up
 * (contextFree or contextLost events) as these would violate the principle that the base
 * class should not call derived class methods during construction or destruction.
 * </p>
 *
 * @example
 *     class MyContextConsumer extends EIGHT.ShareableContextConsumer {
 *       constructor(engine: EIGHT.Engine) {
 *         // Allocate your own resources here or on-demand.
 *         super(engine)
 *         this.setLoggingName('MyContextConsumer')
 *       }
 *       protected destructor(level: number): void {
 *         // Deallocate your own resources here.
 *         super.destructor(level + 1)
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
   * @param engine {Engine} The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
   */
  constructor(engine: Engine) {
    super()
    this.setLoggingName('ShareableContextConsumer')
    if (engine instanceof Engine) {
      // Don't synchronize as that would violate the Implementation Hierarchy Principle.
      this.subscribe(engine, false)
    }
    else if (!isNull(engine) && !isUndefined(engine)) {
      throw new Error(`engine must be an Engine or null or undefined. typeof engine => ${typeof engine}`)
    }
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   */
  protected destructor(level: number): void {
    this.unsubscribe(false)
    super.destructor(incLevel(level))
  }

  /**
   * <p>
   * Instructs the consumer to subscribe to context events.
   * </p>
   * <p>
   * This method is idempotent; calling it more than once with the same <code>Engine</code> does not change the state.
   * </p>
   *
   * @method subscribe
   * @param engine {Engine}
   * @param synchronize {boolean}
   * @return {void}
   */
  subscribe(engine: Engine, synchronize: boolean): void {
    engine = mustBeObject('engine', engine)
    synchronize = mustBeBoolean('synchronize', synchronize)
    if (!this.engine) {
      engine.addRef()
      this.engine = engine
      engine.addContextListener(this)
      if (synchronize) {
        engine.synchronize(this)
      }
    }
    else {
      if (this.engine !== engine) {
        // We can only subscribe to one Engine at at time.
        this.unsubscribe(synchronize)
        this.subscribe(engine, synchronize)
      }
      else {
        // We are already subscribed to this engine (Idempotentency)
      }
    }
  }

  protected synchUp() {
    const engine = this.engine
    if (engine) {
      engine.synchronize(this)
    }
  }

  protected cleanUp() {
    cleanUp(this.contextProvider, this)
  }

  /**
   * <p>
   * Instructs the consumer to unsubscribe from context events.
   * </p>
   * <p>
   * This method is idempotent; calling it more than once does not change the state.
   * </p>
   *
   * @method unsubscribe
   * @param synchronize {boolean} Triggers <code>contextFree()</code> or <code>contextLost()</code>, as appropriate.
   * @return {void}
   */
  unsubscribe(synchronize: boolean): void {
    synchronize = mustBeBoolean('synchronize', synchronize)
    if (this.engine) {
      if (synchronize) {
        cleanUp(this.contextProvider, this)
      }
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
    if (this.contextProvider) {
      this.contextProvider.release()
      this.contextProvider = void 0
    }
  }

  /**
   * @method contextGain
   * @param contextProvider {ContextProvider}
   * @return {void}
   */
  contextGain(contextProvider: ContextProvider): void {
    if (this.contextProvider !== contextProvider) {
      if (this.contextProvider) {
        this.contextProvider.release()
        this.contextProvider = void 0
      }
      contextProvider.addRef()
      this.contextProvider = contextProvider
    }
  }

  /**
   * @method contextLost
   * @return {void}
   */
  contextLost(): void {
    if (this.contextProvider) {
      this.contextProvider.release()
      this.contextProvider = void 0
    }
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
