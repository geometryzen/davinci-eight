export default function defer(fnc: () => any) {
    setTimeout(fnc, 0);
}
