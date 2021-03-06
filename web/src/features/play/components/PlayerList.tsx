import { ListItemText } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { RootState } from "DrinctetTypes";
import * as React from "react";
import { connect } from "react-redux";
import { PlayerInfo } from "@core/player-info";
import { removePlayer, updatePlayer } from "../actions";
import * as selectors from "../selectors";
import PlayerListItem from "./PlayerListItem";

const mapStateToProps = (state: RootState) => ({
  players: selectors.getPlayers(state.play),
});

const dispatchProps = {
  removePlayer,
  updatePlayer,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function PlayerList({ players, removePlayer, updatePlayer }: Props) {
  return (
    <List>
      {players.map(player => (
        <ListItem key={player.id}>
          <ListItemText>
            <PlayerListItem
              name={player.name}
              gender={player.gender}
              onRemoveClick={() => removePlayer(player.id)}
              onNameChanged={name =>
                updatePlayer(new PlayerInfo(player.id, name, player.gender))
              }
              onSwapGenderClick={() =>
                updatePlayer(
                  new PlayerInfo(
                    player.id,
                    player.name,
                    player.gender === "Female" ? "Male" : "Female",
                  ),
                )
              }
            />
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

export default connect(
  mapStateToProps,
  dispatchProps,
)(PlayerList);
