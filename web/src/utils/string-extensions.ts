export function toFixedEnd(s: string, length: number) {
    if (length > s.length) {
        return s;
    }

    return ".." + s.substring(s.length - length - 2, s.length);
}
