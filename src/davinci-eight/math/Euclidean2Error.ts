class Euclidean2Error extends Error {
  public name = 'Euclidean2Error'
  constructor(message: string) {
    super(message);
  }
}

export = Euclidean2Error