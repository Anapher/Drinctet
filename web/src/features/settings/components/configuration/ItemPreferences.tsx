import { Weighted } from "@core/weighted";
import { Typography } from "@material-ui/core";
import { Slider } from "@material-ui/lab";
import * as React from "react";

interface Props {
    items: Weighted<string>[];
    onChangeWeight: (item: Weighted<string>) => void;
    getLabel?: (name: string) => string;
}

class ItemPreferences extends React.Component<Props> {
    render() {
        const { items, onChangeWeight, getLabel } = this.props;

        return (
            <table>
                <tbody>
                    {items.map(x => 
                        <tr key={x.value}>
                            <td>
                                <Typography
                                    style={{
                                        opacity: x.weight === 0 ? 0.5 : 1,
                                    }}
                                >
                                    {getLabel !== undefined ? getLabel(x.value): x.value}
                                </Typography>
                            </td>
                            <td style={{width: "100%"}}>
                                <Slider
                                    max={1}
                                    min={0}
                                    style={{ padding: "20px 0 20px 5px", width: "100%" }}
                                    step={0.05}
                                    value={x.weight}
                                    onChange={(_, v) =>
                                        onChangeWeight({ value: x.value, weight: v })
                                    }
                                />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );

        // return (
        //     <Grid container>
        //         {items.map(x => (
        //             <Grid key={x.value} item container alignItems="center">
        //                 <Grid item>
        //                     <Typography
        //                         style={{
        //                             opacity: x.weight === 0 ? 0.5 : 1,
        //                         }}
        //                     >
        //                         {x.value}
        //                     </Typography>
        //                 </Grid>
        //                 <Grid item xs={8} lg={9}>
        //                     <Slider
        //                         max={1}
        //                         min={0}
        //                         style={{ padding: "20px 0" }}
        //                         step={0.05}
        //                         value={x.weight}
        //                         onChange={(_, v) => onChangeWeight({ value: x.value, weight: v })}
        //                     />
        //                 </Grid>
        //             </Grid>
        //         ))}
        //     </Grid>
        // );
    }
}

export default ItemPreferences;
