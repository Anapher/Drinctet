import { ParsingOptions } from "markdown-to-jsx";
import * as React from "react";
import { Typography } from "@material-ui/core";
import { ThemeStyle } from "@material-ui/core/styles/createTypography";

const Header = (style: ThemeStyle) => ({ children, ...props }: any) => {
    return (
        <Typography color="inherit" {...props} variant={style}>
            {children}
        </Typography>
    );
};

const SizedHeader = (fontSize: string) => ({ children, ...props }: any) => {
    return (
        <Typography color="inherit" {...props} variant="h6" style={{ fontSize }}>
            {children}
        </Typography>
    );
};

function Paragraph({ children, ...props }: any) {
    return (
        <Typography {...props} color="inherit" component="p">
            {children}
        </Typography>
    );
}

function Code({ children, ...props }: any) {
    return (
        <Typography {...props} color="inherit" component="p" style={{fontSize: "0.8em", fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New',monospace"}}>
            {children}
        </Typography>
    );
}

const SizedBlock = (fontSize: string) => ({ children, ...props }: any) => (
        <Typography
            color="inherit"
            {...props}
            style={{ marginBlockStart: 5, marginBlockEnd: 5, fontSize }}
        >
            {children}
        </Typography>)
;

const BlockQuote = ({children, ...props}: any) => <div {...props} style={{borderLeft: "1px solid white", paddingLeft: 16}}>{children}</div>
const ListItem = ({children, ...props}: any) => <li {...props}><Typography>{children}</Typography></li>

const SizedHeaderBlock = (fontSize: string) => ({ children, ...props }: any) => {
    return (
        <Typography color="inherit" {...props} variant="h6" style={{ fontSize, marginTop: 16 }}>
            {children}
        </Typography>
    );
};

export const markdownOptions: ParsingOptions = {
    overrides: {
        p: {
            component: Paragraph,
            props: {},
        },
        h1: {
            component: SizedHeaderBlock("1.4em"),
            props: {},
        },
        h2: {
            component: SizedHeaderBlock("1.3em"),
            props: {},
        },
        h3: {
            component: SizedHeaderBlock("1.2em"),
            props: {},
        },
        h4: {
            component: SizedHeaderBlock("1.1em"),
            props: {},
        },
        code: {
            component: Code,
            props: {}
        },
        li: {
            component: ListItem,
            props: {}
        },
    },
};

export const cardMarkdownOptions: ParsingOptions = {
    overrides: {
        p: {
            component: SizedBlock("1em"),
            props: {},
        },
        h1: {
            component: Header("h5"),
            props: {},
        },
        h2: {
            component: Header("h6"),
            props: {},
        },
        h3: {
            component: SizedHeader("1.2em"),
            props: {},
        },
        h4: {
            component: SizedHeader("1.1em"),
            props: {},
        },
        h5: {
            component: SizedHeader("1.08em"),
            props: {},
        },
        h6: {
            component: SizedHeader("1.05em"),
            props: {},
        },
        blockquote: {
            component: BlockQuote,
            props: {},
        },
    },
};
