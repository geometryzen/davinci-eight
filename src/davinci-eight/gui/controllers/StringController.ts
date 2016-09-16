import Controller from './Controller';
import bind from '../dom/bind';
import isActive from '../dom/isActive';

export default class StringController extends Controller<string> {
  private __input: HTMLInputElement;
  constructor(object: {}, property: string) {
    super(object, property);

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    const onChange = () => {
      this.setValue(this.__input.value);
    };

    const onBlur = () => {
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    };
    bind(this.__input, 'keyup', onChange);
    bind(this.__input, 'change', onChange);
    bind(this.__input, 'blur', onBlur);
    // Hitting the Enter key while in the field should trigger the same action as losing focus.
    bind(this.__input, 'keydown', (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        // We could use the this keyword directly  with a normal function to refer to the control,
        // but this is more type-safe.
        this.__input.blur();
      }
    });

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  }
  /**
   * 
   */
  protected updateDisplay() {
    // Stops the caret from moving on account of:
    // keyup -> setValue -> updateDisplay
    if (!isActive(this.__input)) {
      this.__input.value = this.getValue();
    }
  }
}
