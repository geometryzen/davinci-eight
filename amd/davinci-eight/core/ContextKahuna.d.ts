import ContextController = require('../core/ContextController');
import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import ContextUnique = require('../core/ContextUnique');
/**
 * @interface ContextKahuna
 * @extends ContextController
 * @extends ContextManager
 * @extends ContextMonitor
 * @extends ContextUnique
 */
interface ContextKahuna extends ContextController, ContextManager, ContextMonitor, ContextUnique {
}
export = ContextKahuna;
