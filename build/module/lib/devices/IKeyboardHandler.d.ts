import { Shareable } from '../core/Shareable';
/**
 * @hidden
 */
export interface IKeyboardHandler extends Shareable {
    keyDown(event: KeyboardEvent): void;
    keyUp(event: KeyboardEvent): void;
}
