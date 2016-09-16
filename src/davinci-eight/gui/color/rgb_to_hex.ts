import hex_with_component from './hex_with_component';

export default function rgb_to_hex(r: number, g: number, b: number) {
  let hex = hex_with_component(0, 2, r);
  hex = hex_with_component(hex, 1, g);
  hex = hex_with_component(hex, 0, b);
  return hex;
}
