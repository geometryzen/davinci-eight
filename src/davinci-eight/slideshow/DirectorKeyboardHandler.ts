import Director = require('../slideshow/Director')
import IKeyboardHandler = require('../devices/IKeyboardHandler')
import Shareable = require('../utils/Shareable')

class DirectorKeyboardHandler extends Shareable implements IKeyboardHandler {
  private director: Director;
  constructor(director: Director) {
    super('DirectorKeyboardHandler')
    this.director = director
    this.director.addRef()
  }
  protected destructor() {
    this.director.release()
    this.director = void 0
    super.destructor()
  }
  keyDown(event: KeyboardEvent) {
  }
  keyUp(event: KeyboardEvent) {
    switch(event.keyCode) {
      case 37: {
        this.director.backward()
      }
      break
      case 39: {
        this.director.forward()
      }
      default: {
      }
    }
  }
}

export = DirectorKeyboardHandler