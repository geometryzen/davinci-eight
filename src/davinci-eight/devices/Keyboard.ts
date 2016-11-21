import IKeyboardHandler from '../devices/IKeyboardHandler';
import { ShareableBase } from '../core/ShareableBase';

function makeKeyDownHandler(keyboard: Keyboard, handler: IKeyboardHandler) {
  return function (event: KeyboardEvent) {
    keyboard.currentlyPressedKeys[event.keyCode] = true;
    handler.keyDown(event);
  };
}

function makeKeyUpHandler(keyboard: Keyboard, handler: IKeyboardHandler) {
  return function (event: KeyboardEvent) {
    keyboard.currentlyPressedKeys[event.keyCode] = false;
    handler.keyUp(event);
  };
}

export default class Keyboard extends ShareableBase {
  private handler: IKeyboardHandler;
  private document: Document;
  private useCapture: boolean;
  private keyDownHandler: (event: KeyboardEvent) => any;
  private keyUpHandler: (event: KeyboardEvent) => any;
  public currentlyPressedKeys: boolean[] = [];
  constructor(handler: IKeyboardHandler, document: Document = window.document) {
    super();
    this.setLoggingName('Keyboard');
    this.attach(handler, document);
  }
  protected destructor(levelUp: number): void {
    this.detach();
    super.destructor(levelUp + 1);
  }
  attach(handler: IKeyboardHandler, document: Document = window.document, useCapture?: boolean): void {
    if (this.document !== document) {
      this.detach();
      this.handler = handler;
      this.handler.addRef();
      this.document = document;
      this.useCapture = useCapture;
      this.keyDownHandler = makeKeyDownHandler(this, handler);
      this.keyUpHandler = makeKeyUpHandler(this, handler);

      this.document.addEventListener('keydown', this.keyDownHandler, useCapture);
      this.document.addEventListener('keyup', this.keyUpHandler, useCapture);
    }
  }
  detach(): void {
    if (this.document) {
      this.document.removeEventListener('keydown', this.keyDownHandler, this.useCapture);
      this.document.removeEventListener('keyup', this.keyUpHandler, this.useCapture);
      this.handler.release();
      this.handler = void 0;
      this.document = void 0;
      this.useCapture = void 0;
      this.keyDownHandler = void 0;
      this.keyUpHandler = void 0;
    }
  }
}
