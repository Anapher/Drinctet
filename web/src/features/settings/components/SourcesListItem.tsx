import { Card, CardHeader, LinearProgress, Typography, Link } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";

interface Props {
    url: string;
    isLoading: boolean;
    errorMessage: string | undefined;
    cardsCount: number;
    onRemoveClick: () => void;
    onReloadClick: () => void;
}

function SourcesListItem({
    url,
    isLoading,
    errorMessage,
    cardsCount,
    onRemoveClick,
    onReloadClick,
}: Props) {
    return (
        <Card>
            <CardHeader
                title={<Typography variant="subtitle1">{url}</Typography>}
                subheader={
                    isLoading ? (
                        <LinearProgress />
                    ) : errorMessage ? (
                        <div>
                            <Typography color="secondary" variant="body1" component="small">
                                {`${errorMessage}`}
                                <Link style={{marginLeft: 15}} component="button" variant="body1" onClick={onReloadClick}>
                                    Reload
                                </Link>
                            </Typography>
                        </div>
                    ) : (
                        <Typography>{cardsCount} cards found!</Typography>
                    )
                }
                action={
                    <IconButton onClick={onRemoveClick}>
                        <DeleteIcon />
                    </IconButton>
                }
            />
        </Card>
    );
}

export default SourcesListItem;
