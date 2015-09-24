class ComplexError extends Error {
  public name = 'ComplexError'
  constructor(message: string) {
    super(message);
  }
}

export = ComplexError