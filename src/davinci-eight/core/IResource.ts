import IUnknown = require('../core/IUnknown');
import ContextListener = require('../core/ContextListener');

interface IResource extends IUnknown, ContextListener {

}

export = IResource;