//
// Framerate object
//
// This object keeps track of framerate and displays it as the innerHTML text of the
// HTML element with the passed id. Once created you call snapshot at the end
// of every rendering cycle. Every 500ms the framerate is updated in the HTML element.
//
class Framerate {
  private renderTime: number = -1;
  private framerates: number[] = [];
  private numFramerates: number = 10;
  private framerateUpdateInterval: number = 500;
  private id: string;
  constructor(id: string) {
    this.id = id;
    let self = this;
    let fr = function() { self.updateFramerate() };
    setInterval(fr, this.framerateUpdateInterval);
  }
  updateFramerate() {
    var tot = 0;
    for (var i = 0; i < this.framerates.length; ++i)
        tot += this.framerates[i];

    var framerate = tot / this.framerates.length;
    framerate = Math.round(framerate);
    document.getElementById(this.id).innerHTML = "Framerate:"+framerate+"fps";
  }
  snapshot() {
    if (this.renderTime < 0)
        this.renderTime = new Date().getTime();
    else {
        var newTime = new Date().getTime();
        var t = newTime - this.renderTime;
        if (t == 0)
            return;
        var framerate = 1000/t;
        this.framerates.push(framerate);
        while (this.framerates.length > this.numFramerates)
            this.framerates.shift();
        this.renderTime = newTime;
    }  }
}

export = Framerate;
