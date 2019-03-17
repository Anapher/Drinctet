import { selectRandomWeighted } from "./utils";

it("random weighted should return an element from the array", () => {
    const items = ["apple", "orange", "peach"];
    const item = selectRandomWeighted(items, () => 1);
    expect(item).toBeDefined();
    expect(items).toContain(item);
});