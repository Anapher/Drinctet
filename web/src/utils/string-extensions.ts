export function toFixedEnd(s: string, length: number) {
    if (length > s.length) {
        return s;
    }

    return ".." + s.substring(s.length - length - 2, s.length);
}

export function trimEnd(s: string, trim: string) {
    while (true) {
        const index = s.lastIndexOf(trim);
        if (index !== -1 && index === s.length - trim.length) {
            s = s.substring(0, s.length - trim.length);
        } else {
            break;
        }
    }

    return s;
}
