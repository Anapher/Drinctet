export class PlayerInfo {
    constructor(public id: string, public name: string, public gender: Gender) {}
}

export type Gender = "Male" | "Female";
