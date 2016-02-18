export default class Scope {
    private state: { scope: any }[];
    private scopes: Scope[];
    private current: { [name: string]: any };
    constructor(state: { scope: any }[]) {
        this.state = state
        this.scopes = []
        this.current = null
    }
    enter(s: any) {
        this.scopes.push(
            this.current = this.state[0].scope = s || {}
        )
    }
    exit() {
        this.scopes.pop()
        this.current = this.scopes[this.scopes.length - 1]
    }
    define(str: string) {
        this.current[str] = this.state[0]
    }
    find(name: string, fail: any) {
        for (var i = this.scopes.length - 1; i > -1; --i) {
            if (this.scopes[i].hasOwnProperty(name)) {
                return this.scopes[i][name]
            }
        }
        return null
    }
}
