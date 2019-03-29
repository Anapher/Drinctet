import { MelinaAlgorithm } from "@core/selection/melina-algorithm";
import {
    createStyles,
    Typography,
    withStyles,
    WithStyles,
    FormControl,
    Select,
    Input,
    MenuItem,
    Grid,
} from "@material-ui/core";
import { percentageFixedTotal } from "@utils/statistics";
import { toFixedEnd } from "@utils/string-extensions";
import { RootState } from "DrinctetTypes";
import React, { Component } from "react";
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
import { parsers } from "../../../impl/registrations";

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
type State = { selectedCardType: string | null };

class InsightsCards extends Component<Props, State> {
    readonly state = { selectedCardType: null };

    setSelectedCardType = (type: string) => {
        this.setState({ selectedCardType: type === "" ? null : type });
    };

    render() {
        const { translate, currentWillPower } = this.props;
        const { selectedCardType } = this.state;

        const cardTypes = ["", ...Object.keys(parsers)];

        const selection = getRandomSelectionAlgorithm() as MelinaAlgorithm;
        const insights = selection.getAllCardDeckStatistics(selectedCardType);

        const decksStatistics = percentageFixedTotal(insights.decks, x => x.weight, 1000).map(
            x => ({
                value: x.part / 10,
                name: x.value.value.url,
            }),
        );

        const willPowerStatistics = percentageFixedTotal(
            insights.willPower,
            x => x.weight,
            1000,
        ).map(x => ({
            value: x.part / 10,
            name: x.value.value.willPower || translate("insights.universal"),
            info: x.value.value,
        }));

        return (
            <div>
                <Typography variant="h5">
                    <Translate id="insights.cardsDist" />
                </Typography>
                <Grid container alignItems="flex-end" spacing={16}>
                    <Grid item>
                        <FormControl>
                            <Select
                                style={{ width: 200, marginTop: 10 }}
                                value={selectedCardType || ""}
                                displayEmpty={true}
                                renderValue={x => x || translate("insights.allCards")}
                                onChange={ev => this.setSelectedCardType(ev.target.value)}
                                input={<Input />}
                            >
                                {cardTypes.map(x => (
                                    <MenuItem key={x} value={x}>
                                        {x || translate("insights.allCards")}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Typography>{`${translate("insights.cards")}: ${insights.totalCards}`}</Typography>
                    </Grid>
                </Grid>
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
                                    cards: insights.decks.find(x => x.value.url === url)!.value
                                        .cards.length,
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
                        <Tooltip
                            formatter={(x, _, e) =>
                                `${x}% (${e.payload.info.count} ${translate("insights.cards")})`
                            }
                        />
                        <Bar
                            dataKey="value"
                            maxBarSize={20}
                            name={translate("insights.part") as string}
                        >
                            {willPowerStatistics.map((entry, index) => (
                                <Cell
                                    fill={
                                        entry.info.willPower === currentWillPower
                                            ? "#e74c3c"
                                            : "#8884d8"
                                    }
                                    key={index}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default compose(
    connect(mapStateToProps),
    withStyles(styles),
    withLocalize,
)(InsightsCards) as React.ComponentType;
