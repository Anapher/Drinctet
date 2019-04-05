export const socialMediaPlatforms = ["Snapchat", "Instagram", "Facebook"];

export const defaultSources = [
    "cards/Bevil.xml",
    "cards/bullshitfact.xml",
    "cards/common.xml",
    "cards/ConversationStartersWorld.FunnyQuestions.xml",
    "cards/ConversationStartersWorld.NeverHaveIEver.xml",
    "cards/ConversationStartersWorld.TruthOrDareDare.xml",
    "cards/ConversationStartersWorld.TruthOrDareTruth.xml",
    "cards/ConversationStartersWorld.Wyr.xml",
    "cards/ichundderalkohol.xml",
    "cards/picolo/Picolo.xml",
    "cards/picolo/Picolo.Silly.xml",
    "cards/realfacts.xml",
];

export const slideWeights: { [key: string]: number } = {
    DownSlide: 0.1,
    DrinkSlide: 0.6,
    FactSlide: 0.3,
    GroupGameSlide: 0.3,
    NeverEverSlide: 0.5,
    NoIdeaLosesSlide: 0.3,
    TaskSlide: 0.2,
    TruthOrDareSlide: 0.35,
    VirusSlide: 0.2,
    WouldYouRatherSlide: 0.5,
};

// if a card has one of these tags and an arranged player is selected
// the propability that their counterpart is selected is increased further
export const higherArrangementPropabilityTags = ["sexual"];

// everyone uses what he can do best to get females
export const automaticArrangements: { [name: string]: string[] } = {
    Vincent: ["Melina"],
};
