import interpret from './interpret';
import rgb_to_hex from './rgb_to_hex';
import hsv_to_rgb from './hsv_to_rgb';
import rgb_to_hsv from './rgb_to_hsv';
import component_from_hex from './component_from_hex';
import toString from './toString';
import isUndefined from '../common/isUndefined';

export default class Color {
  public static COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
  __state: { r: number; g: number; b: number; h: number; s: number; v: number; a: number; hex: number; space: 'RGB' | 'HEX' | 'HSV' };
  constructor(args: any) {
    const state = interpret.apply(this, arguments);

    if (state === false) {
      throw 'Failed to interpret color arguments';
    }
    else {
      this.__state = state;
    }

    this.__state.a = this.__state.a || 1;
  }
  get r() {
    switch (this.__state.space) {
      case 'RGB': {
        return this.__state.r;
      }
      case 'HEX': {
        return component_from_hex(this.__state.hex, 2);
      }
      case 'HSV': {
        return hsv_to_rgb(this.__state.h, this.__state.s, this.__state.v).r;
      }
      default: {
        throw new Error(`Invalid space: ${this.__state.space}$`);
      }
    }
  }
  set r(value: number) {
    this.ensureRGB();
    this.__state.r = value;
  }
  get g() {
    switch (this.__state.space) {
      case 'RGB': {
        return this.__state.g;
      }
      case 'HEX': {
        return component_from_hex(this.__state.hex, 1);
      }
      case 'HSV': {
        return hsv_to_rgb(this.__state.h, this.__state.s, this.__state.v).g;
      }
      default: {
        throw new Error(`Invalid space: ${this.__state.space}$`);
      }
    }
  }
  set g(value: number) {
    this.ensureRGB();
    this.__state.g = value;
  }
  get b() {
    switch (this.__state.space) {
      case 'RGB': {
        return this.__state.b;
      }
      case 'HEX': {
        return component_from_hex(this.__state.hex, 0);
      }
      case 'HSV': {
        return hsv_to_rgb(this.__state.h, this.__state.s, this.__state.v).b;
      }
      default: {
        throw new Error(`Invalid space: ${this.__state.space}$`);
      }
    }
  }
  set b(value: number) {
    this.ensureRGB();
    this.__state.b = value;
  }
  get a() {
    return this.__state.a;
  }
  set a(v) {
    this.__state.a = v;
  }

  get h() {
    if (this.__state.space === 'HSV') {
      return this.__state.h;
    }
    this.ensureHSV();
    return this.__state.h;
  }
  set h(value: number) {
    if (this.__state.space !== 'HSV') {
      this.ensureHSV();
    }
    this.__state.h = value;
  }

  get s() {
    if (this.__state.space === 'HSV') {
      return this.__state.s;
    }
    this.ensureHSV();
    return this.__state.s;
  }
  set s(value: number) {
    if (this.__state.space !== 'HSV') {
      this.ensureHSV();
    }
    this.__state.s = value;
  }

  get v() {
    if (this.__state.space === 'HSV') {
      return this.__state.v;
    }
    this.ensureHSV();
    return this.__state.v;
  }
  set v(value: number) {
    if (this.__state.space !== 'HSV') {
      this.ensureHSV();
    }
    this.__state.v = value;
  }

  get hex(): number {
    if (this.__state.space !== 'HEX') {
      this.__state.hex = rgb_to_hex(this.r, this.g, this.b);
    }
    return this.__state.hex;
  }

  set hex(v: number) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }

  toString() {
    return toString(this);
  }

  toOriginal() {
    // FIXME
    return (<any>this.__state).conversion.write(this);
  }

  private ensureRGB(): void {
    switch (this.__state.space) {
      case 'RGB': {
        break;
      }
      case 'HEX': {
        this.__state.r = component_from_hex(this.__state.hex, 2);
        this.__state.g = component_from_hex(this.__state.hex, 1);
        this.__state.b = component_from_hex(this.__state.hex, 0);
        this.__state.space = 'RGB';
        break;
      }
      case 'HSV': {
        const rgb = hsv_to_rgb(this.__state.h, this.__state.s, this.__state.v);
        this.__state.r = rgb.r;
        this.__state.g = rgb.g;
        this.__state.b = rgb.b;
        this.__state.space = 'RGB';
        break;
      }
    }
  }

  private ensureHSV() {

    const hsv = rgb_to_hsv(this.r, this.g, this.b);

    this.__state.s = hsv.s;
    this.__state.v = hsv.v;

    if (!isNaN(hsv.h)) {
      this.__state.h = hsv.h;
    }
    else if (isUndefined(this.__state.h)) {
      this.__state.h = 0;
    }

    this.__state.space = 'HSV';
  }
}
