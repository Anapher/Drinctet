export interface DrinkingGame {
    name: string;
    translations: DrinkingGameExplanation[];
}

interface DrinkingGameExplanation {
    name: string;
    lang: string;
}

const games: DrinkingGame[] = [
    {
        name: "drinking-driving",
        translations: [
            { lang: "de", name: "Drink & Drive" },
            { lang: "en", name: "Drink & Drive" },
        ],
    },
    {
        name: "horse-racing",
        translations: [
            { lang: "de", name: "Pferderennen" },
            { lang: "en", name: "Horse Racing" },
        ],
    },
    {
        name: "image-game",
        translations: [
            { lang: "de", name: "Image Game" },
            { lang: "en", name: "Image Game" },
        ],
    },
    {
        name: "pizza-box",
        translations: [
            { lang: "de", name: "Pizza Karton" },
            { lang: "en", name: "Pizza Box" },
        ],
    },
    {
        name: "weird-talk",
        translations: [
            { lang: "de", name: "Weird Talk" },
            { lang: "en", name: "Weird Talk" },
        ],
    },
    {
        name: "whisper-game",
        translations: [
            { lang: "de", name: "Flüsterspiel" },
            { lang: "en", name: "Whisper Game" },
        ],
    },
];

export default games;