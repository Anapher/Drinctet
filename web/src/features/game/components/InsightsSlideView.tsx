import { Typography } from "@material-ui/core";
import * as React from "react";
import { Translate } from "react-localize-redux";

export default function InsightsSlideView() {
    return (
        <div>
            <Typography variant="h5" gutterBottom>
                <Translate id="insights.slide" />
            </Typography>
            <Typography>
                <Translate id="" />
            </Typography>
        </div>
    );
}
