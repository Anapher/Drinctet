import { TextFormatter } from './text-formatter';
import { RawTextFragment } from "@core/fragments/raw-text-fragment";
import { PlayerReferenceFragment } from "@core/fragments/player-reference-fragment";
import { PlayerSetting } from "@core/cards/player-setting";
import { TextFragment } from "@core/text-fragment";

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
                new PlayerReferenceFragment(3, "Female")
            ],
            global: [],
            expected: [new PlayerSetting(1, "Male"), new PlayerSetting(3, "Female")]
        },
        {
            fragments: [
                new PlayerReferenceFragment(1),
                new PlayerReferenceFragment(3, "Female")
            ],
            global: [new PlayerSetting(1, "Male")],
            expected: [new PlayerSetting(1, "Male"), new PlayerSetting(3, "Female")]
        },
        {
            fragments: [
                new PlayerReferenceFragment(1, "Female"),
                new PlayerReferenceFragment(3, "Female")
            ],
            global: [new PlayerSetting(1, "Male")],
            expected: [new PlayerSetting(1, "Female"), new PlayerSetting(3, "Female")]
        }
    ];

    for (const data of testData) {
        const result = TextFormatter.getRequiredPlayers(data.fragments, data.global);
        expect(result).toEqual(data.expected);
    }
});
