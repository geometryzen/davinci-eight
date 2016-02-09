import IContextConsumer from './IContextConsumer';
import IContextMonitor from './IContextMonitor';

/**
 * @module EIGHT
 * @submodule core
 * @class IContextListener
 * @extends IContextConsumer
 */
interface IContextListener extends IContextConsumer {

  /**
   * Instructs the consumer to subscribe to context events.
   *
   * @method subscribe
   * @param monitor {IContextMonitor}
   * @return {void}
   */
  subscribe(monitor: IContextMonitor): void;

  /**
   * Instructs the consumer to unsubscribe from context events.
   *
   * @method unsubscribe
   * @return {void}
   */
  unsubscribe(): void;
}

export default IContextListener;
