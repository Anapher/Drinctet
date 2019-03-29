import { Gender } from "../../../core/player-info";
import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVenus, faMars } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import { withLocalize, LocalizeContextProps } from "react-localize-redux";

interface Props extends LocalizeContextProps {
    name: string;
    gender: Gender;
    onRemoveClick: () => void;
    onSwapGenderClick: () => void;
    onNameChanged: (name: string) => void;
}

const getIconButtonStyle = (): React.CSSProperties => ({
    margin: -10,
    width: 48,
    height: 48,
});

function PlayerListItem({ name, gender, onRemoveClick, onSwapGenderClick, onNameChanged, translate }: Props) {
    return (
        <div style={{ display: "flex" }}>
            <IconButton
                aria-label="Swap Gender"
                onClick={onSwapGenderClick}
                style={{ ...getIconButtonStyle(), marginRight: 0 }}
            >
                <Icon>
                    <FontAwesomeIcon icon={gender === "Male" ? faMars : faVenus} />
                </Icon>
            </IconButton>
            <Input
                error={!name}
                onBlur={() => {
                    if (!name) onRemoveClick();
                }}
                style={{ flexGrow: 1, marginLeft: 5, marginRight: 5 }}
                placeholder={translate("settings.willBeRemoved") as string}
                value={name}
                onChange={ev => onNameChanged(ev.currentTarget.value)}
            />
            <IconButton
                aria-label="Delete"
                onClick={onRemoveClick}
                style={{ ...getIconButtonStyle(), marginLeft: 0 }}
                tabIndex={-1}
            >
                <DeleteIcon fontSize="default" />
            </IconButton>
        </div>
    );
}

export default withLocalize(PlayerListItem);
