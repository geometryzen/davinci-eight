class Euclidean3Error extends Error {
  public name = 'Euclidean3Error'
  constructor(message: string) {
    super(message);
  }
}

export = Euclidean3Error