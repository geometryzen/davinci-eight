import {VectorN} from './VectorN'

/**
 *
 */
export class Coords extends VectorN<number> {

  /**
   * @param data
   * @param modified
   * @param size
   */
  constructor(data: number[], modified?: boolean, size?: number) {
    super(data, modified, size)
  }

  /**
   * @param n
   */
  approx(n: number): void {
    let max = 0
    const iLen = this._coords.length
    for (let i = 0; i < iLen; i++) {
      max = Math.max(max, Math.abs(this._coords[i]))
    }
    const threshold = max * Math.pow(10, -n)
    for (let i = 0; i < iLen; i++) {
      if (Math.abs(this._coords[i]) < threshold) {
        this._coords[i] = 0
      }
    }
  }

  /**
   * @param coords
   * @returns
   */
  equals(coords: any): boolean {
    if (coords instanceof Coords) {
      const iLen = this._coords.length
      for (let i = 0; i < iLen; i++) {
        if (this.coords[i] !== coords[i]) {
          return false
        }
      }
      return true
    }
    else {
      return false
    }
  }
}
