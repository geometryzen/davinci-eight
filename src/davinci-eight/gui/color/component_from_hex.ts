/**
 * Computes a single RGB component from a hex number.
 * r = component_from_hex(hex, 2);
 * g = component_from_hex(hex, 1);
 * b = component_from_hex(hex, 0);
 */
export default function component_from_hex(hex: number, componentIndex: number): number {
  return (hex >> (componentIndex * 8)) & 0xFF;
}
