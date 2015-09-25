import ContextController = require('../core/ContextController');
import IContextProvider = require('../core/IContextProvider');
import ContextMonitor = require('../core/ContextMonitor');
import ContextUnique = require('../core/ContextUnique');
/**
 * @interface ContextKahuna
 * @extends ContextController
 * @extends IContextProvider
 * @extends ContextMonitor
 * @extends ContextUnique
 */
interface ContextKahuna extends ContextController, IContextProvider, ContextMonitor, ContextUnique {

}

export = ContextKahuna;