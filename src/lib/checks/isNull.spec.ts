import { isNull } from './isNull';

describe("isNull", function () {
  it("should be a function", function () {
    expect(typeof isNull === 'function').toBe(true);
  });
  it("(null) should be true", function () {
    expect(isNull(null)).toBe(true);
  });
  it("(void 0) should be false", function () {
    expect(isNull(void 0)).toBe(false);
  });
  it("({}) should be false", function () {
    expect(isNull({})).toBe(false);
  });
  it("('') should be false", function () {
    expect(isNull('')).toBe(false);
  });
  it("(' ') should be false", function () {
    expect(isNull(' ')).toBe(false);
  });
  it("(0) should be false", function () {
    expect(isNull(0)).toBe(false);
  });
  it("(1) should be false", function () {
    expect(isNull(1)).toBe(false);
  });
  it("(NaN) should be false", function () {
    expect(isNull(NaN)).toBe(false);
  });
  it("(Infinity) should be false", function () {
    expect(isNull(Infinity)).toBe(false);
  });
  it("(true) should be false", function () {
    expect(isNull(true)).toBe(false);
  });
  it("(false) should be false", function () {
    expect(isNull(false)).toBe(false);
  });
});
