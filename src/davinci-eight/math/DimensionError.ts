class DimensionError extends Error {
  public name = 'DimensionError'
  constructor(message: string) {
    super(message);
  }
}

export = DimensionError