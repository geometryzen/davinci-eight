class Scope {
  private state;
  private scopes: Scope[];
  private current;
  constructor(state) {
    this.state = state
    this.scopes = []
    this.current = null
  }
  enter(s) {
    this.scopes.push(
      this.current = this.state[0].scope = s || {}
    )
  }
  exit() {
    this.scopes.pop()
    this.current = this.scopes[this.scopes.length - 1]
  }
  define(str) {
    this.current[str] = this.state[0]
  }
  find(name: string, fail) {
    for(var i = this.scopes.length - 1; i > -1; --i) {
      if(this.scopes[i].hasOwnProperty(name)) {
        return this.scopes[i][name]
      }
    }
    return null
  }
}

export = Scope;
