class CCError extends Error {
  public name = 'CCError'
  constructor(message: string) {
    super(message);
  }
}

export = CCError