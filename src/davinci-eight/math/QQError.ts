class QQError extends Error {
  public name = 'QQError'
  constructor(message: string) {
    super(message);
  }
}

export = QQError