import { StaticNumber, NumberRange, RandomNumberFragment } from "./fragments/random-number-fragment";
import { GenderBasedSelectionFragment } from "./fragments/gender-based-selection-fragment";
import { DefaultTextDecoder } from "./default-text-decoder";
import { PlayerReferenceFragment } from "./fragments/player-reference-fragment";
import { SipsFragment } from "./fragments/sips-fragment";
import { TextFragment } from "./text-fragment";
import { RawTextFragment } from "./fragments/raw-text-fragment";
import { RandomTextFragment } from "./fragments/random-text-fragment";

const decoder = new DefaultTextDecoder();

it("should correctly read a simple token", () => {
    const result = decoder.readToken("a [token]gibberish", 2, "]");
    expect(result).toEqual({ value: "token", index: 9 });
});

it("should correctly read a token with escaped end char", () => {
    const result = decoder.readToken("a [token\\]there comes more]gibberish", 2, "]");
    expect(result).toEqual({ value: "token\\]there comes more", index: 27 });
});

it("should correctly parse Player", () => {
    const result = decoder.parseVariableFragment("Player");
    expect(result).toEqual(new PlayerReferenceFragment(1, "None"));
});

it("should correctly parse Player2", () => {
    const result = decoder.parseVariableFragment("Player2");
    expect(result).toEqual(new PlayerReferenceFragment(2, "None"));
});

it("should correctly parse Player2:m", () => {
    const result = decoder.parseVariableFragment("Player2:m");
    expect(result).toEqual(new PlayerReferenceFragment(2, "Male"));
});

it("should correctly parse Player:m", () => {
    const result = decoder.parseVariableFragment("Player:m");
    expect(result).toEqual(new PlayerReferenceFragment(1, "Male"));
});

it("should correctly parse Sips", () => {
    const result = decoder.parseVariableFragment("sips");
    expect(result).toEqual(new SipsFragment(1, 1));
});

it("should correctly parse Sips2", () => {
    const result = decoder.parseVariableFragment("Sips2");
    expect(result).toEqual(new SipsFragment(1, 2));
});

it("should correctly parse Sips2:5", () => {
    const result = decoder.parseVariableFragment("Sips2:5");
    expect(result).toEqual(new SipsFragment(5, 2));
});

it("should correctly parse gender selection fragment", () => {
    const testData: { data: string; result: GenderBasedSelectionFragment }[] = [
        { data: "asd", result: new GenderBasedSelectionFragment("asd") },
        { data: "m/f", result: new GenderBasedSelectionFragment("m", "f") },
        { data: "/f", result: new GenderBasedSelectionFragment("", "f") },
        { data: "/f|Player2", result: new GenderBasedSelectionFragment("", "f", 2) },
        { data: "m/f|Player2", result: new GenderBasedSelectionFragment("m", "f", 2) },
        { data: "m|Player2", result: new GenderBasedSelectionFragment("m", undefined, 2) },
    ];

    for (const data of testData) {
        expect(decoder.parseGenderSelectionFragment(data.data)).toEqual(data.result);
    }
});

it("should parse number array", () => {
    const data = "1,2,5-8,2";
    const result = decoder.parseNumberArray(data);

    expect(result).toEqual([
        new StaticNumber(1),
        new StaticNumber(2),
        new NumberRange(5, 8),
        new StaticNumber(2),
    ]);
});

it("(splitQuoted) should correctly parse quoted data", () => {
    const testData: { data: string; result: string[] }[] = [
        { data: "hello,world,test", result: ["hello", "world", "test"] },
        { data: "hello,wtf is that,test", result: ["hello", "wtf is that", "test"] },
        { data: 'hello,"oranges, pinapple",test', result: ["hello", "oranges, pinapple", "test"] },
        {
            data: 'hello,"oranges,"" pinapple",test',
            result: ["hello", 'oranges," pinapple', "test"],
        },
        { data: 'hello,"oranges,"" pinapple"', result: ["hello", 'oranges," pinapple'] },
        { data: 'hello,"oranges, pinapple"', result: ["hello", "oranges, pinapple"] },
        { data: 'hello,"oranges,"", pinapple"', result: ["hello", 'oranges,", pinapple'] },
        { data: '"wtf"""', result: ['wtf"'] },
        { data: '"oranges,"", pinapple"', result: ['oranges,", pinapple'] },
        {
            data: 'hello "quoted",wtf is" that,"wtf, is, that"',
            result: ['hello "quoted"', 'wtf is" that', "wtf, is, that"],
        },
    ];

    for (const data of testData) {
        const result = decoder.splitQuoted(data.data, ",");
        expect(result).toEqual(data.result);
    }
});

it("(splitQuoted) should correctly throw errors on invalid data", () => {
    const testData = ['"hello,world', '"hello"world,test', '"hello"",test'];
    for (const data of testData) {
        expect(() => decoder.splitQuoted(data, ",")).toThrowError();
    }
});

it("should correctly decode texts", () => {
    const testData: { s: string; result: TextFragment[] }[] = [
        { s: "Hello World!", result: [new RawTextFragment("Hello World!")] },
        {
            s: "Schwarz. Alle, die weiß gewählt haben, trinken [sips]",
            result: [
                new RawTextFragment("Schwarz. Alle, die weiß gewählt haben, trinken "),
                new SipsFragment(),
            ],
        },
        {
            s: "[Player1], kiss [Player2:o]. Drink [sips:6] if you don't want that.",
            result: [
                new PlayerReferenceFragment(1),
                new RawTextFragment(", kiss "),
                new PlayerReferenceFragment(2, "Opposite"),
                new RawTextFragment(". Drink "),
                new SipsFragment(6),
                new RawTextFragment(" if you don't want that."),
            ],
        },
        {
            s: "Trinke einen Shot aus [Player]s Bauchnabel.",
            result: [
                new RawTextFragment("Trinke einen Shot aus "),
                new PlayerReferenceFragment(),
                new RawTextFragment("s Bauchnabel."),
            ],
        },
        {
            s: "[Player1], wenn du [Player2] ein bisschen kennst, dann gib {ihr/ihm} einen Kuss oder trink [sips:8]",
            result: [
                new PlayerReferenceFragment(),
                 new RawTextFragment(", wenn du "),
                new PlayerReferenceFragment(2),
                new RawTextFragment(" ein bisschen kennst, dann gib "),
                new GenderBasedSelectionFragment("ihr", "ihm"),
                new RawTextFragment(" einen Kuss oder trink "), 
                new SipsFragment(8),
            ],
        },
        {
            s: "Alle Spieler, in deren Vorname ein '!{e,i,a,u}' vorkommt, müssen [sips] trinken",
            result: [
                new RawTextFragment("Alle Spieler, in deren Vorname ein '"),
                new RandomTextFragment(["e", "i", "a", "u"]),
                new RawTextFragment("' vorkommt, müssen "), 
                new SipsFragment(), 
                new RawTextFragment(" trinken"),
            ],
        },
        {
            s: "[Player], count up to !{20-30} while [Player2] drinks {her/his} drink.",
            result: [
                new PlayerReferenceFragment(),
                new RawTextFragment(", count up to "),
                new RandomNumberFragment([new NumberRange(20, 30)]),
                new RawTextFragment(" while "), 
                new PlayerReferenceFragment(2),
                new RawTextFragment(" drinks "),
                new GenderBasedSelectionFragment("her", "his"),
                new RawTextFragment(" drink.")
            ],
        },
    ];

    for (const data of testData) {
        expect(decoder.decode(data.s)).toEqual(data.result);
    }
});
