interface IMicroEvent {
  bind(event: string, fct: () => void): void;
  unbind(event: string, fct: () => void): void;
  trigger(event: string, args?: any): void;
}

export = IMicroEvent;
