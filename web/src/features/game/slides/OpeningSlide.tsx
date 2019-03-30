import { createStyles, Theme, WithStyles, withStyles, Typography } from "@material-ui/core";
import { RootState, RootAction } from "DrinctetTypes";
import Markdown from "markdown-to-jsx";
import * as React from "react";
import { LocalizeContextProps, withLocalize, Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { compose } from "redux";
import * as actions from "../actions";
import { toTranslator } from "../utils";
import { defaultMarkdownOptions, getContentStyles, getRootStyles } from "./base/helper";
import { SlidePresenter } from "./base/slide-presenter";
import { Keyframes, animated } from "react-spring/renderprops";
import { useSpring, animated as animatedDom } from "react-spring";

const color = "#2980b9";
const progressColor = "#3498db";

const mapStateToProps = (state: RootState) => ({
    state: state.game.slideState as OpeningSlideState,
});

const dispatchProps = {
    nextSlide: actions.requestSlideAsync.request,
};

const styles = (theme: Theme) =>
    createStyles({
        root: {
            ...getRootStyles(),
            backgroundColor: color,
            position: "relative",
        },
        rootProgress: {
            height: "100%",
            backgroundColor: progressColor,
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 5,
        },
        content: {
            ...getContentStyles(theme),
            zIndex: 10,
        },
        header: {
            color: "white",
            marginBottom: 20,
        },
    });

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps &
    WithStyles<typeof styles> &
    LocalizeContextProps;

function OpeningSlideComponent(props: Props) {
    const { classes, nextSlide, state, translate } = props;
    if (state === null) {
        return <div className={classes.root} />;
    }

    const { continuationDate } = state;
    const remaining = Math.abs(+continuationDate - Date.now());

    const Container = Keyframes.Spring(async (next: any) => {
        await next({
            from: { width: "0%" },
            width: "100%",
            config: {
                duration: remaining,
            },
        });
        await next({
            from: { backgroundColor: progressColor },
            backgroundColor: color,
            config: { duration: 200 },
        });
        await next({
            from: { backgroundColor: color },
            backgroundColor: progressColor,
            config: { duration: 200 },
        });
    }) as any;

    const tapToContinueProps = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        delay: remaining,
    });

    return (
        <div
            className={classes.root}
            onClick={() => new Date() > continuationDate && nextSlide(toTranslator(props))}
        >
            <Container native>
                {(props: any) => <animated.div className={classes.rootProgress} style={props} />}
            </Container>
            <div className={classes.content}>
                <Typography variant="h5" className={classes.header} gutterBottom>
                    <Translate id="game.welcome" />
                </Typography>
                <Markdown
                    children={translate("game.openingInfo") as string}
                    options={defaultMarkdownOptions}
                />
                <animatedDom.div style={tapToContinueProps}>
                    <Typography style={{ color: "white", marginTop: 20 }} variant="h6">
                        <Translate id="game.tapToContinue" />
                    </Typography>
                </animatedDom.div>
            </div>
        </div>
    );
}

const Component = compose(
    connect(
        mapStateToProps,
        dispatchProps,
    ),
    withStyles(styles),
    withLocalize,
)(OpeningSlideComponent) as React.ComponentType;

interface OpeningSlideState {
    continuationDate: Date;
}

export class OpeningSlide implements SlidePresenter {
    slideType = "OpeningSlide";
    requiredCards = [];
    backgroundColor = color;

    initialize(): RootAction[] {
        const date = new Date();
        date.setSeconds(date.getSeconds() + 5);

        return [
            this.setSlideState({
                continuationDate: date,
            }),
        ];
    }

    initializeFollowUp(): RootAction[] {
        throw new Error("Method not implemented.");
    }

    setSlideState(state: OpeningSlideState): RootAction {
        return actions.setSlideState({ state, insights: null });
    }

    render(): React.ReactNode {
        return <Component />;
    }
}
