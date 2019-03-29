import { ParsingOptions } from "markdown-to-jsx";
import * as React from "react";
import { Theme } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

export function getRootStyles(): CSSProperties {
    return {
        backgroundColor: "transparent",
        height: "100%",
        fontSize: 25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        cursor: "pointer",
        "-webkit-tap-highlight-color": "rgba(255, 255, 255, 0)"
    };
}

export function getContentStyles(theme: Theme): CSSProperties {
    return {
        textAlign: "center",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
            marginLeft: 30,
            marginRight: 30,
            fontSize: 20,
        },
        [theme.breakpoints.up("md")]: {
            width: "80%",
        },
        [theme.breakpoints.up("lg")]: {
            width: "60%",
        },
    }
}

export function spaceHeaderStyles(theme: Theme): CSSProperties {
    return {
        visibility: "hidden",
        [theme.breakpoints.down("sm")]: {
            display: "none",
        }
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
