import {IController} from '../gui/GUI';
import BooleanController from './BooleanController';
import ColorController from './ColorController';
import FunctionController from './FunctionController';
import NumberControllerBox from './NumberControllerBox';
import StringController from './StringController';
import FloatPicker from './FloatPicker';
import Vec2Picker from './Vec2Picker';
import VectorE3Controller from './VectorE3Controller';

export default function controllerFactory(object: {}, property: string, params: { kind?: 'color' | 'R1' | 'R2' | 'R3' }): IController<any> {
  if (params.kind === 'color') {
    return new ColorController(object, property);
  }
  else if (params.kind === 'R1') {
    return new FloatPicker(object, property);
  }
  else if (params.kind === 'R2') {
    return new Vec2Picker(object, property);
  }
  else if (params.kind === 'R3') {
    return new VectorE3Controller(object, property);
  }
  else {
    const initialValue = object[property];
    if (typeof initialValue === 'boolean') {
      return new BooleanController(object, property);
    }
    else if (typeof initialValue === 'function') {
      return new FunctionController(object, property, 'Fire');
    }
    else if (typeof initialValue === 'number') {
      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
    }
    else if (typeof initialValue === 'string') {
      return new StringController(object, property);
    }
    else {
      throw new Error("No controller for specified type.");
    }
  }
}
