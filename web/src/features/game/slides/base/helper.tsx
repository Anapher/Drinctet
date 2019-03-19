import { ParsingOptions } from "markdown-to-jsx";
import * as React from "react";

export function getRootStyles() {
    return {
        backgroundColor: "#3498db",
        height: "100%",
        fontSize: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
    };
}

function MyParagaph({ children, ...props }: any) {
    return (
        <p {...props} style={{ marginBlockStart: 5, marginBlockEnd: 5 }}>
            {children}
        </p>
    );
}

function MyH3({ children, ...props }: any) {
    return (
        <h3 {...props} style={{ marginBlockStart: 5, marginBlockEnd: 5 }}>
            {children}
        </h3>
    );
}

function MyH4({ children, ...props }: any) {
    return (
        <h4 {...props} style={{ marginBlockStart: 5, marginBlockEnd: 5 }}>
            {children}
        </h4>
    );
}

export const defaultMarkdownOptions: ParsingOptions = {
    overrides: {
        p: {
            component: MyParagaph,
            props: {},
        },
        h3: {
            component: MyH3,
            props: {},
        },
        h4: {
            component: MyH4,
            props: {},
        },
    },
};
