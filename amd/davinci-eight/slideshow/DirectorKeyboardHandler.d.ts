import Director = require('../slideshow/Director');
import IKeyboardHandler = require('../devices/IKeyboardHandler');
import Shareable = require('../utils/Shareable');
declare class DirectorKeyboardHandler extends Shareable implements IKeyboardHandler {
    private director;
    constructor(director: Director);
    protected destructor(): void;
    keyDown(event: KeyboardEvent): void;
    keyUp(event: KeyboardEvent): void;
}
export = DirectorKeyboardHandler;
