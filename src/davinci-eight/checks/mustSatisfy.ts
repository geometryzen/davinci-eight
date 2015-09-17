function mustSatisfy(name: string, condition: boolean, messageBuilder: () => string, contextBuilder: () => string) {
  if (!condition) {
    let message: string = messageBuilder();
    let context: string = contextBuilder();
    throw new Error(name + " must " + message + " in " + context + ".");
  }
}

export = mustSatisfy;
