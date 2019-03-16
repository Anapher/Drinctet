import {
    Card,
    CardHeader,
    Typography,
    Link,
    Checkbox,
    withStyles,
    Theme,
    createStyles,
    LinearProgress,
    Badge,
    WithStyles,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { Slider } from "@material-ui/lab";

interface LoadingFailedItemProps {
    errorMessage: string | undefined;
    onReloadClick: () => void;
}

interface WeightProps {
    weight: number;
    onChangeWeight: (value: number) => void;
}

const styles = (theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.paper,
            height: "100%",
        },
        title: {
            textOverflow: "elipsis",
            wordBreak: "break-all",
            overflow: "hidden",
        },
        fullWidth: {
            width: "100%",
        },
    });

interface Props extends LoadingFailedItemProps, WeightProps, WithStyles<typeof styles> {
    url: string;
    isLoading: boolean;
    cardsCount: number;
    weight: number;
    onRemoveClick: () => void;
}

function LoadingItem() {
    return <LinearProgress />;
}

function LoadingFailedItem({ errorMessage, onReloadClick }: LoadingFailedItemProps) {
    return (
        <Typography color="secondary" variant="body1" component="small">
            {`${errorMessage}`}
            <Link
                style={{ marginLeft: 15 }}
                component="button"
                variant="body1"
                onClick={onReloadClick}
            >
                Reload
            </Link>
        </Typography>
    );
}

function WeightSlider({ weight, onChangeWeight }: WeightProps) {
    return (
        <Slider
            max={1}
            min={0}
            step={0.05}
            style={{ margin: 10, padding: '4px 0px' }}
            value={weight}
            onChange={(_, n) => onChangeWeight(n)}
        />
    );
}

function SourcesListItem({
    url,
    classes,
    isLoading,
    errorMessage,
    cardsCount,
    weight,
    onRemoveClick,
    onReloadClick,
    onChangeWeight,
}: Props) {
    return (
        <Badge
            badgeContent={cardsCount}
            color="primary"
            max={9999}
            className={classes.fullWidth}
            showZero={false}
        >
            <Card className={classes.fullWidth}>
                <CardHeader
                    avatar={
                        <Checkbox
                            checked={weight !== 0}
                            style={{ margin: -10 }}
                            onChange={(_, b) => (b ? onChangeWeight(0.5) : onChangeWeight(0))}
                        />
                    }
                    titleTypographyProps={{ className: classes.title }}
                    title={url}
                    action={
                        <IconButton onClick={onRemoveClick}>
                            <DeleteIcon />
                        </IconButton>
                    }
                    subheader={
                        isLoading ? (
                            <LoadingItem />
                        ) : errorMessage ? (
                            <LoadingFailedItem
                                errorMessage={errorMessage}
                                onReloadClick={onReloadClick}
                            />
                        ) : (
                            <WeightSlider weight={weight} onChangeWeight={onChangeWeight} />
                        )
                    }
                />
            </Card>
        </Badge>
    );
}

export default withStyles(styles, { withTheme: true })(SourcesListItem);
