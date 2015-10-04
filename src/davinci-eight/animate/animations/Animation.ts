import IAnimation = require('../../animate/IAnimation')
import IAnimationClock = require('../../animate/IAnimationClock')
import IProperties = require('../../animate/IProperties')
import Shareable = require('../../utils/Shareable')

function loop(n: number, callback: (i: number) => void) {
  for (var i = 0; i < n; ++i) {
    callback(i)
  }
}

class Animation extends Shareable implements IAnimation {
  private host: IAnimationClock;
  public object: IProperties;
  public key: string;
  public from: number[];
  public to: number[];
  public duration: number;
  public start: number;
  public fraction: number;
  public callback: () => void;
  public ease: string;
  constructor(host: IAnimationClock, object: IProperties, key: string, value: number[], duration: number, callback: () => void, ease: string) {
    super('Animation')
    this.host = host
    // this.host.
    this.object = object
    this.object.addRef()
    this.key = key
    this.from = void 0
    this.to = value
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
      this.from = this.object.getProperty(this.key)
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

    // Linear interpolation
    function lerp(from: number, to: number): number {
      return from + (to - from) * rolloff;
    }

    // Interpolate between two arbitrary values/objects.
    function interpolate(from: number[], to: number[]) {

      // Handle default cases.
      if (to === undefined) {
        to = from;
      }
      if (from === undefined) {
        from = to;
      }
      if (to === from) {
        return from;
      }

      var out: number[];
      if (!from) {
          return to;
        }
      if (!to) {
        return from;
      }
      out = [];
      loop(from.length, function (i) {
        out[i] = lerp(from[i], to[i]);
      })
      return out;
      return (fraction > 0.5) ? to : from;
    }
    this.object.setProperty(this.key, interpolate(from, to))
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
      this.object.setProperty(this.key, this.to);

      this.callback && this.callback()
      this.callback = void 0
      return true
    }
    else {
      return false
    }
  }
}

export = Animation
