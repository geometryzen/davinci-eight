import IAnimation from '../../slideshow/IAnimation';
import IAnimationTarget from '../../slideshow/IAnimationTarget';
import incLevel from '../../base/incLevel';
import {ShareableBase} from '../../core/ShareableBase';

export default class WaitAnimation extends ShareableBase implements IAnimation {
  public start: number;
  public duration: number;
  public fraction: number;
  constructor(duration: number) {
    super()
    this.setLoggingName('WaitAnimation')
    this.duration = duration
    this.fraction = 0
  }
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
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
