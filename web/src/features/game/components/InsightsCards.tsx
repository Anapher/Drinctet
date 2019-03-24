import { MelinaAlgorithm } from "@core/selection/melina-algorithm";
import { createStyles, Typography, withStyles, WithStyles } from "@material-ui/core";
import { percentageFixedTotal } from "@utils/statistics";
import { toFixedEnd } from "@utils/string-extensions";
import { RootState } from "DrinctetTypes";
import * as React from "react";
import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
import { connect } from "react-redux";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { compose } from "redux";
import { getRandomSelectionAlgorithm } from "../game-engine";

const mapStateToProps = (state: RootState) => ({
    currentWillPower: state.game.currentWillPower,
});

const styles = createStyles({
    chart: {
        width: 200,
        height: 300,
    },
});

type Props = ReturnType<typeof mapStateToProps> & WithStyles<typeof styles> & LocalizeContextProps;

function InsightsCards({ translate, currentWillPower }: Props) {
    const selection = getRandomSelectionAlgorithm() as MelinaAlgorithm;
    const insights = selection.getAllCardDeckStatistics();

    const decksStatistics = percentageFixedTotal(insights.decks, x => x.weight, 1000).map(x => ({
        value: x.part / 10,
        name: x.value.value.url,
    }));

    const willPowerStatistics = percentageFixedTotal(insights.willPower, x => x.weight, 1000).map(
        x => ({
            value: x.part / 10,
            name: x.value.value || translate("insights.universal"),
            willPower: x.value.value
        }),
    );

    return (
        <div>
            <Typography variant="h5">
                <Translate id="insights.cardsDist" />
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={decksStatistics}>
                    <CartesianGrid />
                    <XAxis dataKey="name" tickFormatter={x => toFixedEnd(x, 18)} />
                    <YAxis tickFormatter={x => x + "%"} />
                    <Tooltip
                        formatter={x => x + "%"}
                        labelFormatter={url =>
                            translate("insights.cardDeckName", {
                                url,
                                cards: insights.decks.find(x => x.value.url === url)!.value.cards
                                    .length,
                            })
                        }
                    />
                    <Bar
                        name={translate("insights.part") as string}
                        dataKey="value"
                        fill="#8884d8"
                        maxBarSize={20}
                    />
                </BarChart>
            </ResponsiveContainer>
            <Typography variant="h5">
                <Translate id="insights.willPowerDist" />
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={willPowerStatistics}>
                    <CartesianGrid />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={x => x + "%"} />
                    <Tooltip formatter={x => x + "%"} />
                    <Bar
                        dataKey="value"
                        maxBarSize={20}
                        name={translate("insights.part") as string}
                    >
                        {willPowerStatistics.map((entry, index) => (
                            <Cell
                                fill={entry.willPower === currentWillPower ? "#e74c3c" : "#8884d8"}
                                key={index}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default compose(
    connect(mapStateToProps),
    withStyles(styles),
    withLocalize,
)(InsightsCards) as React.ComponentType;
