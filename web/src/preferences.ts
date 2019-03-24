export const socialMediaPlatforms = ["Snapchat", "Instagram", "Facebook"];

export const defaultSources = [
    "bullshitfact.xml",
    "ichundderalkohol.xml",
    "ConversationStartersWorld.NeverHaveIEver.xml",
    "Bevil.xml"
    // "https://raw.githubusercontent.com/Anapher/Drinctet/master/web/public/bullshitfact.xml",
];

export const slideWeights: { [key: string]: number } = {
    FactSlide: 0,
    DownSlide: 0,
    NeverEverSlide: 0,
    TruthOrDareSlide: 1,
};

// if a card has one of these tags and an arranged player is selected
// the propability that their counterpart is selected is increased further
export const higherArrangementPropabilityTags = ["sexual"];
