import { RootState } from "DrinctetTypes";
import { setSlideWeight } from "../../actions";
import { LocalizeContextProps, withLocalize, Translate } from "react-localize-redux";
import { Typography } from "@material-ui/core";
import ItemPreferences from "./ItemPreferences";
import { connect } from "react-redux";
import * as React from "react";
import _ from "lodash";

const mapStateToProps = (state: RootState) => ({
    slides: state.settings.slides,
});

const dispatchProps = {
    setSlideWeight,
};

type Props = LocalizeContextProps & ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function SlidePreferences({ slides, setSlideWeight }: Props) {
    const totalCards = 50;
    const slidePercentages = percentageFixedTotal(slides, x => x.weight, totalCards);

    return (
        <div>
            <Typography gutterBottom variant="h5">
                <Translate id="settings.configuration.slides" />
            </Typography>
            <ItemPreferences items={slides} onChangeWeight={x => setSlideWeight(x)} />
            <span>When you take {totalCards} cards, you get </span>
            {slidePercentages.map(x => (
                <React.Fragment key={x.value.value}>
                    <b>{x.value.value}</b>: {x.part}
                    {", "}
                </React.Fragment>
            ))}
        </div>
    );
}

function percentageFixedTotal<T>(
    values: T[],
    getPercentage: (x: T) => number,
    target: number,
): Array<{ value: T; part: number }> {
    // https://stackoverflow.com/a/13483486
    const percentageValues = values.map(value => ({ value, percent: getPercentage(value) }));
    const total = percentageValues.reduce((x, y) => x + y.percent, 0);

    const result = new Array<{ value: T; part: number }>();
    let sum = 0;
    let prevBaseline = 0;

    for (let i = 0; i < percentageValues.length; i++) {
        const {value, percent} = percentageValues[i];

        sum += percent / total * target;
        const sumRounded = Math.round(sum);

        result.push({ value, part: sumRounded - prevBaseline });
        prevBaseline = sumRounded;
    }

    console.log(sum);
    

    return result;
}

export default connect(
    mapStateToProps,
    dispatchProps,
)(withLocalize(SlidePreferences));
