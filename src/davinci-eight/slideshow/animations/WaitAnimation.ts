import IAnimation = require('../../slideshow/IAnimation')
import IAnimationTarget = require('../../slideshow/IAnimationTarget')
import Shareable = require('../../utils/Shareable')

class WaitAnimation extends Shareable implements IAnimation {
  public start: number;
  public duration: number;
  public fraction: number;
  constructor(duration: number) {
    super('WaitAnimation')
    this.duration = duration
    this.fraction = 0
  }
  protected destructor(): void {
    super.destructor()
  }
  apply(target: IAnimationTarget, propName: string, now: number, offset: number): void {
    if (!this.start) {
      this.start = now - offset
    }
    if (this.duration > 0) {
      this.fraction = Math.min(1, (now - this.start) / this.duration)
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
  extra(now: number): number {
    return now - this.start - this.duration
  }
  done(target: IAnimationTarget, propName: string): boolean {
    return this.fraction === 1
  }
  undo(target: IAnimationTarget, propName: string): void {
    this.start = void 0
    this.fraction = 0
  }
}

export = WaitAnimation
