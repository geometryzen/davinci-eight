import IContextConsumer = require('../core/IContextConsumer')
import IDrawable = require('../core/IDrawable')
import IMaterial = require('../core/IMaterial')
import IUnknown = require('../core/IUnknown')
import UniformData = require('../core/UniformData')

/**
 * @class IDrawList
 * @extends IContextConsumer
 * @extends IUnknown
 */
interface IDrawList extends IContextConsumer, IUnknown {
  add(drawable: IDrawable): void;
  remove(drawable: IDrawable): void;
  draw(ambients: UniformData, canvasId: number): void;
  traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (program: IMaterial) => void): void;
}

export = IDrawList;
