import ContextListener = require('../core/ContextListener');
import ContextUnique = require('../core/ContextUnique');
interface ContextMonitor extends ContextUnique {
    /**
     *
     */
    addContextListener(user: ContextListener): void;
    /**
     *
     */
    removeContextListener(user: ContextListener): void;
}
export = ContextMonitor;
