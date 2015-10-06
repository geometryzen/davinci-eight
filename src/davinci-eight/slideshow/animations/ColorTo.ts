import ColorRGB = require('../../core/ColorRGB')
import IAnimation = require('../../slideshow/IAnimation')
import IAnimationClock = require('../../slideshow/IAnimationClock')
import IProperties = require('../../slideshow/IProperties')
import Shareable = require('../../utils/Shareable')
import Color = require('../../core/Color')

function loop(n: number, callback: (i: number) => void) {
  for (var i = 0; i < n; ++i) {
    callback(i)
  }
}

class ColorTo extends Shareable implements IAnimation {
  private host: IAnimationClock;
  private object: IProperties;
  private key: string;
  private from: Color;
  private to: Color;
  private duration: number;
  private start: number;
  private fraction: number;
  private callback: () => void;
  private ease: string;
  constructor(host: IAnimationClock, object: IProperties, key: string, value: ColorRGB, duration: number = 300, callback?: () => void, ease?: string) {
    super('ColorTo')
    this.host = host
    // this.host.
    this.object = object
    this.object.addRef()
    this.key = key
    this.from = void 0
    this.to = Color.copy(value)
    this.duration = duration
    this.start = 0
    this.fraction = 0
    this.callback = callback
    this.ease = ease
  }
  protected destructor(): void {
    this.object.release()
    this.object = void 0
    super.destructor()
  }
  init(offset: number = 0) {
    this.start = this.host.now - offset
    if (this.from === void 0) {
      var data: number[] = this.object.getProperty(this.key)
      if (data) {
        this.from = new Color(data);
      }
    }
  }
  apply(offset?: number) {

    if (!this.start) {
      this.init(offset)
    }

    var from = this.from;
    var to = this.to;
    var key = this.key;
    var ease = this.ease;

    // Calculate animation progress / fraction.
    var fraction: number;
    if (this.duration > 0) {
      fraction = Math.min(1, (this.host.now - this.start) / (this.duration || 1))
    }
    else {
      fraction = 1
    }
    this.fraction = fraction

    // Simple easing support.
    var rolloff: number
    switch (ease) {
      case 'in':
        rolloff = 1 - (1 - fraction) * (1 - fraction)
        break
      case 'out':
        rolloff = fraction * fraction
        break
      case 'linear':
        rolloff = fraction
        break
      default:
        rolloff = 0.5 - 0.5 * Math.cos(fraction * Math.PI)
        break
    }
    this.object.setProperty(this.key, Color.interpolate(from, to, rolloff).data)
  }
  hurry(factor: number): void {
    this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor;
  }
  skip(): void {
    this.duration = 0
    this.fraction = 1
    this.done()
  }
  extra(): number {
    return this.host.now - this.start - this.duration;
  }
  done(): boolean {
    if (this.fraction === 1) {
      // Set final value.
      this.object.setProperty(this.key, this.to.data);

      this.callback && this.callback()
      this.callback = void 0
      return true
    }
    else {
      return false
    }
  }
}

export = ColorTo
