import { PlayerSetting } from "@core/cards/player-setting";
import { PlayerReferenceFragment } from "@core/fragments/player-reference-fragment";
import { RawTextFragment } from "@core/fragments/raw-text-fragment";
import { PlayerInfo } from "@core/player-info";
import { TextFragment } from "@core/text-fragment";
import { TextFormatter } from "./text-formatter";
import { RandomUtils } from "@core/selection/selection-algorithm";
import { SipsFragment } from "@core/fragments/sips-fragment";
import { GenderBasedSelectionFragment } from "@core/fragments/gender-based-selection-fragment";
import { RandomTextFragment } from "@core/fragments/random-text-fragment";

it("should correctly find out the players", () => {
    const testData: {
        fragments: TextFragment[];
        global: PlayerSetting[];
        expected: PlayerSetting[];
    }[] = [
        {
            fragments: [
                new RawTextFragment("hello"),
                new PlayerReferenceFragment(1),
                new PlayerReferenceFragment(2),
            ],
            global: [],
            expected: [new PlayerSetting(1), new PlayerSetting(2)],
        },
        {
            fragments: [
                new PlayerReferenceFragment(1, "Male"),
                new PlayerReferenceFragment(3, "Female"),
            ],
            global: [],
            expected: [new PlayerSetting(1, "Male"), new PlayerSetting(3, "Female")],
        },
        {
            fragments: [new PlayerReferenceFragment(1), new PlayerReferenceFragment(3, "Female")],
            global: [new PlayerSetting(1, "Male")],
            expected: [new PlayerSetting(1, "Male"), new PlayerSetting(3, "Female")],
        },
        {
            fragments: [
                new PlayerReferenceFragment(1, "Female"),
                new PlayerReferenceFragment(3, "Female"),
            ],
            global: [new PlayerSetting(1, "Male")],
            expected: [new PlayerSetting(1, "Female"), new PlayerSetting(3, "Female")],
        },
    ];

    for (const data of testData) {
        const result = TextFormatter.getRequiredPlayers(data.fragments, data.global);
        expect(result).toEqual(data.expected);
    }
});

class TestRandomUtils implements RandomUtils {
    selectRandomWeighted<T>(items: T[]): T | undefined {
        return items[0];
    }

    getRandom(): number {
        return 0.5;
    }
}

it("should correctly format", () => {
    const socialMediaPlatform = "Snapchat";
    const players = {
        0: new PlayerInfo("0", "Vincent", "Male"),
        1: new PlayerInfo("1", "Melina", "Female"),
    };
    const sips = {
        0: 2,
        1: 3,
        2: 1
    };

    const random = new TestRandomUtils();

    type TestData = Array<{fragments: TextFragment[], expected: string}>;

    const testData: TestData = [
        {
            fragments: [new RawTextFragment("Hello World")],
            expected: "Hello World"
        },
        {
            fragments: [new PlayerReferenceFragment(1), new RawTextFragment(", please do 10 sit ups.")],
            expected: "Melina, please do 10 sit ups."
        },
        {
            fragments: [new PlayerReferenceFragment(1), new RawTextFragment(", drink "), new SipsFragment(undefined, 1)],
            expected: "Melina, drink 3 sips"
        },
        {
            fragments: [new PlayerReferenceFragment(1), new RawTextFragment(" takes of "), new GenderBasedSelectionFragment("her", "his"), new RawTextFragment(" shirt.")],
            expected: "Melina takes of her shirt."
        },
        {
            fragments: [new PlayerReferenceFragment(0), new RawTextFragment(" takes of "), new GenderBasedSelectionFragment("her", "his"), new RawTextFragment(" shirt.")],
            expected: "Vincent takes of his shirt."
        },
        {
            fragments: [new PlayerReferenceFragment(0), new RawTextFragment(" ist "), new GenderBasedSelectionFragment("die", "der"), new RawTextFragment(" Rächer"), new GenderBasedSelectionFragment("in")],
            expected: "Vincent ist der Rächer"
        },
        {
            fragments: [new PlayerReferenceFragment(1), new RawTextFragment(" ist "), new GenderBasedSelectionFragment("die", "der"), new RawTextFragment(" Rächer"), new GenderBasedSelectionFragment("in")],
            expected: "Melina ist die Rächerin"
        },
        {
            fragments: [new RawTextFragment("Who knows the capital of "), new RandomTextFragment(["Germany", "Italy", "Sweden"])],
            expected: "Who knows the capital of Germany"
        },
        {
            fragments: [new RawTextFragment("Drink "), new SipsFragment(undefined, 2)],
            expected: "Drink oneSip"
        },
    ];

    for (const test of testData) {
        const result = TextFormatter.format(
            test.fragments,
            players,
            sips,
            socialMediaPlatform,
            x => x,
            random,
            {}
        );

        expect(result).toBe(test.expected);
    }
});
