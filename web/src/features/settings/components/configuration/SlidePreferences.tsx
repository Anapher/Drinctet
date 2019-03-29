import { RootState } from "DrinctetTypes";
import { setSlideWeight } from "../../actions";
import { LocalizeContextProps, withLocalize, Translate } from "react-localize-redux";
import { Typography } from "@material-ui/core";
import ItemPreferences from "./ItemPreferences";
import { connect } from "react-redux";
import * as React from "react";
import _ from "lodash";
import { percentageFixedTotal } from "@utils/statistics";

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
            <Typography>
                <Translate
                    id="settings.configuration.slidesProjection"
                    data={{ count: totalCards }}
                />
                {slidePercentages.map((x, i) => (
                    <React.Fragment key={x.value.value}>
                        <b style={{fontWeight: "bolder"}}>{x.value.value}</b>: {x.part}
                        {i < slidePercentages.length - 1 ? ", " : null}
                    </React.Fragment>
                ))}
            </Typography>
        </div>
    );
}

export default connect(
    mapStateToProps,
    dispatchProps,
)(withLocalize(SlidePreferences));
