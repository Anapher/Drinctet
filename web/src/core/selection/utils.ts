import { Weighted } from "./../weighted";

type RandomGenerator = () => number;
const defaultRandomGenerator: RandomGenerator = () => Math.random();

export function selectRandomWeighted<T>(
    items: T[],
    getWeight: (item: T) => number,
    random: RandomGenerator = defaultRandomGenerator,
): T | undefined {
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

    let randomWeight = totalWeight * random();
    for (const { item, weight } of weights) {
        randomWeight -= weight;

        if (randomWeight <= 0) {
            return item;
        }
    }

    throw new Error("No choice could be made");
}

export function selectRandomFromWeightedList<T>(
    items: Weighted<T>[],
    random: RandomGenerator = defaultRandomGenerator,
): T | undefined {
    const result = selectRandomWeighted(items, item => item.weight, random);
    if (result === undefined) {
        return undefined;
    }

    return result.value;
}
