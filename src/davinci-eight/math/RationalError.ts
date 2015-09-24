class RationalError extends Error {
  public name = 'RationalError'
  constructor(message: string) {
    super(message);
  }
}

export = RationalError