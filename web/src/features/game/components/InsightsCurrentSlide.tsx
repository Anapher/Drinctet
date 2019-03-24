import React, { Component } from "react";
import { Typography, createStyles, withStyles, WithStyles } from "@material-ui/core";
import { Translate, withLocalize } from "react-localize-redux";
import { RootState } from "DrinctetTypes";
import { compose } from "redux";
import { connect } from "react-redux";
import { percentageFixedTotal } from "@utils/statistics";

const mapStateToProps = (state: RootState) => ({
    slide: state.game.selectedSlide,
    slideInsights: state.game.slideInsights,
    playerInsights: state.game.playerInsights,
    players: state.settings.players,
    card: state.game.selectedCard,
});

const styles = createStyles({
    section: {
        marginTop: 10,
    },
    scrollableTable: {
        overflow: "auto",
        width: "100%",
    },
    tableCellNoBreak: {
        whiteSpace: "nowrap",
    },
});

type Props = ReturnType<typeof mapStateToProps> & WithStyles<typeof styles>;

function renderPredefinedPlayers({ playerInsights, players }: Props) {
    return (
        <div>
            <Typography>
                <Translate id="insights.predefinedPlayers" />
                {": "}
                {playerInsights!.predefined
                    .map(x => players.find(y => y.id === x))
                    .filter(x => x != null)
                    .map(x => x!.name)
                    .join(", ")}
            </Typography>
        </div>
    );
}

function renderPlayerInsights(props: Props) {
    const { playerInsights, players, classes } = props;
    return (
        <div className={classes.scrollableTable}>
            {playerInsights!.predefined.length > 0 ? renderPredefinedPlayers(props) : null}
            {playerInsights!.rounds.map((x, i) => {
                const statistics = percentageFixedTotal(x, x => x.weight, 1000);
                return (
                    <table key={i}>
                        <tbody>
                            <tr>
                                <td className={classes.tableCellNoBreak}>
                                    <Typography>
                                        <Translate id="insights.player" data={{ number: i + 1 }} />:
                                    </Typography>
                                </td>
                                {statistics.map(y => {
                                    const player = players.find(p => p.id === y.value.playerId);
                                    let element: JSX.Element;
                                    if (player === undefined) {
                                        element = (
                                            <span>
                                                <i>
                                                    <Translate id="insights.playerRemoved" />
                                                </i>{" "}
                                                ({y.part / 10}%)
                                            </span>
                                        );
                                    } else {
                                        element = (
                                            <span>
                                                {player.name} ({y.part / 10}%)
                                            </span>
                                        );
                                    }

                                    return (
                                        <td key={y.value.playerId} style={{ paddingLeft: 10 }}>
                                            <Typography>
                                                {conditionalBold(element, y.value.chosen)}
                                            </Typography>
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                );
            })}
        </div>
    );
}

function conditionalBold(element: JSX.Element, isBold: boolean): JSX.Element {
    if (isBold) {
        return <b>{element}</b>;
    }

    return element;
}

function renderSlideWeights({ slide, slideInsights }: Props) {
    const slides = slideInsights!.weights;
    const statistics = percentageFixedTotal(slides, x => x.weight, 1000);

    return (
        <table>
            <tbody>
                {statistics.map(x => (
                    <tr key={x.value.value}>
                        <td>
                            <Typography>
                                {conditionalBold(
                                    <span>{x.value.value}</span>,
                                    x.value.value === slide,
                                )}
                            </Typography>
                        </td>
                        <td style={{ paddingLeft: 10 }}>
                            <Typography>
                                {conditionalBold(
                                    <span>{x.part / 10}%</span>,
                                    x.value.value === slide,
                                )}
                            </Typography>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

class InsightsCurrentSlide extends Component<Props> {
    render() {
        const { playerInsights, classes, card } = this.props;
        return (
            <div>
                <Typography variant="h5">
                    <Translate id="insights.currentSlide" />
                </Typography>
                <Typography>
                    <Translate id="insights.currentCard" />
                    {": "}
                    {card === null ? (
                        <i>
                            <Translate id="insights.noCard" />
                        </i>
                    ) : (
                        <span>
                            <Translate
                                id="insights.cardInfo"
                                data={{
                                    name: card.type,
                                    id: card.id,
                                    wp: card.willPower === undefined ? <Translate id="insights.universal"/> : card.willPower,
                                }}
                            />
                        </span>
                    )}
                </Typography>
                {renderSlideWeights(this.props)}

                <Typography variant="h6" className={classes.section}>
                    <Translate id="insights.playerSelection" />
                </Typography>
                {playerInsights === null ? (
                    <Typography>
                        <i>
                            <Translate id="insights.noPlayers" />
                        </i>
                    </Typography>
                ) : (
                    renderPlayerInsights(this.props)
                )}
            </div>
        );
    }
}

export default compose(
    connect(mapStateToProps),
    withLocalize,
    withStyles(styles),
)(InsightsCurrentSlide) as React.ComponentType;
