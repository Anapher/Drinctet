import { TextElement, TextTranslation } from "../cards/text-card";

/** parses the text content of an element */
export class TextContentParser {
    public result: TextElement[];
    
    private isConditionalElement: boolean | undefined = undefined;

    constructor() {
        this.result = [];
    }

    public addElement(xml: Element): boolean {
        switch (xml.tagName) {
            case "Case":
                if (this.isConditionalElement === false) return false;
                this.isConditionalElement = true;

                this.result.push(this.parseTextElement(xml));
                return true;
            case "Text":
                if (this.isConditionalElement === true) 
                    return false;
                else if (this.isConditionalElement === undefined)
                    this.result.push({translations: [], weight: 1});
                
                this.isConditionalElement = false;
                this.result[0].translations.push(this.parseTranslation(xml));
                return true;
            default:
                return false;
        }
    }

    private parseTextElement(element: Element): TextElement {
        const translations: TextTranslation[] = [];
        const textElement = new TextElement();

        const weight = Number(element.getAttribute("weight"));
        if (!isNaN(weight))
            textElement.weight = weight;
        
        const texts = element.getElementsByTagName("Text");
        for (let i = 0; i < texts.length; i++) {
            const textXmlNode = texts[i];
            translations.push(this.parseTranslation(textXmlNode))
        }

        textElement.translations = translations;
        return textElement;
    }

    private parseTranslation(element: Element) {
        const lang = element.getAttribute("lang");
        if (!lang) throw new Error("lang attribute not found on element");

        const content = element.textContent as string;
        return new TextTranslation(lang, content);
    }
}
