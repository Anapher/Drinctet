import { Gender } from "./../player-info";
import { MelinaAlgorithm } from "./melina-algorithm";
import { PlayerSetting } from "../cards/player-setting";
import { PlayerInfo } from "../player-info";
import { Weighted } from "../weighted";
import seedrandom from "seedrandom";

class MelinaAlgorithmWrapper extends MelinaAlgorithm {
    public testVerifyPlayerSpecification(players: PlayerInfo[], specification: PlayerSetting[]) {
        return this.verifyPlayerSpecification(players, specification);
    }

    public testCheckIfWeightedZero<T>(value: T, weights: Array<Weighted<T>>): boolean {
        return this.checkIfWeightedZero<T>(value, weights);
    }
}

const status = {
    decks: [],
    cardsHistory: [],
    language: "",
    players: [],
    slides: [],
    tags: [],
    arrangements: [],
    preferOppositeGenders: false,
    slidesHistory: [],
    startTime: new Date(),
    willPower: 1
};
const random = seedrandom("test");
const algorithm = new MelinaAlgorithmWrapper(status, () => random());

function player(gender: Gender): PlayerInfo {
    return { id: "", name: "", gender: gender };
}

it("(verifyPlayerSpecification) should correctly match one male", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Female")],
        [{ playerIndex: 1, gender: "Male" }],
    );
    expect(result).toBe(true);
});

it("(verifyPlayerSpecification) should correctly match one female", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Female")],
        [{ playerIndex: 1, gender: "Female" }],
    );
    expect(result).toBe(true);
});

it("(verifyPlayerSpecification) should correctly match none", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Female")],
        [{ playerIndex: 1, gender: "None" }],
    );
    expect(result).toBe(true);
});

it("(verifyPlayerSpecification) should correctly match opposite if male and female exist", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Female")],
        [{ playerIndex: 1, gender: "Opposite" }],
    );
    expect(result).toBe(true);
});

it("(verifyPlayerSpecification) should correctly not match opposite if male and male exist", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Male")],
        [{ playerIndex: 1, gender: "Opposite" }],
    );
    expect(result).toBe(false);
});

it("(verifyPlayerSpecification) should correctly match same if male and male exist", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Male")],
        [{ playerIndex: 1, gender: "Same" }],
    );
    expect(result).toBe(true);
});

it("(verifyPlayerSpecification) should correctly not match same if male and female exist", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Female")],
        [{ playerIndex: 1, gender: "Same" }],
    );
    expect(result).toBe(false);
});

it("(verifyPlayerSpecification) should correctly match male and male to small group", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Female"), player("Male")],
        [{ playerIndex: 1, gender: "Male" }, { playerIndex: 1, gender: "Male" }],
    );
    expect(result).toBe(true);
});

it("(verifyPlayerSpecification) should correctly match male and same to small group", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Female"), player("Male")],
        [{ playerIndex: 1, gender: "Male" }, { playerIndex: 1, gender: "Same" }],
    );
    expect(result).toBe(true);
});

it("(verifyPlayerSpecification) should correctly match female to small group", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Female"), player("Male")],
        [{ playerIndex: 1, gender: "Female" }],
    );
    expect(result).toBe(true);
});

it("(verifyPlayerSpecification) should correctly not match female to small group", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Male"), player("Male")],
        [{ playerIndex: 1, gender: "Female" }],
    );
    expect(result).toBe(false);
});

it("(verifyPlayerSpecification) should correctly not match two female to small group", () => {
    const result = algorithm.testVerifyPlayerSpecification(
        [player("Male"), player("Female"), player("Male")],
        [{ playerIndex: 1, gender: "Female" }, { playerIndex: 1, gender: "Female" }],
    );
    expect(result).toBe(false);
});
