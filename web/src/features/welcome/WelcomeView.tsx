import * as React from "react";
import DrinctetHeader from "./DrinctetHeader";

import StartButton from "./StartButton";
import SettingsView from "../settings/components/SettingsView";
import { Grid } from "@material-ui/core";
// import { Grid } from "@material-ui/core";

// const getWrapperStyle = (): React.CSSProperties => ({
//   display: "flex",
//   flexDirection: "column",
//   height: "100vh",
// });

// const getHeaderStyle = (): React.CSSProperties => ({
//   background: "tomato",
//   height: "auto",
// });

{
  /* <Grid
container
justify="center"
style={{ backgroundColor: "tomato", height: "100vh" }}
>
<Grid item spacing={0} xs={12} md={6}> */
}

export default () => (
  <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
    <Grid container justify="center">
      <Grid item xs={12} md={6} style={{ margin: 20 }}>
        <DrinctetHeader />
      </Grid>
    </Grid>
    <div style={{ flexGrow: 1, marginBottom: 20, height: 0 }}>
      <Grid container justify="center" style={{ height: "100%"}}>
        <Grid item xs={12} md={6}>
          <SettingsView />
        </Grid>
      </Grid>
    </div>
    <Grid container justify="center">
      <Grid item xs={12} md={6} container justify="center">
        <Grid item xs={10} lg={8} style={{ padding: 20 }}>
          <StartButton />
        </Grid>
      </Grid>
    </Grid>
  </div>
);

{
  /*
  
    <Grid container justify="center" style={{margin: 20}}>
    <Grid item container spacing={24} xs={12} md={6} direction="row">
      <Grid item xs={12}>
        <DrinctetHeader />
      </Grid>
      <Grid item xs={12} style={{}}>
        <SettingsView />
      </Grid>
      <Grid item xs={12}>
        <StartButton />
      </Grid>
    </Grid>
  </Grid>
  
  
  <AddPlayerForm />
<div style={{ flexGrow: 1, overflow: "auto" }}>
  <PlayerList />
</div> 



  <div
    style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <section
      style={{
        width: 600,
        margin: 40,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      
      
    </section>
  </div>
*/
}
