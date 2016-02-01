import IUnknown from '../core/IUnknown';

interface IKeyboardHandler extends IUnknown {
    keyDown(event: KeyboardEvent): void;
    keyUp(event: KeyboardEvent): void;
}

export default IKeyboardHandler;
