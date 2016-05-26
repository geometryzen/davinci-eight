import {Shareable} from '../core/Shareable';

interface IKeyboardHandler extends Shareable {
    keyDown(event: KeyboardEvent): void;
    keyUp(event: KeyboardEvent): void;
}

export default IKeyboardHandler;
