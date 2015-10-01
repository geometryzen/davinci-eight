import ContextUnique = require('../core/ContextUnique');
import IContextConsumer = require('../core/IContextConsumer');
import IUnknown = require('../core/IUnknown');
/**
 * @class IContextMonitor
 * @extends ContextUnique
 * @extends IUnknown
 */
interface IContextMonitor extends ContextUnique, IUnknown {
    /**
     *
     */
    addContextListener(user: IContextConsumer): void;
    /**
     *
     */
    removeContextListener(user: IContextConsumer): void;
    /**
     *
     */
    synchronize(user: IContextConsumer): void;
}
export = IContextMonitor;
