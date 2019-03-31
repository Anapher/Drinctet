// import { Grid, createStyles, WithStyles, withStyles } from "@material-ui/core";
// import React, { Component } from "react";
// import SettingsView from "../../play/components/SettingsView";
// import DrinctetHeader from "./DrinctetHeader";
// import StartButton from "./StartButton";

// const styles = createStyles({
//     root: {
//         height: "100vh",
//         display: "flex",
//         flexDirection: "column",
//     },
//     header: {
//         margin: 20,
//         marginBottom: 10,
//     },
// });

// type Props = WithStyles<typeof styles>;

// interface State {
//     viewportHeight: number;
// }

// class WelcomeView extends Component<Props, State> {
//     readonly state = {
//         viewportHeight: window.innerHeight,
//     };

//     constructor(props: Props) {
//         super(props);

//         this.updateHeight = this.updateHeight.bind(this);
//     }

//     componentDidMount() {
//         window.addEventListener("resize", this.updateHeight);
//     }

//     componentWillUnmount() {
//         window.removeEventListener("resize", this.updateHeight);
//     }

//     updateHeight(): void {
//         this.setState({ viewportHeight: window.innerHeight });
//     }

//     render() {
//         const { classes } = this.props;
//         const { viewportHeight } = this.state;
//         return (
//             <div className={classes.root}>
//                 {viewportHeight > 500 ? (
//                     <Grid container justify="center">
//                         <Grid item xs={12} md={6} className={classes.header}>
//                             <DrinctetHeader />
//                         </Grid>
//                     </Grid>
//                 ) : null}
//                 <div style={{ flexGrow: 1, height: 0 }}>
//                     <Grid container justify="center" style={{ height: "100%" }}>
//                         <Grid item xs={12} md={6}>
//                             <SettingsView />
//                         </Grid>
//                     </Grid>
//                 </div>
//                 <Grid container justify="center">
//                     <Grid item xs={12} md={6} container justify="center">
//                         <Grid item xs={10} lg={8} style={{ padding: "10px 20px 20px 20px" }}>
//                             <StartButton />
//                         </Grid>
//                     </Grid>
//                 </Grid>
//             </div>
//         );
//     }
// }

// export default withStyles(styles)(WelcomeView);
