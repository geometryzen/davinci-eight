
export default class Controller<T> {
  initialValue: T;
  /**
   * Those who extend this class will put their DOM elements in here.
   */
  domElement: HTMLDivElement;
  /**
   * The object to manipulate
   */
  object: {};
  /**
   * The name of the property to manipulate
   */
  property: string;
  /**
   * The function to be called on change.
   */
  protected __onChange: () => any;
  /**
   * The function to be called on finishing change.
   */
  protected __onFinishChange: () => any;
  /**
   * 
   */
  public __li: HTMLLIElement;
  public __gui: any;
  constructor(object: {}, property: string) {

    this.initialValue = object[property];

    this.domElement = document.createElement('div');

    this.object = object;

    this.property = property;

    this.__onChange = undefined;

    this.__onFinishChange = undefined;
  }

  /**
   * Specify that a function fire every time someone changes the value with
   * this Controller.
   *
   * @param {Function} fnc This function will be called whenever the value
   * is modified via this Controller.
   * @returns {dat.controllers.Controller} this
   */
  onChange(fnc: () => any) {
    this.__onChange = fnc;
    return this;
  }

  /**
   * Specify that a function fire every time someone "finishes" changing
   * the value wih this Controller. Useful for values that change
   * incrementally like numbers or strings.
   *
   * @param {Function} fnc This function will be called whenever
   * someone "finishes" changing the value via this Controller.
   * @returns {dat.controllers.Controller} this
   */
  onFinishChange(fnc: () => any) {
    this.__onFinishChange = fnc;
    return this;
  }

  /**
   * Change the value of <code>object[property]</code>
   *
   * @param {Object} newValue The new value of <code>object[property]</code>
   */
  setValue(newValue: T): void {
    this.object[this.property] = newValue;
    if (this.__onChange) {
      this.__onChange.call(this, newValue);
    }
    this.updateDisplay();
  }

  /**
   * Gets the value of <code>object[property]</code>
   *
   * @returns {Object} The current value of <code>object[property]</code>
   */
  getValue(): T {
    return this.object[this.property];
  }

  /**
   * Refreshes the visual display of a Controller in order to keep sync
   * with the object's current value.
   * @returns {dat.controllers.Controller} this
   */
  protected updateDisplay(): void {
    throw new Error("updateDisplay method should be implemented by derived class");
  }

  /**
   * @returns {Boolean} true if the value has deviated from initialValue
   */
  isModified() {
    return this.initialValue !== this.getValue();
  }
}
