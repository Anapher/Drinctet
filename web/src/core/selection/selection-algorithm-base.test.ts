import { SelectionAlgorithmBase } from "./selection-algorithm-base";
import { SlideRegistration } from "../slide-registration";
import { Card } from "../cards/card";

class TestAlgorithm extends SelectionAlgorithmBase {
    public selectNextSlide(availableSlides: SlideRegistration[]): string | undefined {
        throw new Error("Method not implemented.");
    }
    public selectCard<TCard extends Card>(cardType: string): TCard {
        throw new Error("Method not implemented.");
    }
}

const algorithm = new TestAlgorithm({
    decks: [],
    history: [],
    language: "",
    players: [],
    slides: [],
    tags: [],
});

it("random weighted should return an element from the array", () => {
    const items = ["apple", "orange", "peach"];
    const item = algorithm.selectRandomWeighted(items, x => 1);
    expect(item).toBeDefined();
    expect(items).toContain(item);
});
