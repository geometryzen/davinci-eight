import IAnimation = require('../../slideshow/IAnimation')
import IAnimationClock = require('../../slideshow/IAnimationClock')
import IProperties = require('../../slideshow/IProperties')
import Shareable = require('../../utils/Shareable')

class Delay extends Shareable implements IAnimation {
  private host: IAnimationClock;
  public object: IProperties;
  public key: string;
  public start: number;
  public duration: number;
  public fraction: number;
  constructor(host: IAnimationClock, object: IProperties, key: string, duration: number) {
    super('Delay')
    this.host = host
    this.object = object
    this.object.addRef()
    this.key = key
    this.duration = duration
    this.start = 0
    this.fraction = 0
  }
  protected destructor(): void {
    this.object.release()
    this.object = void 0
  }
  private init(offset: number = 0): void {
    this.start = this.host.now - offset
  }
  apply(offset?: number): void {
    if (!this.start) {
      this.init(offset)
    }
    if (this.duration > 0) {
      this.fraction = Math.min(1, (this.host.now - this.start) / this.duration)
    }
    else {
      this.fraction = 1
    }
  }
  skip(): void {
    this.duration = 0
  }
  hurry(factor: number): void {
    this.duration = this.duration * this.fraction + this.duration * (1 - this.fraction) / factor
  }
  extra(): number {
    return this.host.now - this.start - this.duration
  }
  done(): boolean {
    return this.fraction === 1
  }
}

export = Delay
