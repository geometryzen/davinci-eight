import IContextConsumer from './IContextConsumer';
import Engine from './Engine';

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
   * @param visual {Engine}
   * @return {void}
   */
  subscribe(visual: Engine): void;

  /**
   * Instructs the consumer to unsubscribe from context events.
   *
   * @method unsubscribe
   * @return {void}
   */
  unsubscribe(): void;
}

export default IContextListener;
