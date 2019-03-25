export const socialMediaPlatforms = ["Snapchat", "Instagram", "Facebook"];

export const defaultSources = [
    "cards/bullshitfact.xml",
    "cards/ichundderalkohol.xml",
    "cards/ConversationStartersWorld.NeverHaveIEver.xml",
    "cards/Bevil.xml",
    "cards/ConversationStartersWorld.TruthOrDareDare.xml",
    "cards/ConversationStartersWorld.TruthOrDareTruth.xml",
    "cards/ConversationStartersWorld.Wyr.xml",
];

export const slideWeights: { [key: string]: number } = {
    FactSlide: 0,
    DownSlide: 0,
    NeverEverSlide: 0,
    TruthOrDareSlide: 0,
    WouldYouRatherSlide: 0.5,
};

// if a card has one of these tags and an arranged player is selected
// the propability that their counterpart is selected is increased further
export const higherArrangementPropabilityTags = ["sexual"];
