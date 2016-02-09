import IContextConsumer from '../core/IContextConsumer';
import IUnknown from '../core/IUnknown';

/**
 * @module EIGHT
 * @submodule core
 * @class IContextMonitor
 * @extends IUnknown
 */
interface IContextMonitor extends IUnknown {
    /**
     *
     */
    addContextListener(user: IContextConsumer): void;

    /**
     * @method removeContextListener
     * @param user {IContextConsumer}
     * @return {void}
     */
    removeContextListener(user: IContextConsumer): void;

    /**
     * @method synchronize
     * @param user {IContextConsumer}
     * @return {void}
     */
    synchronize(user: IContextConsumer): void;
}

export default IContextMonitor;
