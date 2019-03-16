import { RootState } from "DrinctetTypes";
import { setTagWeight } from "../../actions";
import { LocalizeContextProps, withLocalize, Translate } from "react-localize-redux";
import { Typography } from "@material-ui/core";
import ItemPreferences from "./ItemPreferences";
import { connect } from "react-redux";
import * as React from "react";
import * as _ from "underscore";

const mapStateToProps = (state: RootState) => ({
    tags: state.settings.tags,
    decks: state.settings.sources,
});

const dispatchProps = {
    setTagWeight,
};

type Props = LocalizeContextProps & ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function TagPreferences({ tags, decks, setTagWeight }: Props) {
    const allTags = _.uniq(decks.flatMap(x => x.tags));
    const weights = allTags.map(x => tags.find(y => y.value === x) || { value: x, weight: 0.5 });

    return (
        <div>
            <Typography gutterBottom variant="h5">
                <Translate id="settings.configuration.tags" />
            </Typography>
            <ItemPreferences items={weights} onChangeWeight={x => setTagWeight(x)} />
            {weights.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    <Translate id="settings.configuration.tags.none" />
                </Typography>
            ) : (
                undefined
            )}
        </div>
    );
}

export default connect(
    mapStateToProps,
    dispatchProps,
)(withLocalize(TagPreferences));
