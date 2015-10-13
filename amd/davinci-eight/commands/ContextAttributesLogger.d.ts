import IContextCommand = require('../core/IContextCommand');
import IContextProvider = require('../core/IContextProvider');
import Shareable = require('../utils/Shareable');
/**
 * <p>
 * Displays details about the WegGL version to the console.
 * <p>
 * @class ContextAttributesLogger
 * @extends Shareable
 * @implements IContextCommand
 */
declare class ContextAttributesLogger extends Shareable implements IContextCommand {
    constructor();
    contextFree(canvasId: number): void;
    contextGain(manager: IContextProvider): void;
    contextLost(canvasId: number): void;
    destructor(): void;
    name: string;
}
export = ContextAttributesLogger;
