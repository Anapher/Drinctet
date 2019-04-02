import { Theme } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

export function rootStyle(): CSSProperties {
    return {
        backgroundColor: "transparent",
        height: "100%",
        fontSize: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        cursor: "pointer",
        "-webkit-tap-highlight-color": "rgba(255, 255, 255, 0)",
    };
}

export function contentStyle(theme: Theme): CSSProperties {
    return {
        textAlign: "center",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
            marginLeft: 30,
            marginRight: 30,
            fontSize: 18,
        },
        [theme.breakpoints.up("md")]: {
            width: "80%",
        },
        [theme.breakpoints.up("lg")]: {
            width: "60%",
        },
    };
}

export function headerStyle(theme: Theme): CSSProperties {
    return {
        [theme.breakpoints.down("sm")]: {
            fontSize: "2em",
        },
    };
}

export function smallHeaderStyle(theme: Theme): CSSProperties {
    return {
        color: "white",
        [theme.breakpoints.down("sm")]: {
            fontSize: "1.5em",
        },
    };
}

export function hidden(): CSSProperties {
    return {
        visibility: "hidden",
    };
}
