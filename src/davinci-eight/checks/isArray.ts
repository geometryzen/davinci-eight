function isArray(x: any): boolean {
  return Object.prototype.toString.call(x) === '[object Array]'
}

export = isArray