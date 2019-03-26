export const socialMediaPlatforms = ["Snapchat", "Instagram", "Facebook"];

export const defaultSources = [
    "cards/bullshitfact.xml",
    "cards/ichundderalkohol.xml",
    "cards/ConversationStartersWorld.NeverHaveIEver.xml",
    "cards/Bevil.xml",
    "cards/ConversationStartersWorld.TruthOrDareDare.xml",
    "cards/ConversationStartersWorld.TruthOrDareTruth.xml",
    "cards/ConversationStartersWorld.Wyr.xml",
    "cards/common.xml",
];

export const slideWeights: { [key: string]: number } = {
    FactSlide: 0.5,
    DownSlide: 0.5,
    NeverEverSlide: 0.5,
    TruthOrDareSlide: 0.5,
    WouldYouRatherSlide: 0.5,
    DrinkSlide: 0.5,
};

// if a card has one of these tags and an arranged player is selected
// the propability that their counterpart is selected is increased further
export const higherArrangementPropabilityTags = ["sexual"];
