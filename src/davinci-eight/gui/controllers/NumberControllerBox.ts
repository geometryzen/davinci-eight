import NumberController from './NumberController';
import bind from '../dom/bind';
import unbind from '../dom/unbind';

function roundToDecimal(value: number, decimals: number) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}

export default class NumberControllerBox extends NumberController {
  private __truncationSuspended: boolean;
  private __input: HTMLInputElement;
  constructor(object: {}, property: string, params: {}) {
    super(object, property);
    this.__truncationSuspended = false;

    /**
     * {Number} Previous mouse y position
     * @ignore
     */
    let prev_y: number;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    // Makes it so manually specified values are not truncated.

    const onChange = () => {
      var attempted = parseFloat(this.__input.value);
      if (!isNaN(attempted)) this.setValue(attempted);
    };

    const onBlur = () => {
      onChange();
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    };

    bind(this.__input, 'change', onChange);
    bind(this.__input, 'blur', onBlur);
    bind(this.__input, 'mousedown', onMouseDown);
    bind(this.__input, 'keydown', (e: KeyboardEvent) => {

      // When pressing entire, you can be as precise as you want.
      if (e.keyCode === 13) {
        this.__truncationSuspended = true;
        // TODO this.blur();
        this.__truncationSuspended = false;
      }

    });

    const onMouseDrag = (e: MouseEvent) => {

      const diff = prev_y - e.clientY;
      this.setValue(this.getValue() + diff * this.__impliedStep);

      prev_y = e.clientY;

    };

    function onMouseDown(e: MouseEvent) {
      bind(window, 'mousemove', onMouseDrag);
      bind(window, 'mouseup', onMouseUp);
      prev_y = e.clientY;
    }


    function onMouseUp() {
      unbind(window, 'mousemove', onMouseDrag);
      unbind(window, 'mouseup', onMouseUp);
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  }
  updateDisplay() {

    this.__input.value = <any>(this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision));
    // super.updateDisplay();
  }

}
