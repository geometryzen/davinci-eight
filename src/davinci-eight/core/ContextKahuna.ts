import ContextController from '../core/ContextController';
import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import ContextUnique from '../core/ContextUnique';
/**
 * @interface ContextKahuna
 * @extends ContextController
 * @extends IContextProvider
 * @extends IContextMonitor
 * @extends ContextUnique
 */
interface ContextKahuna extends ContextController, IContextProvider, IContextMonitor, ContextUnique {

}

export default ContextKahuna;
