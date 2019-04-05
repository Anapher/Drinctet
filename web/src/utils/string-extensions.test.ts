import { trimEnd } from "./string-extensions";

it("should trim string end", () => {
    const s = "TestSlide";
    const result = trimEnd(s, "Slide");
    expect(result).toBe("Test");
});