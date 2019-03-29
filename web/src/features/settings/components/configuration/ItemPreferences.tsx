import { Weighted } from "@core/weighted";
import { Grid, Typography } from "@material-ui/core";
import * as React from "react";
import { Slider } from "@material-ui/lab";

interface Props {
    items: Weighted<string>[];
    onChangeWeight: (item: Weighted<string>) => void;
}

class ItemPreferences extends React.Component<Props> {
    render() {
        const { items, onChangeWeight } = this.props;

        return (
            <Grid container>
                {items.map(x => (
                    <Grid key={x.value} item container alignItems="center">
                        <Grid item xs={4} lg={3}>
                            <Typography
                                style={{
                                    opacity: x.weight === 0 ? 0.5 : 1,
                                }}
                            >
                                {x.value}
                            </Typography>
                        </Grid>
                        <Grid item xs={8} lg={9}>
                            <Slider
                                max={1}
                                min={0}
                                style={{ padding: "20px 0"}}
                                step={0.05}
                                value={x.weight}
                                onChange={(_, v) => onChangeWeight({ value: x.value, weight: v })}
                            />
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        );
    }
}

export default ItemPreferences;
