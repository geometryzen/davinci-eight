import IMicroEvent = require('../slideshow/IMicroEvent')

class MicroEvent implements IMicroEvent {
  public _events: {[key:string]:(() => void)[]}
  constructor() {
  }
  bind(event: string, fct: () => void): void {
    this._events = this._events || {};
    this._events[event] = this._events[event]  || [];
    this._events[event].push(fct);
  }
  unbind(event: string, fct: () => void): void {
    this._events = this._events || {};
    if( event in this._events === false  )  return;
    this._events[event].splice(this._events[event].indexOf(fct), 1);
  }
  trigger(event: string, args?: any): void {
    this._events = this._events || {};
    if( event in this._events === false  )  return;
    for(var i = 0; i < this._events[event].length; i++){
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
  /**
   * mixin will delegate all MicroEvent.js function in the destination object
   *
   * - require('MicroEvent').mixin(Foobar) will make Foobar able to use MicroEvent
   *
   * @param {Object} the object which will support MicroEvent
   */
  /*
  static mixin(destObject: any) {
    var props  = ['bind', 'unbind', 'trigger'];
    for (var i = 0; i < props.length; i ++){
      if(typeof destObject === 'function' ) {
        destObject.prototype[props[i]]  = MicroEvent.prototype[props[i]];
      }
      else {
        destObject[props[i]] = MicroEvent.prototype[props[i]];
      }
    }
    return destObject;
  }
  */
}

export = MicroEvent
