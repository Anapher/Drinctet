// import { createStyles, withStyles, WithStyles } from "@material-ui/core";
// import Fab from "@material-ui/core/Fab";
// import { RootState } from "DrinctetTypes";
// import * as React from "react";
// import { LocalizeContextProps, Translate, withLocalize } from "react-localize-redux";
// import { connect } from "react-redux";
// import { RouteComponentProps, withRouter } from "react-router";
// import { compose } from "redux";
// import { startGame } from "../../game/actions";

// const styles = createStyles({
//     root: {
//         color: "white",
//         width: "100%",
//         backgroundColor: "#e74c3c",
//         "&:hover": {
//             backgroundColor: "#c0392b",
//         },
//     },
// });

// const mapStateToProps = (state: RootState) => ({
//     settings: state.settings,
// });

// const dispatchProps = {
//     startGame,
// };

// type Props = ReturnType<typeof mapStateToProps> &
//     typeof dispatchProps &
//     WithStyles<typeof styles> &
//     LocalizeContextProps &
//     RouteComponentProps;

// class StartButton extends React.Component<Props> {
//     startGame = () => {
//         const { startGame, history } = this.props;

//         startGame(history);
//     };

//     render() {
//         const { classes, settings } = this.props;

//         const arePlayersSelected = settings.players.length > 0;
//         const areSourcesAdded = settings.sources.filter(x => x.cards !== undefined).length > 0;
//         const areSourcesLoading = settings.sources.filter(x => x.isLoading).length > 0;

//         return (
//             <Fab
//                 variant="extended"
//                 size="large"
//                 disabled={!arePlayersSelected || !areSourcesAdded || areSourcesLoading}
//                 classes={{ root: classes.root }}
//                 onClick={this.startGame}
//             >
//                 <Translate id="welcome.startGame" />
//             </Fab>
//         );
//     }
// }

// export default compose(
//     withStyles(styles),
//     connect(
//         mapStateToProps,
//         dispatchProps,
//     ),
//     withLocalize,
//     withRouter,
// )(StartButton) as React.ComponentType;
