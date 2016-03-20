import VectorN from './VectorN'

/**
 * @class Coords
 */
export default class Coords extends VectorN<number> {

  /**
   * @class Coords
   * @param data {number[]}
   * @param [modified] {boolean}
   * @param [size] {number}
   */
  constructor(data: number[], modified?: boolean, size?: number) {
    super(data, modified, size)
  }

  /**
   * @method approx
   * @param n {number}
   * @return {void}
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
   * @method equals
   * @param coords {any}
   * @return boolean
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
