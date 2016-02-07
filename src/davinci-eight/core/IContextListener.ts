import IContextConsumer from './IContextConsumer';
import IContextMonitor from './IContextMonitor';

/**
 * @class IContextListener
 * @extends IContextConsumer
 */
interface IContextListener extends IContextConsumer {

  /**
   * Instructs the consumer to subscribe to context events.
   *
   * @method attachToMonitor
   * @param monitor {IContextMonitor}
   * @return {void}
   */
  attachToMonitor(monitor: IContextMonitor): void;

  /**
   * Instructs the consumer to unsubscribe from context events.
   *
   * @method detachFromMonitor
   * @return {void}
   */
  detachFromMonitor(): void;
}

export default IContextListener;