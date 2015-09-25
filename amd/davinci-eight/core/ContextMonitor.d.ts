import IContextConsumer = require('../core/IContextConsumer');
import ContextUnique = require('../core/ContextUnique');
interface ContextMonitor extends ContextUnique {
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
export = ContextMonitor;
