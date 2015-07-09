function clamp(x: number, a: number, b: number) {
  return ( x < a ) ? a : ( ( x > b ) ? b : x );
}

export = clamp;
