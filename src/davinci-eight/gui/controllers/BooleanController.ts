import Controller from './Controller';

export default class BooleanController extends Controller<boolean> {
  private __prev: boolean;
  private __checkbox: HTMLInputElement;
  constructor(object: {}, property: string) {
    super(object, property);
    this.__prev = this.getValue();

    this.__checkbox = document.createElement('input');
    this.__checkbox.setAttribute('type', 'checkbox');

    const onChange = () => {
      this.setValue(!this.__prev);
    };

    this.__checkbox.addEventListener('change', onChange, false);

    this.domElement.appendChild(this.__checkbox);

    // Match original value
    this.updateDisplay();
  }
  setValue(v: boolean) {
    super.setValue(v);
    if (this.__onFinishChange) {
      this.__onFinishChange.call(this, this.getValue());
    }
    this.__prev = this.getValue();
  }
  /**
   * 
   */
  updateDisplay() {
    if (this.getValue() === true) {
      this.__checkbox.setAttribute('checked', 'checked');
      this.__checkbox.checked = true;
    }
    else {
      this.__checkbox.checked = false;
    }
  }
}
