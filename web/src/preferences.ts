export const socialMediaPlatforms = ["Snapchat", "Instagram", "Facebook"];

export const defaultSources = [
    "bullshitfact.xml",
    "ichundderalkohol.xml",
    "ConversationStartersWorld.NeverHaveIEver.xml"
    // "https://raw.githubusercontent.com/Anapher/Drinctet/master/web/public/bullshitfact.xml",
];

export const slideWeights: { [key: string]: number } = {
    FactSlide: 0.5,
    DownSlide: 0.1,
    NeverEverSlide: 0.5
};

// if a card has one of these tags and an arranged player is selected
// the propability that their counterpart is selected is increased further
export const higherArrangementPropabilityTags = ["sexual"];
