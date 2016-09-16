export default function hex_with_component(hex: number, componentIndex: number, value: number): number {
    let tmpComponent: number;
    return value << (tmpComponent = componentIndex * 8) | (hex & ~(0xFF << tmpComponent));
}
