class ViewportArgs {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public modified: boolean;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.modified = false;
  }
}

export = ViewportArgs;
