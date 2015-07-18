function clamp(x: number, min: number, max: number) {
  return ( x < min ) ? min : ( ( x > max ) ? max : x );
}

export = clamp;
