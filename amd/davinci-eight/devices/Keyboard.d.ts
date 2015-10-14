import IKeyboardHandler = require('../devices/IKeyboardHandler');
import Shareable = require('../utils/Shareable');
declare class Keyboard extends Shareable {
    private handler;
    private document;
    private useCapture;
    private keyDownHandler;
    private keyUpHandler;
    currentlyPressedKeys: boolean[];
    constructor(handler: IKeyboardHandler, document?: Document);
    protected destructor(): void;
    attach(handler: IKeyboardHandler, document?: Document, useCapture?: boolean): void;
    detach(): void;
}
export = Keyboard;
