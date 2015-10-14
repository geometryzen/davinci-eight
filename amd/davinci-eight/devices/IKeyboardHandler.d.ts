import IUnknown = require('../core/IUnknown');
interface IKeyboardHandler extends IUnknown {
    keyDown(event: KeyboardEvent): void;
    keyUp(event: KeyboardEvent): void;
}
export = IKeyboardHandler;
