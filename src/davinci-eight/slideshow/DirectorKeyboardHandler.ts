import Director from '../slideshow/Director';
import IKeyboardHandler from '../devices/IKeyboardHandler';
import {ShareableBase} from '../core/ShareableBase';

export default class DirectorKeyboardHandler extends ShareableBase implements IKeyboardHandler {
  private director: Director;
  constructor(director: Director) {
    super();
    this.setLoggingName('DirectorKeyboardHandler');
    this.director = director;
    this.director.addRef();
  }
  protected destructor(levelUp: number) {
    this.director.release();
    this.director = void 0;
    super.destructor(levelUp + 1);
  }
  keyDown(event: KeyboardEvent) {
    // Do nothing yet.
  }
  keyUp(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 37: {
        this.director.backward();
      }
        break
      case 39: {
        this.director.forward();
      }
      default: {
        // Do nothing yet.
      }
    }
  }
}
