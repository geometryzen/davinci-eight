function mustSatisfy(name: string, condition: boolean, messageBuilder: () => string, contextBuilder?: () => string) {
  if (!condition) {
    if (messageBuilder) {
      let message: string = messageBuilder();
      if (contextBuilder) {
        let context: string = contextBuilder();
        throw new Error(name + " must " + message + " in " + context + ".");
      }
      else {
        throw new Error(name + " must " + message + ".");
      }
    }
    else {
      let message = "satisfy some condition";
      if (contextBuilder) {
        let context: string = contextBuilder();
        throw new Error(name + " must " + message + " in " + context + ".");
      }
      else {
        throw new Error(name + " must " + message + ".");
      }
    }
  }
}

export = mustSatisfy;
