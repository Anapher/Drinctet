import{TextContentParser} from "./text-content-parser";

let parser: TextContentParser;

beforeEach(() => {
    parser = new TextContentParser();
});

it("result should never be undefined", () => {
    expect(parser.result).toBeDefined();
});

it("should correctly parse one translation", () => {
    const domParser = new DOMParser();
    const element = domParser.parseFromString('<Text lang="de">Hallo!</Text>', "text/xml");
    expect(parser.addElement(element.getElementsByTagName("Text")[0])).toBe(true);
    expect(parser.result).toHaveLength(1);

    const textElement = parser.result[0];
    expect(textElement.weight).toBe(1);
    expect(textElement.translations).toHaveLength(1);

    expect(textElement.translations[0]).toEqual({lang: "de", content: "Hallo!"});
});

it("should correctly parse multiple translations", () => {
    const domParser = new DOMParser();
    const element = domParser.parseFromString('<Root><Text lang="de">Hallo!</Text><Text lang="en">Hello!</Text></Root>', "text/xml");
    expect(parser.addElement(element.getElementsByTagName("Text")[0])).toBe(true);
    expect(parser.addElement(element.getElementsByTagName("Text")[1])).toBe(true);

    expect(parser.result).toHaveLength(1);

    const textElement = parser.result[0];
    expect(textElement.weight).toBe(1);
    expect(textElement.translations).toHaveLength(2);

    expect(textElement.translations[0]).toEqual({lang: "de", content: "Hallo!"});
    expect(textElement.translations[1]).toEqual({lang: "en", content: "Hello!"});
});

it("should correctly parse Case texts with single translation", () => {
    const data = `
    <Case weight=".5">
        <Text lang="en">Melina</Text>
    </Case>`;

    const domParser = new DOMParser();
    const element = domParser.parseFromString(data, "text/xml");
    expect(parser.addElement(element.getElementsByTagName("Case")[0])).toBe(true);

    expect(parser.result).toHaveLength(1);

    const textElement = parser.result[0];
    expect(textElement.weight).toBe(.5);
    expect(textElement.translations).toHaveLength(1);

    expect(textElement.translations[0]).toEqual({lang: "en", content: "Melina"});
});

it("should correctly parse Case texts with multiple translations", () => {
    const data = `
    <Case weight="1">
        <Text lang="en">Melina</Text>
        <Text lang="de">Melinda</Text>
    </Case>`;

    const domParser = new DOMParser();
    const element = domParser.parseFromString(data, "text/xml");
    expect(parser.addElement(element.getElementsByTagName("Case")[0])).toBe(true);

    expect(parser.result).toHaveLength(1);

    const textElement = parser.result[0];
    expect(textElement.weight).toBe(1);
    expect(textElement.translations).toHaveLength(2);

    expect(textElement.translations[0]).toEqual({lang: "en", content: "Melina"});
    expect(textElement.translations[1]).toEqual({lang: "de", content: "Melinda"});
});

it("should correctly parse multiple Cases", () => {
    const data = `
    <r>
    <Case weight=".8">
        <Text lang="en">Merinda</Text>
        <Text lang="de">Melina</Text>
    </Case>
    <Case weight="2">
        <Text lang="en">Madlein</Text>
        <Text lang="de">Marius</Text>
    </Case>
    </r>`;

    const domParser = new DOMParser();
    const element = domParser.parseFromString(data, "text/xml");
    expect(parser.addElement(element.getElementsByTagName("Case")[0])).toBe(true);
    expect(parser.addElement(element.getElementsByTagName("Case")[1])).toBe(true);

    expect(parser.result).toHaveLength(2);

    expect(parser.result[0]).toEqual({translations: [
        {lang: "en", content: "Merinda"},
        {lang: "de", content: "Melina"},
    ], weight: .8});

    expect(parser.result[1]).toEqual({translations: [
        {lang: "en", content: "Madlein"},
        {lang: "de", content: "Marius"},
    ], weight: 2})
});
