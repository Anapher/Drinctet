import { Weighted } from './../weighted';
export function selectRandomWeighted<T>(items: T[], getWeight: (item: T) => number): T | undefined {
    if (items.length === 0) {
        return undefined;
    }

    const weights: Array<{ item: T; weight: number }> = [];
    let totalWeight: number = 0;
    for (const item of items) {
        const weight = getWeight(item);
        weights.push({ item, weight });

        totalWeight += weight;
    }

    let randomWeight = totalWeight * Math.random();
    for (const { item, weight } of weights) {
        randomWeight -= weight;

        if (randomWeight <= 0) {
            return item;
        }
    }

    throw new Error("No choice could be made");
}

export function selectRandomFromWeightedList<T>(items: Weighted<T>[]) : T | undefined {
    const result = selectRandomWeighted(items, item => item.weight);
    if (result === undefined) {
        return undefined;
    }

    return result.value;
}