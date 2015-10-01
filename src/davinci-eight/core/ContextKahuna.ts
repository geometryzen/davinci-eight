import ContextController = require('../core/ContextController');
import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import ContextUnique = require('../core/ContextUnique');
/**
 * @interface ContextKahuna
 * @extends ContextController
 * @extends IContextProvider
 * @extends IContextMonitor
 * @extends ContextUnique
 */
interface ContextKahuna extends ContextController, IContextProvider, IContextMonitor, ContextUnique {

}

export = ContextKahuna;