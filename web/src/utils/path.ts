export function getRootPath(path: string): string | null {
    const match = /[a-zA-Z]+/g.exec(path);
    return match !== null && match.length > 0 ? match[0] : null;
}
