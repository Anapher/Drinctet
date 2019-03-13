import { ParserHelper } from "./parser-helper";

it("should parse the player tag correctly without index specified", () => {
    const s = "Player";
    
    const result = ParserHelper.parsePlayerTag(s);
    expect(result).toBe(1);
});

it("should parse the player tag correctly with index specified", () => {
    const s = "Player2";
    
    const result = ParserHelper.parsePlayerTag(s);
    expect(result).toBe(2);
});

it("should parse the player tag and return undefined if it has an invalid format", () => {
    const testValues = ["", "just a string", "Playr", "Playera", "Player453a"];

    for (const s of testValues) {
        const result = ParserHelper.parsePlayerTag(s);
        expect(result).toBeUndefined();
    }});

it("should parse mm:ss correctly", () => {
    const s = "12:45";

    const result = ParserHelper.parseTimeSpanStringToSeconds(s);
    expect(result).toBe(12 * 60 + 45);
});

it("should parse hh:mm:ss correctly", () => {
    const s = "03:12:45";

    const result = ParserHelper.parseTimeSpanStringToSeconds(s);
    expect(result).toBe(3 * 60 * 60 + 12 * 60 + 45);
});

it("should return undefined if an invalid time span format is encountered", () => {
    const testValues = ["just a string", "04:05:9a", "hh:mm"];

    for (const s of testValues) {
        const result = ParserHelper.parseTimeSpanStringToSeconds(s);
        expect(result).toBeUndefined();
    }
});
