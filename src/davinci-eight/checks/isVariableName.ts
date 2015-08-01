function isGlslStartChar(ch: string) {
  return true;
}

function isVariableName(name: string): boolean {
  if (typeof name === 'string') {
    if (name.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}

export = isVariableName;