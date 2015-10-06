import Cartesian3 = require('../../math/Cartesian3')
import IAnimation = require('../../slideshow/IAnimation')
import IAnimationClock = require('../../slideshow/IAnimationClock')
import IProperties = require('../../slideshow/IProperties')
import Shareable = require('../../utils/Shareable')
import Vector3 = require('../../math/Vector3')

function loop(n: number, callback: (i: number) => void) {
  for (var i = 0; i < n; ++i) {
    callback(i)
  }
}

class MoveTo extends Shareable implements IAnimation {
  private host: IAnimationClock;
  private object: IProperties;
  private key: string;
  private from: Vector3;
  private to: Vector3;
  private duration: number;
  private start: number;
  private fraction: number;
  private callback: () => void;
  private ease: string;
  constructor(host: IAnimationClock, object: IProperties, key: string, value: Cartesian3, duration: number = 300, callback?: () => void, ease?: string) {
    super('MoveTo')
    this.host = host
    // this.host.
    this.object = object
    this.object.addRef()
    this.key = key
    this.from = void 0
    this.to = Vector3.copy(value)
    this.duration = duration
    this.start = 0
    this.fraction = 0
    this.callback = callback
    this.ease = ease
  }
  protected destructor(): void {
    this.object.release()
    this.object = void 0
  }
  init(offset: number = 0) {
    this.start = this.host.now - offset
    if (this.from === void 0) {
      var data: number[] = this.object.getProperty(this.key)
      if (data) {
        this.from = new Vector3(data);
      }
    }
  }
  apply(offset?: number) {

    if (!this.start) {
      this.init(offset)
    }

    var object = this.object;
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

    var lerp = Vector3.lerp(from, to, rolloff)
    this.object.setProperty(this.key, lerp.data)
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

export = MoveTo
