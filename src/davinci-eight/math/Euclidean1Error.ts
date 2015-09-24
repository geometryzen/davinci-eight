class Euclidean1Error extends Error {
  public name = 'Euclidean1Error'
  constructor(message: string) {
    super(message);
  }
}

export = Euclidean1Error