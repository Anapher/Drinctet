import { TextFragment } from "../text-fragment";

export class RandomNumberFragment extends TextFragment {
    constructor(public numbers: RandomNumber[]) {
        super();
    }
}

export interface RandomNumber {
    getCount(): number;
}

export class NumberRange implements RandomNumber {
    constructor(public min: number, public max: number) {}

    getCount(): number {
        return this.max - this.min;
    }
}

export class StaticNumber implements RandomNumber {
    constructor(public i: number) {}

    getCount(): number {
        return 1;
    }
}
