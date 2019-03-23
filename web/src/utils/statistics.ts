export function percentageFixedTotal<T>(
    values: T[],
    getPercentage: (x: T) => number,
    target: number,
): Array<{ value: T; part: number }> {
    // https://stackoverflow.com/a/13483486
    const percentageValues = values.map(value => ({ value, percent: getPercentage(value) }));
    const total = percentageValues.reduce((x, y) => x + y.percent, 0);

    const result = new Array<{ value: T; part: number }>();
    let sum = 0;
    let prevBaseline = 0;

    for (let i = 0; i < percentageValues.length; i++) {
        const {value, percent} = percentageValues[i];

        sum += percent / total * target;
        const sumRounded = Math.round(sum);

        result.push({ value, part: sumRounded - prevBaseline });
        prevBaseline = sumRounded;
    }

    return result;
}
