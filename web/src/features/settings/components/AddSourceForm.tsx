import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import { RootState } from "DrinctetTypes";
import * as React from "react";
import { connect } from "react-redux";
import { addSource, loadSourceAsync } from "../actions";
import * as selectors from "../selectors";
import { LocalizeContextProps, withLocalize, Translate } from "react-localize-redux";

const mapStateToProps = (state: RootState) => ({
    sources: selectors.getSources(state.settings),
});

const dispatchProps = {
    addSource,
    loadSource: loadSourceAsync.request,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps & LocalizeContextProps;

type State = {
    url: string;
};

class AddSourceForm extends React.Component<Props, State> {
    readonly state = { url: "" };

    handleUrlChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ url: ev.currentTarget.value });
    };

    handleAddClick = () => {
        if (!this.state.url || this.props.sources.findIndex(x => x.url === this.state.url) > -1) {
            return;
        }

        this.props.addSource(this.state.url);
        this.props.loadSource(this.state.url);
        this.setState({ url: "" });
    };

    handleFormKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (this.state.url) {
                this.handleAddClick();
            }
        }
    };

    render() {
        const { url } = this.state;
        const { translate } = this.props;
        const sourceExists = this.props.sources.findIndex(x => x.url === this.state.url) > -1;

        return (
            <form onKeyDown={this.handleFormKeyDown}>
                <div style={{ display: "flex" }}>
                    <Input
                        style={{ flexGrow: 1 }}
                        type="text"
                        value={url}
                        placeholder={translate("settings.sources.sourceUrl") as string}
                        error={sourceExists}
                        onChange={this.handleUrlChange}
                    />
                    <Button
                        style={{ marginLeft: 5 }}
                        disabled={!url || sourceExists}
                        onClick={this.handleAddClick}
                    >
                        <Translate id="add" />
                    </Button>
                </div>
            </form>
        );
    }
}

export default connect(
    mapStateToProps,
    dispatchProps,
)(withLocalize(AddSourceForm));
