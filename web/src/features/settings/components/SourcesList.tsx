import { ListItemText } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { RootState } from "DrinctetTypes";
import * as React from "react";
import { connect } from "react-redux";
import { loadSourceAsync, removeSource } from "../actions";
import * as selectors from "../selectors";
import SourcesListItem from "./SourcesListItem";

const mapStateToProps = (state: RootState) => ({
  sources: selectors.getSources(state.settings),
});

const dispatchProps = {
  loadSource: loadSourceAsync.request,
  removeSource,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function SourcesList({ sources, removeSource, loadSource }: Props) {
  return (
    <List>
      {sources.map(source => (
        <ListItem key={source.url}>
          <ListItemText>
            <SourcesListItem
              url={source.url}
              isLoading={source.isLoading}
              errorMessage={source.errorMessage}
              cardsCount={source.cards && source.cards.length || 0}
              onRemoveClick={() => removeSource(source.url)}
              onReloadClick={() => loadSource(source.url)}
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
)(SourcesList);
