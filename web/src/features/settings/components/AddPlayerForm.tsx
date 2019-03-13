import * as React from "react";
import { addPlayer } from "../actions";
import { Gender } from "../../../core/player-info";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";

const dispatchProps = {
  addPlayer,
};

type Props = typeof dispatchProps;

type State = {
  name: string;
};

class AddPlayerForm extends React.Component<Props, State> {
  readonly state = { name: "" };

  handlePlayerNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: ev.currentTarget.value });
  };

  handleAddClick = () => {
    let gender: Gender = "Male";
    if (this.state.name.endsWith("a"))
      //sorry Luca
      gender = "Female";

    this.props.addPlayer({ name: this.state.name, gender });
    this.setState({ name: "" });
  };

  handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (this.state.name) this.handleAddClick();
    }
  };

  render() {
    const { name } = this.state;

    return (
      <form onKeyDown={this.handleFormKeyDown}>
        <div style={{ display: "flex" }}>
          <Input
            style={{ flexGrow: 1 }}
            type="text"
            value={name}
            placeholder="Player name"
            onChange={this.handlePlayerNameChange}
          />
          <Button disabled={!name} onClick={this.handleAddClick}>
            Add
          </Button>
        </div>
      </form>
    );
  }
}

export default connect(
  null,
  dispatchProps,
)(AddPlayerForm);
