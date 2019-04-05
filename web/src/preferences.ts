export const socialMediaPlatforms = ["Snapchat", "Instagram", "Facebook"];

export const defaultSources = [
    "cards/ichundderalkohol.xml",
    "cards/bullshitfact.xml",
    "cards/ConversationStartersWorld.NeverHaveIEver.xml",
    "cards/Bevil.xml",
    "cards/ConversationStartersWorld.TruthOrDareDare.xml",
    "cards/ConversationStartersWorld.TruthOrDareTruth.xml",
    "cards/ConversationStartersWorld.Wyr.xml",
    "cards/common.xml",
    "cards/picolo/Picolo.xml",
    "cards/picolo/Picolo.Silly.xml",
    "cards/realfacts.xml",
];

export const slideWeights: { [key: string]: number } = {
    FactSlide: 0.3,
    DownSlide: 0.1,
    NeverEverSlide: 0.5,
    TruthOrDareSlide: 0.35,
    WouldYouRatherSlide: 0.5,
    DrinkSlide: 0.6,
    VirusSlide: 0.2,
    NoIdeaLosesSlide: 0.3,
    GroupGameSlide: 0.3,
    TaskSlide: 0.2,
};

// if a card has one of these tags and an arranged player is selected
// the propability that their counterpart is selected is increased further
export const higherArrangementPropabilityTags = ["sexual"];
